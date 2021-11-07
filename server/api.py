from fastapi import FastAPI
import uvicorn
from src.chat import chat

api = FastAPI()
api.include_router(chat)


@api.get("/test")
async def root():
    return 'Success'


if __name__ == "__main__":
    uvicorn.run("api:api", host="0.0.0.0", port=8759, reload=True)
