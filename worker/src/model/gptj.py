import os
from dotenv import load_dotenv
import requests
import json
from ..redis.config import Redis
from ..schema.chat import Message


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

    def query(self, input: str) -> list:
        self.payload["inputs"] = f"{input} Bot:"
        data = json.dumps(self.payload)
        response = requests.request(
            "POST", self.url, headers=self.headers, data=data)
        data = json.loads(response.content.decode("utf-8"))
        print(data)

        text = data[0]['generated_text']

        res = str(text.split("Human:")[0]).strip("\n").strip()
        print(res)

        return res
