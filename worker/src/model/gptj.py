import os
from dotenv import load_dotenv
import aiohttp
import asyncio
from multiprocessing import current_process
import time
import requests
import json
from ..redis.config import Redis
from ..schema.chat import Message
from ..redis.producer import Producer


load_dotenv()
redis = Redis()


class GPT:
    def __init__(self):
        self.url = os.environ.get('MODEL_URL')
        self.headers = {
            "Authorization": f"Bearer {os.environ.get('HUGGINFACE_INFERENCE_TOKEN')}"}
        self.payload = {
            "inputs": "",
            "parameters": {
                "return_full_text": False,
                "use_cache": False,
                "max_new_tokens": 25
            }

        }
        self.json_client = redis.create_rejson_connection()
        redis_client = redis.create_connection()
        self.producer = Producer(redis_client)

    async def query(self, input: str) -> list:
        self.payload["inputs"] = f"{input} Bot:"
        data = json.dumps(self.payload)
        response = requests.request(
            "POST", self.url, headers=self.headers, data=data)
        data = json.loads(response.content.decode("utf-8"))
        print(data)

        text = data[0]['generated_text']

        res = str(text.split("Human:")[0]).strip("\n").strip()
        print(res)

        msg = Message(
            msg=res
        )

        stream_data = {}
        stream_data[str(token)] = str(msg.dict())

        await producer.add_to_stream(stream_data, "response_channel")

        await cache.add_message_to_cache(token=token, source="bot", message_data=msg.dict())

        return res
