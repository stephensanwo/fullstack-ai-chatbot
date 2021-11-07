# Build a full stack AI Chatbot Part I - Introduction

Created: September 11, 2021 10:52 PM
Author: Stephen Sanwo

image_url: https://stephensanwo.fra1.digitaloceanspaces.com/blog/blog-images/article.svg

**Introduction - What we will be building**

Building and deploying a working a full stack application is no small feat, there are lots of factors to consider, you will have to handle the front-end and back-end parts of your application by yourself. This involves thinking about the application architecture, and making decisions that will be critical to the success of your project, such as; what languages to use, what platform to deploy on, are you going to deploy a containerised software on a server, or make use of server-less functions to handle the back-end, do you intend to use third-party APIs to handle complex parts of your application, like authentication or payments?, where do you store the data? added to all that, you'll also need to think about the user interface, design and usability of your application and much more. This is why complex large applications require a multifunctional and team, collaborating to build the app.

One of the best ways to learn how to develop full stack applications is to build projects that cover the end to end development process, from designing the solution architecture, to building the API, developing the user interface, and finally deploying your application. This tutorial will take your through each step using a project based example. The topics we will cover include:

- Building a wrapper to communicate a third party API.
- Building web-sockets for real-time chat application
- Server-side caching with Redis
- Building a chat user interface with React
- Container using your application with Docker
- Deploying your application to AWS

**Important Note:**

This is an intermediate full stack software development project and it requires some level of basic knowledge of Python and JavaScript. Each part of the project has been carefully divided to series, to ensure that you can easily select the phase that is important to you in case you do not wish to code the full application. I also try as much as possible to explain each phase independently so that you can take a phase and run with it.

### Solution **Architecture**

Laying our the structure of your application is a critical first step towards. This gives you an high level overview of your application, the tools you intend to use, and how each component of your application will communicate with each other. Your application architecture can be a simple hand drawl flow chart on paper, however I have made an over engineered architecture drawing below using [draw.io](http://draw.io)

![full-stack-chatbot-architecture.svg](Build%20a%20full%20stack%20AI%20Chatbot%20Part%20I%20-%20Introductio%20256cf00141984916837990913f902eef/full-stack-chatbot-architecture.svg)

1. **The Client/User Interface**: We will use React version 17.0.1. to build the user interface. While we will cover some basics of react during this tutorial, we will not focus a lot on styling, and jsx. All the css files used in this tutorial series can be found here
2. **The GPT-J-6B wrapper**: GPT-J-6B is a generative language model which was trained with 6Billion parameters and performs closely with GPT-3 built by openai, I have chosen to use this an not GPT-3 because this is an open source model and doesn’t require paid token to use. Also vicgalle has build an endpoint that communicates with a version of the model deployed on a TPU instance, this makes it easy for us to use this model without having to deploy on our own TPU instance see the github repo: [https://github.com/vicgalle/gpt-j-api](https://github.com/vicgalle/gpt-j-api). this means that we can connect to the API using the endpoint. We will build a wrapper around this endpoint where we will send our prompts to, then the response will be received from the model.
3. **The Redis Cache:** When we send prompts to GPT, we need a way to temporarily store the prompt and easily retrieve the response. In addition we need to simulate a way to ensure that the model has short term memory, by resending the entire conversation history for the user each time we access the model. This will be done with the aid of our Redis cache which will be running in its own docker container.
4. **Websockets and the conversational API (Chat)**: to communicate with the user in real time, we need to open a socket connection as an HTTP connection will not be sufficient to ensure real time communication between the user and the server.
5.
6. **Containerisation and Continuous Integration**: We will be using docker to containerize both the front end and the backend of our application. and Github Actions for CI
7. **AWS Lightsail**: we will be deploying the container with AWS Lightsail. AWS Lightsail is a lightweight application deployment service that makes it really easy to deploy apps without worrying about servers, and without the complexity of AWS pricing of the other services.

### **Development Environment**

You can use your desired OS to build this app, however, I am currently using a Mac OS, and Visual Studio Code as my code editor. Other development details include:

- Python version 3.8: [https://www.python.org/downloads/release/python-3810/](https://www.python.org/downloads/release/python-3810/)
- React: [https://reactjs.org](https://reactjs.org/)
- Docker: [https://docs.docker.com/desktop/mac/install/](https://docs.docker.com/desktop/mac/install/)

Ensure that you have the required setup done and move on to the next section of this series.

Project Structure

First we create project folder "chatbot" and within this folder we create another folder called "server" which will be with working folder for our server, and another folder called client, which will be our react working folder.

![Untitled](Build%20a%20full%20stack%20AI%20Chatbot%20Part%20I%20-%20Introductio%20256cf00141984916837990913f902eef/Untitled.png)

Next we initialize our git repository within the root of the project folder, using "git init" command and create a .gitignore file by using "touch .gitignore"
