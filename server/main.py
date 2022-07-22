# from fastapi import FastAPI, Request
# import gunicorn.app.base
# import uvicorn
# from fastapi.middleware.cors import CORSMiddleware
# import os
# from dotenv import load_dotenv
# import multiprocessing

# load_dotenv()

# api = FastAPI()

# origins = [""]
# api.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["GET", "POST", ],
#     allow_headers=["Content-Type"]
# )


# def number_of_workers():
#     return (multiprocessing.cpu_count() * 2) + 1


# def handler_app(environ, start_response):
#     response_body = b'Works fine'
#     status = '200 OK'

#     response_headers = [
#         ('Content-Type', 'text/plain'),
#     ]

#     start_response(status, response_headers)

#     return [response_body]


# class StandaloneApplication(gunicorn.app.base.BaseApplication):

#     def __init__(self, app, options=None):
#         self.options = options or {}
#         self.application = app
#         super().__init__()

#     # def load_config(self):
#     #     config = {key: value for key, value in self.options.items()
#     #               if key in self.cfg.settings and value is not None}
#     #     for key, value in config.items():
#     #         self.cfg.set(key.lower(), value)

#     def load(self):
#         return self.application


# @api.get("/test")
# async def root():
#     return {"msg": "API is Online"}


# if __name__ == "__main__":
#     if os.environ.get('APP_ENV') == "development":
#         uvicorn.run("main:api", host="0.0.0.0", port=3500,
#                     workers=4, reload=True)

#     else:
#         options = {
#             'bind': '%s:%s' % ('127.0.0.1', '3500'),
#             'workers': number_of_workers(),
#         }
#     StandaloneApplication(handler_app, options).run()

from fastapi import FastAPI, Request
import uvicorn
import os
from dotenv import load_dotenv
import multiprocessing
from src.routes.chat import chat
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

api = FastAPI()
api.include_router(chat)

origins = ["http://localhost:3000"]
api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Content-Type"]
)


@api.get("/test")
async def root():
    return {"msg": "API is Online"}


if __name__ == "__main__":
    if os.environ.get('APP_ENV') == "development":
        uvicorn.run("main:api", host="0.0.0.0", port=3500,
                    workers=4, reload=True)
    else:
        pass
