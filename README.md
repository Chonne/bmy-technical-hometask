# Beamy technical test

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
