from fastapi import APIRouter, WebSocket
from .model import GPTJ

chat = APIRouter()

# @route   websocket/chat
# @desc    Route for conversational chat bots
# @access  Public


@chat.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket = WebSocket):

    await websocket.accept()

    while True:
        data = await websocket.receive_text()

        context = f"""{data} Bot:"""

        response = GPTJ.generate(context=context,
                                 token_max_length=128, temperature=1.0, top_probability=0.9)

        await websocket.send_text(f"GPT-J BOT: {response}")

        print(data)


# @chat.websocket("/chat")
# async def websocket_endpoint(websocket: WebSocket = WebSocket):

#     await websocket.accept()

#     while True:
#         data = await websocket.receive_text()

#         await parse_data_to_cache(token=cookie_or_token, data={"Human": f"{data}"})

#         history = await get_data_from_cache(token=cookie_or_token)

#         context = f"""{history} Bot:"""

#         print(context)

#         response = GPTJ.generate(context=context,
#                                  token_max_length=128, temperature=1.0, top_probability=0.9)

#         await parse_data_to_cache(token=cookie_or_token, data={"Bot": f"{response.strip()}"})

#         await websocket.send_text(f"GPT-J BOT: {response}")
