*You must already have installed Docker on your device*  


# Setup
Setting up [Environment Variables](#environment-variables).  

After setting up env, there are 2 ways to build and run
[docker-compose](#docker-compose) and [Dockerfile](#dockerfile).
**Please choose either Docker Compose or standalone Dockerfile for your workflow. Using both simultaneously may result in configuration conflicts.**.

## docker-compose (easier way)
go to [docker-compose.md](../../docker-compose.md).

## Dockerfile

### 1. build image with this script  
`docker build -t {tag_name} .`  
> *example: `docker build -t jioku_client .`*

### 2. then run with this script  
`docker run --rm -it --env-file .env -p {port}:3000 {tag_name}`
> *example: `docker run --rm -it --env-file .env -p 3000:3000 jioku_client`*<br>
> *(remove `--rm`to keep the container after the server is stopped)*

### 3. use the server address
if you running this on your device normally, you should be able to access this server with 
`http://localhost:{port}`
> *example: `http://localhost:3000`*

to stop the server, press Ctrl+C on the terminal you run `docker run` command on.


### THESE ARE JUST ONE WAY TO USE DOCKER, THERE ARE OTHER WAY MAYBE EVEN BETTER WAY TO USE IT BUT GO LOOK FOR YERSELF, OKIE?
<br><br>

# Environment Variables
copy and rename the .env.example file or make a new file named `.env`  
and put these Environment Variables in

| **Name**                  | **Description**                                              | **Example**                                                       |
|---------------------------|--------------------------------------------------------------|-------------------------------------------------------------------|
| PUBLIC_BACKEND_URL        | Backend server URL that this frontend will talk to           | `http://localhost:8787`                                           |