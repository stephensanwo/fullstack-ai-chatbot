from .config import Redis


class Producer:
    def __init__(self, redis_client):
        self.redis_client = redis_client

    async def add_to_stream(self,  data: dict, stream_channel) -> bool:
        try:
            msg_id = await self.redis_client.xadd(name=stream_channel, id="*", fields=data)
            print(f"Message id {msg_id} added to {stream_channel} stream")
            return msg_id

        except Exception as e:
            print(f"Error sending msg to stream => {e}")
