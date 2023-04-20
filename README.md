# Beamy technical test

More details about the task in the [original readme](#guidelines) below.

## What's wrong with my work

- SOLID principles weren't always respected
- something more than a simple api was expected
- tests could've been refactored

## How to use

### Level 1

Run `make level1`. It will:

- build the docker container for the api
- run `npm run logs:emit`
- stop the docker container

The parsed logs will be stored in `level1/parsed`.

**Unfortunately, the docker containers must be stopped manually, so a second command must be run: `make stop-level1`.** This is because I couldn't figure out how to make `docker stop` wait for the processes to be done (I've tried using pm2 or forking child processes, to no avail).

#### Dev

To develop, cd to the `level1` folder.

Install the packages with `npm i`.

Run `npm run dev:watch` to use nodemon.

#### Test

Run tests with `npm run test`.

There aren't many tests, I've only added some for `LogService`.

### Level 2

Run `make level2`. It will:

- build the docker container for the api
- build the docker container for the redis server (without RedisInsight)
- run `npm run logs:emit`
- stop the docker containers

The parsed logs will be stored in `level2/redis-data`.

To view them, you can launch a server with [RedisInsight](http://localhost:8001):

- `docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest`
- or `cd level2 && npm run dev:redis`

**Unfortunately, the docker containers must be stopped manually, so a second command must be run: `make stop-level2`.** This is because I couldn't figure out how to make `docker stop` wait for the processes to be done (I've tried using pm2 or forking child processes, to no avail).

#### Dev

To develop, cd to the `level2` folder.

Install the packages with `npm i`.

Launch a local redis server: `npm run dev:redis`.

Run `npm run dev:watch` to use nodemon.

You can view the redis server's contents with [RedisInsight](http://localhost:8001).

Once you're done, stop the redis server: `npm run dev:redis:stop`.

#### Test

Run tests with `npm run test`.

There aren't many tests, I've only added some for `LogService`.

## What I would have done with more time

- add more dev streamlining config: commitlint, husky...
- add more config: parsed folder path, port, redis ports...
- write more unit tests (not sure how useful that would be)
- perhaps write e2e tests (to validate the timeout behavior)
- improve the docker-compose experience to make it useful in dev (especially in level2)
- validate inputs (the POST data)
- made sure the client would never time out

### CI/CD

I've never used github actions so I'd rather explain the expected workflow rather than provide some untested boilerplate code found online or generated with chatgpt/copilot. I also have no experience with GCP so I'll assume it works somewhat the same way as AWS for simple container deployments, ie with a repository (ECR) and a hosting service (ECS).

The pipeline would test the code, build the container image and deploy them to a container service that hosts the API and allows clients to send requests to it.

I'm assuming that the redis server is hosted by a specific service or managed somewhere else anyway, with some IaC.

Here's what I would expect of the CI/CD pipeline to have:

- separate workflows per environment
- a test job that runs tests and makes the workflow fail if they don't pass
- a build job that builds the container image and stores it in a specific repository
- a deployment job that deploys the container image onto a container hosting service, where it'll run
- a notification job or function call to inform developers or other relevant users about the deployment's success or error

Depending on the development flow, it could be a bit more evolved and automatically tag and deploy anytime commits are pushed to the master branch. If there are staging and/or dev environments, the workflows could be similar but depend on actions made on specific branches.

---

**Original readme:**

## Guidelines

- Solve the levels in ascending order
- Only do one commit per level and include the `.git` when submiting your test

Please do the simplest thing that could work for the level you're currently solving.

For higher levels we are interested in seeing code that is:

- Clean
- Extensible
- Reliable
- Reproducible on every environment (using docker for example)

We should be able to run each level running only **one command** (using Makefile for example), and you should provide us clear guideline on how to run your code.
If you think that you need tests, do not hesitate to add some !

If you don't succeed to solve a level, explain us how you would have done it

## Challenge

The challenge needs to be resolved in Typescript.
Each level depends on one Node v18 executable and one to many libraries that you'll have to use.
**You can't modify them.**
Your solution to each level needs to live in the `level{N}` directory.

The purpose of the whole project is to handle logs, these logs look like this:

```
id=0060cd38-9dd5-4eff-a72f-9705f3dd25d9 service_name=api process=api.233 sample#load_avg_1m=0.849 sample#load_avg_5m=0.561 sample#load_avg_15m=0.202
```

## Level 1

Before everything, you'll need to do a `npm install`.

Here you need to write a simple HTTP server that will listen to POST requests on the port 3000 and that will receive logs one by one.

It will parse each sent log and write the result to a JSON file in `./parsed/#{id}.json`. You need to write a JSON in the following format:

```
{
  "id": "2acc4f33-1f80-43d0-a4a6-b2d8c1dbbe47",
  "service_name": "web",
  "process": "web.1089",
  "load_avg_1m": "0.04",
  "load_avg_5m": "0.10",
  "load_avg_15m": "0.31"
}
```

To write a simple HTTP server look at [Express](https://expressjs.com/) or [Fastify](https://www.fastify.io/).

Then you can launch the `npm run logs:emit` command, it will send log messages to the server you have build.

**An important point to consider is that in this command, the POST requests will timeout after 500ms.**

## Level 2

This time your HTTP server need to parse the logs and send them to a Redis `LIST` on a local Redis instance (redis://localhost:6379).

Your HTTP server, after parsing the logs, needs to enrich them with a library called `slowComputation`. Each computation done via this operation should last some time, here more than 1 second.

To understand how to use this library, you can look at the `exampleCompute.ts` file.

You’ll send the resulting JSON in a redis LIST.

Again, you can launch the `npm run logs:emit` command, it will have the same timeout constraint.

### CI/CD (Bonus)

If you succeed in the previous levels you can implement a CI/CD pipeline using github actions.
We don't provide further indications for this exercice, implement the pipeline you think is relevant for this code.
If you don't have enough time, no worry just explain us the steps you would have add in this pipeline.
