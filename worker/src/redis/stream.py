from .config import Redis


class StreamConsumer:
    def __init__(self, redis_client):
        self.redis_client = redis_client

    async def consume_stream(self, count: int, block: int,  stream_channel):
        # h = await self.redis_client.xrevrange(stream_channel)
        # last_message = h[0]
        # # Return the last_id
        # last_id = last_message[0].decode("utf-8")
        response = await self.redis_client.xread(
            streams={stream_channel:  '0-0'}, count=count, block=block)

        return response

    async def delete_message(self, stream_channel, message_id):
        await self.redis_client.xdel(stream_channel, message_id)
