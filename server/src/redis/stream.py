
class StreamConsumer:
    def __init__(self, redis_client):
        self.redis_client = redis_client

    async def consume_stream(self, block: int,  stream_channel):
        response = await self.redis_client.xread(
            streams={stream_channel:  '0-0'}, block=block)

        return response

    async def delete_message(self, stream_channel, message_id):
        await self.redis_client.xdel(stream_channel, message_id)
