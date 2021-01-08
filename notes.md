# Udemy docker and kubernetes course notes

## 14. Docker run in detail

## 15. Overriding default commands

Override the default command with our command
`docker run <image name> command`.
e.g. `docker run busybox echo hi there`. More useful: "ls" as the command. Which commands are available? Depends on the image.

## 16. Listing running containers

`docker ps`  # shows running containers
(Run `docker busybox ping google.com` to get something running.)

### Include containers that have shutdown

`docker ps --all`

## 17. Container lifecycle

docker run = docker create + docker start

`docker create <image_name>`  # create a container from an image. i.e. set up filesystem snapshot that will be used to create the container.
`docker start <container_id>`

`docker create` returns an id. Can be passed into `docker start -a <container_id>`. -a Attach STDOUT/STDERR and forward signals.

## 18. Restarting stopped containers

`docker start -a <container_id>`

QUESTION: Does docker run create a new image if one already exists?

You can't replace the command of a container you already started before.

## 19. Removing stopped containers

`docker system prune`

## 20. Retrieving log outputs

`docker logs <container_id>`

## 21. Stopping containers

`docker stop <container_id>` (SIGTERM, ask it politely to shudown and clean itself up) or `docker kill <container_id>` (SIGKILL).

Note that docker stop times out at 10 seconds and issues a sigkill by itself.

## 22. Multi-command container (intro)

`docker run redis` Run redis server.

How to run the redis-cli in the same running container?

## 23. Executing commands in running containers

`docker exec -it <container_id> <command>`

-it allows us to provide input directly into the container.

So we can start redis server: `docker run redis`, and then to get to the
cli, `docker exect -it <id> redis-cli`

## 24. The purpose of the -it flag

Need to know more about how linux processes work. Recall that all of our docker containers are running inside of a linux virtual machine. The STDIN, STDOUT, STDERR channels are attached to running processes. -i attaches what we type into our terminal to the STDIN of the process we're going to run. The -t flag routes STDOUT and STDERR to our terminal.

## 25. Getting a command prompt in a container

`docker exec -it <container_id> sh`

## 26. Starting with a shell

You could always run `docker run -it <image_name> sh`, replacing the command with sh.

## 27. Container isolation

Just points out that containers don't share file systems with each other.

## 28. Creating docker images

Create a docker file, pass it to the docker client, which passes it to the docker server, which creates an image.

### Create a Dockerfile
1. Specify a base image
2. Run some commands to install additional programs.
3. Specify a command to run at container startup

## 29. Buildkit for Docker Desktop

This is a text module. It says the output will be different if you have buildkit, but doesn't explain the significance of it. 

## 30. Building a dockerfile

Goal is to create an image that runs redis. Made a directory redis-image.
Dockerfile is the name of the file. Run `docker build .` in the same directory as the Dockerfile.

## 31. Dockerfile teardown

(Explains the contents of the docker file)

## 32. What's a base image?

## 33. The build process in detail

`docker build .` The dot specifies the "build context".

## 35. Rebuilds with cache

## 36. Tagging an image

`docker build -t dantheman39/redis:latest .` You can omit :latest. Technically what's after the colon is the tag. dantheman39 is the repo / project name.

QUESTION: Can we tag an image after building it?

## 38. Manual image generation with docker commit

Recall that for each step in our docker build process, docker is creating intermediate containers, and eventually outputs an image (from which containers could be created...). We could do this manually: create a container, run a command, then generate an image from it. For example, run sh on alpine (`docker run -it alpine sh`), run a command to add redis (`apk add --update redis`), and then in another terminal window, run:

```
docker commit -c 'CMD ["redis-server"]' <container_id>
```

And this creates a new image.

# Section 4: Making real projects with Docker

## 40. Node server setup

simpleweb is the name of the directory

## 41. A few planned errors

## 42. Node version errors note.

Resolution:

```docker
FROM node:alpine

WORKDIR /usr/app
```

## 43. Ports

Map any ports you need to access with -p 8080:8080 (works for docker run, docker create, prolly others).

## 45. Copying build files

`COPY ./ ./`

## 48. Specifying a working directory

Use WORKDIR, to not install all your stuff in the root of the container. (i.e. `WORKDIR /usr/app`)

## 50. Minimizing cache busting and rebuilds

Sample problem: we changed our source code but not our dependencies. We don't want to have to reinstall everything every time.

The solution in this case is instead of copying all of the files, copy just the package.json, then npm install, then copy everything else.

General idea is to copy the minimum amount of files needed for each step to take advantage of the cache. 

# Section 5. Docker compose and multiple local containers

Building a node app that counts number of visits in redis. We want redis and node in separate containers so that multiple instances of the app don't have different numbers of visits.

Project is called visits.

## 54. Introducing Docker Compose

Streamlines setting up networking and running multiple containers.

## 55. Docker compose files

See visits/docker-compose.yml

## 56. Networking with docker compose

Docker compose allows containers to talk to each other, so no config is required right now. In our (redis).createClient() we can pass "redis-server", the name of the service defined in docker-compose.yml, instead of a url, as the host.

## 57. Docker compose commands

`docker run <my_image> -> docker-compose up`
`docker build . ; docker run <my_image> -> docker-compose up --build`

## 58. Stopping docker compose containers

Launch a group of containers in the background:

`docker-compose up -d` 

To shut them down:
`docker-compose down`

## 59. Container maintenance with compose

What to do when one container exits?

## 60. Automatic container restarts

Restart policies:
  - "no"
  - always
  - on-failure
  - unless-stopped  (always attempt to restart unless the developer stops it)

## 61. Container status with docker compose

`docker-compose ps` Note that this works relative to your working directory.

Running from another directory without a docker-compose.yml will raise an error.

# Section 6. Creating a production-grade workflow

Using frontend directory

## 69. Creating Dev dockerfile

We're going to create a dockerfile for development and production

Run docker build with a different file:

`docker build -f Dockerfile.dev .`

## 70. Duplicating dependencies

He recommends deleting node_modules, but I'm just going to add a .dockerignore file.

Speeds up the build significantly.

## 73. Docker volumes

Looks like he's doing something like HMR in his build. Instead of COPYing, we're going to use "docker volumes". We're setting a reference that points back to files on our machine.

`docker run -p 4001:1234 -v /usr/app/node_modules -v $(pwd):/usr/app <image_id>`

Looking at second -v switch, it says map present working directory to /usr/app in our container.

The first switch doesn't have a colon. Why is it necessary?

## 75. Bookmarking volumes

The first -v with no colon, says use the one in the container. As in, don't try to map it.

## 77. Shorthand with docker-compose

Instead of using that crazy long command, we can use docker-compose

## 78. Overriding dockerfile selection

See updated frontend/docker-compose.yml . Note that I needed to add stdin_open: true, as they noted in their notes.

## 83. Docker compose for running tests

You can add another service in docker-compose.

## 86. Shortcomings on testing

The logs from both containers appear in one terminal. His test suite offered interactivity, and he can't get to it. You can't do it in docker compose + npm. He gives a very good explanation as to why.

## 87. Need for nginx

## 88. Multi-step docker builds

We don't actually need the react dependencies after we transpile our app. We only need to keep the build / dist folder. We also need nginx. We'd like to take the result of the "build" phase (from node), and then copy into the "run" phase (from nginx). See frontend/Dockerfile.

# Section 7: Continuous integration and deployment with AWS

We're going to use Travis CI and AWS.

I created a repo docker-react and added it as a submodule to the docker-course repo

I ended up not using Travis, I didn't want to grant it access to graphql's stuff. Going to follow along quickly and hope I don't miss much.
