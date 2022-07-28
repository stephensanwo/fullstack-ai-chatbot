### Table of Contents

- **[Introduction - What we will be building](#introduction)**
  - **[Application Architecture](#application-architecture)**
  - **[Setting up the Development Environment](#application-architecture)**
- **[Section 2 - How to build a Chat Server with Python, FastAPI and WebSockets](#how-to-build-a-chat-server-with-python-fastapi-and-websockets)**

  - **[Setting up the Python Environment](#setting-up-the-python-environment)**
  - **[FastAPI Server Setup](#fastapi-server-setup)**
  - **[Adding routes to the API](#fadding-routes-to-the-api)**
  - **[Generate a chat session token with UUID](#generate-a-chat-session-token-with-uuid)**
  - **[Testing the API with Postman](#testing-the-api-with-postman)**
  - **[Websockets and Connection Manager](#websockets-and-connection-manager)**
  - **[Dependency Injection in FastAPI](#dependency-injection-in-fastapi)**

- **[Section 3 - How to build Real-Time Systems with Redis](#how-to-build-real-time-systems-with-redis)**

  - **[Redis and Distributed Messaging Queues](#redis-and-distributed-messaging-queues)**
  - **[Connecting to a Redis cluster in python with a Redis Client](#connecting-to-a-redis-cluster-in-python-with-a-redis-client)**
  - **[Working with Redis Streams](#working-with-redis-streams)**
  - **[Modelling the Chat data](#modelling-the-chat-data)**
  - **[Working with Redis JSON](#working-with-redis-json)**
  - **[Updating the Token Dependency](#updating-the-token-dependency)**

- **[Section 4 - How to add Intelligence to Chatbots with AI models](#how-to-add-intelligence-to-chatbots-with-ai-models)**
  - **[Getting started with Huggingface](#getting-started-with-huggingface)**
  - **[Interacting with the language model](#interacting-with-the-language-model)**
  - **[Simulating short-term memory for the AI model](#simulating-short-term-memory-for-the-ai-model)**
  - **[Stream Consumer and real-time data pull from the message queue](#stream-consumer-and-real-time-data-pull-from-the-message-queue)**
  - **[Updating the Chat client with the AI response](#updating-the-chat-client-with-the-ai-response)**
  - **[Refresh Token](#refresh-token)**
  - **[Testing the Chat with multiple clients in Postman](#tersing-the-chat-with-multiple-clients-in-postman)**
