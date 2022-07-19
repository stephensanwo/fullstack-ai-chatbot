# import os
# from dotenv import load_dotenv
# from fastapi import APIRouter, HTTPException, BackgroundTasks, WebSocket, Cookie, Depends, FastAPI, Query, WebSocket, status, Request
# from ..model.gptj import GPTJ
# from ..middleware.cache import parse_data_to_cache, get_data_from_cache
# from ..middleware.db import post_user_data
# from typing import Optional
# import uuid
# import aioredis

# chat = APIRouter()

# load_dotenv()
# REDIS_AUTH = os.environ['REDIS_AUTH']

# if os.environ["APP_ENV"] == "production":
#     connection = f"redis://{REDIS_AUTH}@178.62.22.115:6379"
#     print("Connection Okay")

# else:
#     connection = "redis://localhost:6379"

# print(connection)


# async def get_cookie_or_token(
#     websocket: WebSocket,
#     session: Optional[str] = Cookie(None),
#     token: Optional[str] = Query(None),
# ):
#     if session is None and token is None:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)

#     return session or token

# # @route   POST /token
# # @desc    Route generating chat token
# # @access  Public


# @chat.post("/token")
# async def token_generator(name: str, request: Request, background_tasks: BackgroundTasks):
#     token = str(uuid.uuid4())
#     client = request.client.host
#     if name == "":
#         raise HTTPException(status_code=400, detail={
#             "loc": "name",  "msg": "Enter a valid name"})

#     data = {"name": name, "token": token, "ip": client}

#     redis = await aioredis.from_url(connection, db=0)

#     await redis.set(token, str(data))

#     # send info data to db
#     background_tasks.add_task(post_user_data, data)
#     # res = await post_user_data(data)

#     return data


# # @route   POST /refresh_token
# # @desc    Route refreshing token
# # @access  Public
# @chat.post("/refresh_token")
# async def refresh_token(token: str):

#     redis = await aioredis.from_url(connection, db=0)
#     await redis.delete(token)

#     return None


# # @route   Websocket /chat
# # @desc    Route for gallium conversational bots
# # @access  Public

# @chat.websocket("/chat/{id}")
# async def websocket_endpoint(websocket: WebSocket = WebSocket, id: str = str, token: Optional[str] = None, cookie_or_token: str = Depends(get_cookie_or_token), background_tasks: BackgroundTasks = BackgroundTasks()):
#     await websocket.accept()
#     while True:
#         data = await websocket.receive_text()

#         await parse_data_to_cache(token=cookie_or_token, data={"Human": f"{data}"})

#         history = await get_data_from_cache(token=cookie_or_token)

#         context = f"""{history} Bot:"""

#         print(context)

#         # response = f"GPT-J-6b is currently offline, please try again later {id}"

#         response = GPTJ.generate(context=context,
#                                  token_max_length=128, temperature=1.0, top_probability=0.9)

#         await parse_data_to_cache(token=cookie_or_token, data={"Bot": f"{response.strip()}"})

#         await websocket.send_text(f"GPT-J BOT: {response}")


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
from ..redis.stream import StreamConsumer

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
    consumer = StreamConsumer(redis_client)

    try:
        while True:
            data = await websocket.receive_text()
            stream_data = {}
            stream_data[str(token)] = str(data)
            await producer.add_to_stream(stream_data, "message_channel")
            response = await consumer.consume_stream(stream_channel="response_channel", count=1, block=0)

            print(response)
            if response:
                for stream, messages in response:
                    for message in messages:
                        message_id = message[0]
                        response_token = [k.decode('utf-8')
                                          for k, v in message[1].items()][0]
                        message = [v.decode('utf-8')
                                   for k, v in message[1].items()][0]
                        print(token)
                        print(response_token)
                        if response_token == token:
                            await manager.send_personal_message(message, websocket)

                            await consumer.delete_message(stream_channel="response_channel", message_id=message_id)

    except WebSocketDisconnect:
        manager.disconnect(websocket)


# async def websocket_endpoint(websocket: WebSocket = WebSocket, id: str = str, token: Optional[str] = None, cookie_or_token: str = Depends(get_cookie_or_token)):
#     await websocket.accept()
#     while True:
#         data = await websocket.receive_text()

#         await parse_data_to_cache(token=cookie_or_token, data={"Human": f"{data}"})

#         history = await get_data_from_cache(token=cookie_or_token)

#         context = f"""{history} Bot:"""

#         print(context)

#         # response = f"GPT-J-6b is currently offline, please try again later {id}"

#         response = GPTJ.generate(context=context,
#                                  token_max_length=128, temperature=1.0, top_probability=0.9)

#         await parse_data_to_cache(token=cookie_or_token, data={"Bot": f"{response.strip()}"})

#         await websocket.send_text(f"GPT-J BOT: {response}")
