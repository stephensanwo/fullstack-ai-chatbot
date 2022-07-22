## Part 3 - Building Real-Time Systems with Redis

Our application currently does not store any state, there is no way to identify users or store and retrieve chat data. We are also returning a hard-coded response to the client during chat sessions. In this part of the series, we will cover the following:

- Connecting to a **Redis Cluster** in python and setting up a **Redis Client**
- Storing and retrieving data with **Redis JSON**
- Setting up **Redis Streams** as message queues between a web server and worker environment

### Redis and Distributed Messaging Queues

Redis is an open source in-memory data store used as a database, cache, message broker, and streaming engine. It supports several data structures and is a perfect solution for distributed applications with real-time capabilities. **Redis Enterprise Cloud** is a fully managed cloud service provided by Redis that helps us deploy Redis clusters at an infinite scale without worrying about infrastructure. We will be using a free Redis Enterprise Cloud instance for this tutorial, you can [Get started with Redis Cloud for free here](https://redis.com/try-free/?utm_campaign=write_for_redis) and follow [This tutorial to set up a Redis database and Redis Insight, a GUI to interact with Redis](https://developer.redis.com/create/rediscloud/)

Once you have set up your Redis database, create a new folder in the project root (Outside the server folder) named `worker`. We will isolate our worker environment from the web server so that when the client sends a message to our WebSocket, the web server does not have to handle the request to the third-party service, and resources can be freed up for other users. The background communication with the inference API is handled by this worker service, through Redis.

Requests from all the connected clients are appended to the message queue (producer), while the worker consumes the messages, sends off the requests to the inference API, and appends the response to a response queue. Once the API receives a response, it sends it back to the client. During the trip between the producer and the consumer, the client can send multiple messages, and these messages will be queued up and responded to in order. Ideally, we could have this worker running on a completely different server, in its own environment, but for now, we will create its own python environment on our local machine.

**Why do we need a worker?** Imagine a scenario where the web server also creates the request to the third-party service. This means that while waiting for the response from the third party service during a socket connection, the server is blocked and resources are tied up till the response is obtained from the API. You can try this out by creating a random sleep `time.sleep(10)` before sending the hard-coded response, and sending a new message, then try to connect with a different token in a new postman session. You will notice that the chat session will not connect until the random sleep times out. While we can use asynchronous techniques and worker pools in a more production-focused server set-up, that will also not be sufficient as the number of simultaneous users grow. Ultimately, we want to avoid tying up the web server resources, by using Redis to broker the communication between our chat API and the third-party API.

Next open up a new terminal, cd into the worker folder and create and activate a new python virtual environment similar to what we did in part 1. Next, install the following dependencies:

```bash
pip install aiohttp aioredis python-dotenv
```

### Connecting to a Redis cluster in python with a Redis Client

We will use the aioredis client to connect with the Redis database, and also use the requests library to send requests to the huggingface inference API. Create two files `.env`, and `main.py`. Then create a folder named `src`, create a folder named `redis` and add a new file named `config.py`. In the `.env` file, add the following code, ensure you update the fields with the credentials provided in your Redis Cluster.

```txt
export REDIS_URL=<REDIS URL PROVIDED IN REDIS CLOUD>
export REDIS_USER=<REDIS USER IN REDIS CLOUD>
export REDIS_PASSWORD=<DATABASE PASSWORD IN REDIS CLOUD>
export REDIS_HOST=<REDIS HOST IN REDIS CLOUD>
export REDIS_PORT=<REDIS PORT IN REDIS CLOUD>
```

In config.py add the Redis Class below:

```py
import os
from dotenv import load_dotenv
import aioredis

load_dotenv()

class Redis():
    def __init__(self):
        """initialize  connection """
        self.REDIS_URL = os.environ['REDIS_URL']
        self.REDIS_PASSWORD = os.environ['REDIS_PASSWORD']
        self.REDIS_USER = os.environ['REDIS_USER']
        self.connection_url = f"redis://{self.REDIS_USER}:{self.REDIS_PASSWORD}@{self.REDIS_URL}"

    async def create_connection(self):
        self.connection = aioredis.from_url(
            self.connection_url, db=0)

        return self.connection
```

We create a Redis object and initialize the required parameters from the environment variables, then we create an asynchronous method `create_connection` to create a Redis connection and return the connection pool obtained from the `aioredis` method `from_url`.

Next, we test the Redis connection in main.py by running the code below. This will create a new Redis connection pool, set a simple key "key" and assign a string "value" to it

```py

from src.redis.config import Redis
import asyncio

async def main():
    redis = Redis()
    redis = await redis.create_connection()
    print(redis)
    await redis.set("key", "value")

if __name__ == "__main__":
    asyncio.run(main())

```

Now open Redis Insight (if you followed the tutorial to download and install it) You should see something like this

![Redis Insight Test](docs/images/redis-insight-test.png)

### Working with Redis Streams

Now that we have our worker environment setup, we can create a producer on the web server and a consumer on the worker. First, let's create our Redis class again on the server. In `server.src` create a folder named `redis` and add two files `config.py` and `producer.py`. In `config.py`, add the code below as we did for the worker environment

```py
import os
from dotenv import load_dotenv
import aioredis

load_dotenv()

class Redis():
    def __init__(self):
        """initialize  connection """
        self.REDIS_URL = os.environ['REDIS_URL']
        self.REDIS_PASSWORD = os.environ['REDIS_PASSWORD']
        self.REDIS_USER = os.environ['REDIS_USER']
        self.connection_url = f"redis://{self.REDIS_USER}:{self.REDIS_PASSWORD}@{self.REDIS_URL}"

    async def create_connection(self):
        self.connection = aioredis.from_url(
            self.connection_url, db=0)

        return self.connection
```

In the .env file, also add the Redis credentials:

```txt
export REDIS_URL=<REDIS URL PROVIDED IN REDIS CLOUD>
export REDIS_USER=<REDIS USER IN REDIS CLOUD>
export REDIS_PASSWORD=<DATABASE PASSWORD IN REDIS CLOUD>
export REDIS_HOST=<REDIS HOST IN REDIS CLOUD>
export REDIS_PORT=<REDIS PORT IN REDIS CLOUD>

```

Finally, in `server.src.redis.producer.py` add the following code:

```py

from .config import Redis

class Producer:
    def __init__(self, redis_client):
        self.redis_client = redis_client

    async def add_to_stream(self,  data: dict, stream_channel):
        try:
            msg_id = await self.redis_client.xadd(name=stream_channel, id="*", fields=data)
            print(f"Message id {msg_id} added to {stream_channel} stream")
            return msg_id

        except Exception as e:
            print(f"Error sending msg to stream => {e}")

```

We created a Producer class that is initialized with a Redis client, and we use this client to add data to the stream with the `add_to_stream` method, which takes the data and the Redis channel name. The Redis command for adding data to a stream channel is `xadd` and it has both high-level and low-level functions in aioredis.

Next, to run our newly created Producer, update `chat.py` and the WebSocket `/chat` endpoint like below. Notice the updated channel name `message_channel`

```py

from ..redis.producer import Producer
from ..redis.config import Redis

chat = APIRouter()
manager = ConnectionManager()
redis = Redis()


@chat.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket, token: str = Depends(get_token)):
    await manager.connect(websocket)
    redis_client = await redis.create_connection()
    producer = Producer(redis_client)

    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            stream_data = {}
            stream_data[token] = data
            await producer.add_to_stream(stream_data, "message_channel")
            await manager.send_personal_message(f"Response: Simulating response from the GPT service", websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
```

Next, in postman, create a connection, and send any message number of messages `Hello`. You should have the stream messages printed to the terminal like below:

![Terminal Channel Messages Test](docs/images/terminal-channel-messages-test.png)

In Redis Insight, you will see a new `mesage_channel` created and a time-stamped queue filled with the messages sent from the client. This timestamped queue is important to preserve the order of the messages.

![Redis Insight Channel](docs/images/redis-insight-channel.png)

### Modelling the Chat data

Next, we create a model for our chat messages. Recall that we are sending text data over WebSockets, but our chat data needs to hold more information than just the text, we need to timestamp when the chat was sent, create an ID for each message, and collect data about the chat session, then store this data in a JSON format. This JSON data can be stored in Redis so we don't lose the chat history once the connection is lost, because our WebSocket does not store state.

In `server.src` create a new folder named `schema`, then create a file named `chat.py` in `server.src.schema` add the following code:

```py
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
import uuid


class Message(BaseModel):
    id = uuid.uuid4()
    msg: str
    timestamp = str(datetime.now())


class Chat(BaseModel):
    token: str
    messages: List[Message]
    name: str
    session_start = str(datetime.now())

```

We are using Pydantic's `BaseModel` class to model the chat data. The `Chat` class will hold data about a single Chat session and will store the token, name of the user and an automatically generated timestamp for the chat session start time, using `datetime.now()` The messages sent and received within this chat session are stored with a `Message` class which creates a chat id on the fly using `uuid4`. The only data we need to provide when initializing this `Message` class is the message text.

### Working with Redis JSON

In order to make use of Redis JSON capabilities, to store our chat history, we need to install [rejson](https://github.com/RedisJSON/redisjson-py) provided by Redis labs. In the terminal, cd to `server` and install rejson with `pip install rejson` Then we update our `Redis` class in `server.src.redis.config.py` to include the `create_rejson_connection` method:

```py

import os
from dotenv import load_dotenv
import aioredis
from rejson import Client

load_dotenv()

class Redis():
    def __init__(self):
        """initialize  connection """
        self.REDIS_URL = os.environ['REDIS_URL']
        self.REDIS_PASSWORD = os.environ['REDIS_PASSWORD']
        self.REDIS_USER = os.environ['REDIS_USER']
        self.connection_url = f"redis://{self.REDIS_USER}:{self.REDIS_PASSWORD}@{self.REDIS_URL}"
        self.REDIS_HOST = os.environ['REDIS_HOST']
        self.REDIS_PORT = os.environ['REDIS_PORT']

    async def create_connection(self):
        self.connection = aioredis.from_url(
            self.connection_url, db=0)

        return self.connection

    def create_rejson_connection(self):
        self.redisJson = Client(host=self.REDIS_HOST,
                                port=self.REDIS_PORT, decode_responses=True, username=self.REDIS_USER, password=self.REDIS_PASSWORD)

        return self.redisJson

```

We are adding the `create_rejson_connection` method to connect to Redis with the rejson `Client` This gives us the methods to create and manipulate JSON data in Redis, which are not available with aioredis.

Next, in `server.src.routes.chat.py` we can update the `/token` endpoint to create a new `Chat` instance and store the session data in Redis JSON like so:

```py
@chat.post("/token")
async def token_generator(name: str, request: Request):
    token = str(uuid.uuid4())

    if name == "":
        raise HTTPException(status_code=400, detail={
            "loc": "name",  "msg": "Enter a valid name"})

    # Create new chat session
    json_client = redis.create_rejson_connection()

    chat_session = Chat(
        token=token,
        messages=[],
        name=name
    )

    # Store chat session in redis JSON with the token as key
    json_client.jsonset(str(token), Path.rootPath(), chat_session.dict())

    # Set a timeout for redis data
    redis_client = await redis.create_connection()
    await redis_client.expire(str(token), 3600)


    return chat_session.dict()

```

_NOTE: Because this is a demo app, I do not want to store the chat data in Redis for too long, so I have added a 60-minute time out on the token using the aioredis client (rejson does not implement timeouts). This means that after 60 minutes, the chat session data will be lost, this is necessary because we are not authenticating users, and we want to dump the chat data after a defined period. This step is optional, and you don't have to include it._

Next, in postman, when you send a POST request to create a new token, you will get a structured response like the one below. You can also check Redis Insight to see your chat data stored with the token as a JSON key and the data as a value.

![Token Generator Updated](docs/images/token-generator-updated.png)

### Updating the Token Dependency

Now that we have a token being generated and stored, this is a good time to update the `get_token` dependency in our `/chat` WebSocket, to check for a valid token before starting the chat session. In `server.src.socket.utils.py` update the `get_token` function to check if the token exists in the Redis instance. If it does then we return the token, which means that the socket connection is valid, and if it doesn't exist, we close the connection. The token created by `/token` will cease to exist after 60 minutes, hence we can have a simple logic on the frontend to redirect the user to generate a new token if an error response is generated while trying to start a chat.

```py

from ..redis.config import Redis

async def get_token(
    websocket: WebSocket,
    token: Optional[str] = Query(None),
):

    if token is None or token == "":
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)

    redis_client = await redis.create_connection()
    isexists = await redis_client.exists(token)

    if isexists == 1:
        return token
    else:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Session not authenticated or expired token")

```

To test the dependency, connect to the chat session with the random token we have been using, and you should get a 403 error (Note that you have to manually delete the token in Redis Insight). Now copy the token generated when you sent the post request to the `/token` endpoint (or create a new request) and paste it as the value to the token query parameter required by the `/chat` WebSocket, then connect. You should get a successful connection.

![Chat Session with Token](docs/images/chat-session-with-token.png)

Bringing it all together, your chat.py should look like the below. Well done on reaching it this far, in the next section, we will focus on communicating with the AI model, and handling the data transfer between client, server, worker and the external API.

```py

import os
from fastapi import APIRouter, FastAPI, WebSocket, WebSocketDisconnect, Request, Depends
import uuid
from ..socket.connection import ConnectionManager
from ..socket.utils import get_token
import time
from ..redis.producer import Producer
from ..redis.config import Redis
from ..schema.chat import Chat
from rejson import Path

chat = APIRouter()
manager = ConnectionManager()
redis = Redis()


# @route   POST /token
# @desc    Route to generate chat token
# @access  Public


@chat.post("/token")
async def token_generator(name: str, request: Request):
    token = str(uuid.uuid4())

    if name == "":
        raise HTTPException(status_code=400, detail={
            "loc": "name",  "msg": "Enter a valid name"})

    # Create nee chat session
    json_client = redis.create_rejson_connection()
    chat_session = Chat(
        token=token,
        messages=[],
        name=name
    )

    print(chat_session.dict())

    # Store chat session in redis JSON with the token as key
    json_client.jsonset(str(token), Path.rootPath(), chat_session.dict())

    # Set a timeout for redis data
    redis_client = await redis.create_connection()
    await redis_client.expire(str(token), 3600)

    return chat_session.dict()


# @route   POST /refresh_token
# @desc    Route to refresh token
# @access  Public


@chat.post("/refresh_token")
async def refresh_token(request: Request):
    return None


# @route   Websocket /chat
# @desc    Socket for chat bot
# @access  Public

@chat.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket, token: str = Depends(get_token)):
    await manager.connect(websocket)
    redis_client = await redis.create_connection()
    producer = Producer(redis_client)
    json_client = redis.create_rejson_connection()

    try:
        while True:
            data = await websocket.receive_text()
            stream_data = {}
            stream_data[token] = data
            await producer.add_to_stream(stream_data, "message_channel")
            await manager.send_personal_message(f"Response: Simulating response from the GPT service", websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket)


```
