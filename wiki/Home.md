# Build a Fullstack AI Chatbot with Redis, React, FastAPI and GPT

## Part 1 - Introduction - What we will be building

Building a **working** full-stack application requires thinking about the so many moving parts and making decisions that will be critical to the success of your app, such for example, what language you use, what platform to deploy on, and are you going to deploy a containerised software on a server, or make use of server-less functions to handle the backend, do you intend to use third-party APIs to handle complex parts of your application, like authentication or payments? where do you store the data? added to that, you'll also need to think about the user interface, design and usability of your application and much more. This is why complex large applications require a multifunctional development team, collaborating to build the app.

One of the best ways to learn how to develop full stack applications is to build projects that cover the end-to-end development process, from designing the architecture to developing the API services, developing the user interface, and finally deploying your application. This tutorial will take you through each step using a project-based example.
Some of the topics we will cover include:

- Building APIs with Python, FastAPI and WebSockets
- Build Real-time systems with Redis
- Build a Chat User Interface with React

**Important Note:**
_This is an intermediate full stack software development project requiring some basic Python and JavaScript knowledge. The project has been carefully divided into sections, to ensure that you can easily select the phase that is important to you in case you do not wish to code the full application._

### **Solution Architecture**

Sketching out a solution architecture gives you a high-level overview of your application, the tools you intend to use, and how the components will communicate with each other. I have drawn up a simple architecture below using [draw.io](http://draw.io)

![full-stack-chatbot-architecture.svg](docs/full-stack-chatbot-architecture.drawio.svg)

1. **Client/User Interface**: We will use React version 18 to build the user interface. The Chat UI will communicate with the backend via WebSockets

2. **GPT-J-6B and Huggingface Inference API**: GPT-J-6B is a generative language model which was trained with 6 Billion parameters and performs closely with OpenAI's GPT-3 on some tasks, I have chosen to use GPT-J-6B because it is an open-source model and doesn’t require paid token for simple use cases. Huggingface also provides us with an on-demand API to connect with this model pretty much free of charge. Read more about [GPT-J-6B](https://huggingface.co/EleutherAI/gpt-j-6B?text=My+name+is+Teven+and+I+am) and [Hugging Face Inference API](https://huggingface.co/inference-api).

3. **Redis:** When we send prompts to GPT, we need a way to store the prompts and easily retrieve the response. We will use Redis JSON to store the chat data and also use Redis Streams for handling the real-time communication with the huggingface inference API. Redis is an in-memory key-value store that enables super-fast fetching and storing of JSON-like data. For this tutorial, we will use a managed free Redis storage provided by [Redis Enterprise](https://redis.info/3NBGJRT) for testing purposes.

4. **Web Sockets and the Chat API**: To send messages between the client and server in real-time, we need to open a socket connection, as an HTTP connection will not be sufficient to ensure real-time bi-directional communication between the client and the server. We will be using FastAPI for the chat server, as it provides a fast and modern python server for our use. Check out the FastAPI documentation ([https://fastapi.tiangolo.com/advanced/websockets/?h=web](https://fastapi.tiangolo.com/advanced/websockets/?h=web))to learn more about WebSockets.

### **Setting up the Development Environment**

You can use your desired OS to build this app, however, I am currently using a MacOS, and Visual Studio Code. However, ensure you have Python and NodeJs installed. To set up the project structure, create a folder names `fullstack-ai-chatbot` then create two folders within the project `client` and `server` the server will hold the code for the backend, while the client will hold the code for the frontend.

Next within the project directory, initialize a git repository within the root of the project folder, using the "git init" command and create a .gitignore file by using "touch .gitignore"

```bash
git init
touch .gitignore
```

In the next section, we will build our chat web server using FastAPI and Python
