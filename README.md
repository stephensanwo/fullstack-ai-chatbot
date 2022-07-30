# Build a Fullstack AI Chatbot with Redis, React, FastAPI and GPT

- Featured on FreeCodeCamp: https://www.freecodecamp.org/news/how-to-build-an-ai-chatbot-with-redis-python-and-gpt/
- Article Wiki: https://github.com/stephensanwo/fullstack-ai-chatbot/wiki
- Follow Full Series: https://blog.stephensanwo.dev/series/build-ai-chatbot
- Subscribe to new technical tutorials: https://blog.stephensanwo.dev

Created: July 02, 2022
Author: Stephen Sanwo

<hr/>

In order to build a working full-stack application, there are so many moving parts to think about. And you'll need to make many decisions that will be critical to the success of your app.

For example, what language will you use and what platform will you deploy on? Are you going to deploy a containerised software on a server, or make use of serverless functions to handle the backend? Do you plan to use third-party APIs to handle complex parts of your application, like authentication or payments? Where do you store the data?

In addition to all this, you'll also need to think about the user interface, design and usability of your application, and much more.

This is why complex large applications require a multifunctional development team collaborating to build the app.

One of the best ways to learn how to develop full stack applications is to build projects that cover the end-to-end development process. You'll go through designing the architecture, developing the API services, developing the user interface, and finally deploying your application.

So this tutorial will take you through the process of building an AI chatbot to help you learn these concepts in depth.

Some of the topics we will cover include:

- How to build APIs with Python, FastAPI, and WebSockets
- How to build real-time systems with Redis
- How to build a chat User Interface with React

**Important Note:**
This is an intermediate full stack software development project that requires some basic Python and JavaScript knowledge.

I've carefully divided the project into sections to ensure that you can easily select the phase that is important to you in case you do not wish to code the full application.

You can download the full repository on [My Github here](https://github.com/stephensanwo/fullstack-ai-chatbot).

### Application Architecture <a name="application-architecture"></a>

Sketching out a solution architecture gives you a high-level overview of your application, the tools you intend to use, and how the components will communicate with each other.

I have drawn up a simple architecture below using [draw.io](http://draw.io):

![full-stack-chatbot-architecture.svg](https://github.com/stephensanwo/fullstack-ai-chatbot/blob/master/docs/full-stack-chatbot-architecture.drawio.svg)

Let's go over the various parts of the architecture in more detail:

### Client/User Interface

We will use React version 18 to build the user interface. The Chat UI will communicate with the backend via WebSockets.

### GPT-J-6B and Huggingface Inference API

GPT-J-6B is a generative language model which was trained with 6 Billion parameters and performs closely with OpenAI's GPT-3 on some tasks.

I have chosen to use GPT-J-6B because it is an open-source model and doesn’t require paid tokens for simple use cases.

Huggingface also provides us with an on-demand API to connect with this model pretty much free of charge. You can read more about [GPT-J-6B](https://huggingface.co/EleutherAI/gpt-j-6B?text=My+name+is+Teven+and+I+am) and [Hugging Face Inference API](https://huggingface.co/inference-api).

### Redis

When we send prompts to GPT, we need a way to store the prompts and easily retrieve the response. We will use Redis JSON to store the chat data and also use Redis Streams for handling the real-time communication with the huggingface inference API.

Redis is an in-memory key-value store that enables super-fast fetching and storing of JSON-like data. For this tutorial, we will use a managed free Redis storage provided by [Redis Enterprise](https://redis.info/3NBGJRT) for testing purposes.

### Web Sockets and the Chat API

To send messages between the client and server in real-time, we need to open a socket connection. This is because an HTTP connection will not be sufficient to ensure real-time bi-directional communication between the client and the server.

We will be using FastAPI for the chat server, as it provides a fast and modern Python server for our use. [Check out the FastAPI documentation](https://fastapi.tiangolo.com/advanced/websockets/?h=web)) to learn more about WebSockets.

Follow the full series here: https://blog.stephensanwo.dev/series/build-ai-chatbot

Created: July 02, 2022
Author: Stephen Sanwo
