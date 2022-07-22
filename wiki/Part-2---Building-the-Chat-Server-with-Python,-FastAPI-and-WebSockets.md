## Part 2 - Building the Chat Server with Python, FastAPI and WebSockets

In this section, we will build the chat server using FastAPI to communicate with the user. We will use WebSockets to ensure bi-directional communication between the client and server so that we can send responses to the user in real-time.

### Setting up the Python Environment

To start our server, we need to set up our python environment. Open the project folder within vscode, and open up the terminal.

From the project root, cd into the server directory and run `python3.8 -m venv env`. This will create a [**virtual environment**](https://blog.stephensanwo.dev/virtual-environments-in-python) for our python project, which will be named `env`. To activate the virtual environment, run `source env/bin/activate`

Next, install a couple of libraries in our python environment.

```bash
pip install fastapi uuid uvicorn gunicorn WebSockets python-dotenv aioredis
```

Next create an environment file, by running `touch .env` in the terminal. We will define our app variables and secret variables within the `.env` file. Add your app environment variable and set it to "development" like so `export APP_ENV=development`. Next, we will set up a development server with a FastAPI server.

### FastAPI Server Setup

At the root of the server directory, create a new file named `main.py` then paste the code below for the development sever

```py
from fastapi import FastAPI, Request
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

api = FastAPI()

@api.get("/test")
async def root():
    return {"msg": "API is Online"}


if __name__ == "__main__":
    if os.environ.get('APP_ENV') == "development":
        uvicorn.run("main:api", host="0.0.0.0", port=3500,
                    workers=4, reload=True)
    else:
      pass

```

First we `import FastAPI` and initialize it as `api`, then we `import load_dotenv` from the `python-dotenv` library, and initialize it to load the variables from the `.env` file,

Further, we create a simple test route to test the API. The test route will return a simple JSON response that tells us the API is online. Lastly, we set up the development server, by using `uvicorn.run` and providing the required arguments. The API will run on port `3500`

Finally, run the server in the terminal with `python main.py`, once you see `Application startup complete` in the terminal, navigate to the URL [http://localhost:3500/test](http://localhost:3500/test) on your browser, and you should get a web page like this:

![Test page](docs/images/test-page.png)

### Adding routes to the API

In the next section, we will add routes to our API. Create a new folder named `src`, this is the directory where we all our API code will live. Create a subfolder named `routes`, cd into the folder, create a new file named `chat.py` then add the code below:

```py
import os
from fastapi import APIRouter, FastAPI, WebSocket,  Request

chat = APIRouter()

# @route   POST /token
# @desc    Route to generate chat token
# @access  Public

@chat.post("/token")
async def token_generator(request: Request):
    return None


# @route   POST /refresh_token
# @desc    Route to refresh token
# @access  Public

@chat.post("/refresh_token")
async def refresh_token(request: Request):
    return None


# @route   Websocket /chat
# @desc    Socket for chatbot
# @access  Public

@chat.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket = WebSocket):
    return None

```

We created three endpoints:

- `/token` will be used to issue the user a session token, for access to the chat session. Since the chat app will be open publicly, we do not want to worry about authentication, keeping it simple, but we still need a way to identify each unique user session.
- `/refresh_token` will get the session history for the user, if the connection is lost, as long as the token is still active, and not expired.
- `/chat` will open a WebSocket to send messages between the client and server.

Next, connect the chat route to our main api, first we need to `import chat from src.chat` within our `main.py` file, then we will include the router by literally calling an `include_router` method on the initialized `FastAPI` class and passing chat as the argument. Update your `api.py` code as shown below:

```python
from fastapi import FastAPI, Request
import uvicorn
import os
from dotenv import load_dotenv
from routes.chat import chat

load_dotenv()

api = FastAPI()
api.include_router(chat)


@api.get("/test")
async def root():
    return {"msg": "API is Online"}


if __name__ == "__main__":
    if os.environ.get('APP_ENV') == "development":
        uvicorn.run("main:api", host="0.0.0.0", port=3500,
                    workers=4, reload=True)
    else:
        pass

```

### Generate a chat session token with UUID

To generate a user token we will use `uuid4` to create dynamic routes for our chat endpoint. Since this is a publicly available endpoint, we won't need to go into details about JWTs, and authentication. If you didn't install `uuid` initially, run `pip install uuid`. Next in chat.py, import uuid, and update the `/token` route with the code below:

```py

from fastapi import APIRouter, FastAPI, WebSocket,  Request, BackgroundTasks, HTTPException
import uuid

# @route   POST /token
# @desc    Route generating chat token
# @access  Public

@chat.post("/token")
async def token_generator(name: str, request: Request):

    if name == "":
        raise HTTPException(status_code=400, detail={
            "loc": "name",  "msg": "Enter a valid name"})

    token = str(uuid.uuid4())

    data = {"name": name, "token": token}

    return data

```

In the code above, the client provides their name, which is required, we do a quick check to ensure that the name field is not empty, then generate a token using uuid4. The session data is a simple dictionary for the name and token, ultimately we will need to persist this session data and set a timeout, but for now, we just return it to the client.

### Testing the API with Postman

Because we will be testing a WebSocket endpoint, we need to use a tool like [Postman](https://www.postman.com) that allows this, as the default swagger docs on FastAPI does not support WebSockets. In postman, create a collection for your development environment and send a POST request to `localhost:3500/token` specifying the name as a query parameter and passing it a value. You should get a response as shown below

![token-generator-postman](docs/images/token-generator-postman.png)

### Websockets and Connection Manager

In the src root, create a new folder named `socket`, and add a file named `connection.py`. In this file, we will define the class that controls the connections to our WebSockets, and all the helper methods to connect and disconnect. in `connection.py` add the code below:

```py

from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

```

The `ConnectionManager` class is initialized with an `active_connections` attribute that is a list of active connections. Then the asynchronous `connect` method will accept a `WebSocket`, and add it to the list of active connections, while the `disconnect` method will remove the `Websocket` from the list of active connections. Lastly, the `send_personal_message` method will take in a message and the `Websocket` we want to send the message to and asynchronously send the message.

WebSocket is a very broad topic and we only scraped the surface here. This should however be sufficient to create multiple connections and handle messages to those connections asynchronously. Read more about [FastAPI Websockets](https://fastapi.tiangolo.com/advanced/websockets/?h=depends#using-depends-and-others) and [Sockets Programming](https://realpython.com/python-sockets/)

To use the `ConnectionManager`, import and initialize it within the `src.routes.chat.py`, and update the `/chat` WebSocket route with the code below:

```py
from ..socket.connection import ConnectionManager

manager = ConnectionManager()

@chat.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            await manager.send_personal_message(f"Response: Simulating response from the GPT service", websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket)

```

In the `websocket_endpoint` function, which takes a WebSocket, we add the new websocket to the connection manager and run a `while True` loop, to ensure that the socket stays open, except the socket gets disconnected. While the connection is open, we receive any messages sent by the client with `websocket.receive_test()` and print it to the terminal for now. Then we send a hard-coded response back to the client for now. Ultimately the message received from the clients will be sent to AI Model, and the response sent back to the client will be the response from the AI Model.

In postman, we can test this endpoint by creating a new WebSocket request, and connecting to the WebSocket endpoint `localhost:3500/chat`. When you click connect, the Messages pane will show that the API client is connected to the URL, and a socket is open. To test this, send a message "Hello Bot" to the chat server, and you should get an immediate test response "Response: Simulating response from the GPT service" as shown below:

![Chat Server in Postman](docs/images/postman-chat-test.png)

### Dependency Injection in FastAPI

To be able to distinguish between two different client sessions, and limit the chat sessions, we will use a timed token, passed as a query parameter to the WebSocket connection. In the socket folder, create a file named `utils.py` then add the code below:

```py
from fastapi import WebSocket, status, Query
from typing import Optional

async def get_token(
    websocket: WebSocket,
    token: Optional[str] = Query(None),
):
    if token is None or token == "":
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)

    return token


```

The get_token function receives a WebSocket and token, then checks if the token is None or null. if this is the case, the function returns a policy violation status and if available, the function just returns the token. We will ultimately extend this function later with additional token validation.

To consume this function, we inject it into the `/chat` route. FastAPI provides a Depends class to easily inject dependencies, so we don't have to tinker with decorators. Update the `/chat` route to the following:

```py
from ..socket.utils import get_token

@chat.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket, token: str = Depends(get_token)):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            await manager.send_personal_message(f"Response: Simulating response from the GPT service", websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
```

Now when you try to connect to the `/chat` endpoint is postman, you will get a 403 error. Provide a token as query parameter and provide any value to the token, for now, then you should be able to connect like before, only now the connection requires a token.

![Chat Server with Token Postman](docs/images/postman-chat-test-token.png)

Congratulations on getting this far! your `chat.py` file should now look like this

```py
import os
from fastapi import APIRouter, FastAPI, WebSocket, WebSocketDisconnect, Request, Depends, HTTPException
import uuid
from ..socket.connection import ConnectionManager
from ..socket.utils import get_token


chat = APIRouter()

manager = ConnectionManager()

# @route   POST /token
# @desc    Route to generate chat token
# @access  Public


@chat.post("/token")
async def token_generator(name: str, request: Request):
    token = str(uuid.uuid4())

    if name == "":
        raise HTTPException(status_code=400, detail={
            "loc": "name",  "msg": "Enter a valid name"})

    data = {"name": name, "token": token}

    return data


# @route   POST /refresh_token
# @desc    Route to refresh token
# @access  Public


@chat.post("/refresh_token")
async def refresh_token(request: Request):
    return None


# @route   Websocket /chat
# @desc    Socket for chatbot
# @access  Public

@chat.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket, token: str = Depends(get_token)):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            await manager.send_personal_message(f"Response: Simulating response from the GPT service", websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
```

In the next part of this series, we will focus on handling the state of our application and passing data between client and server.
