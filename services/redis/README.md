# W H A T
Redis Stack, A Redis with modules all(or most)-in-one, for this project will use only RedisJSON and RediSEARCH

# W H Y
Use **mainly** for storing Dictionary Data and cache OCR result
it does storing some more cache stuff

# H O W
> *You must already have installed Docker on your device*  

Setting up [Environment Variables](#environment-variables).  

After setting up env, there are 2 ways to build and run
[docker-compose](#docker-compose) and [Dockerfile](#dockerfile).
**Please choose either Docker Compose or standalone Dockerfile for your workflow. Using both simultaneously may result in configuration conflicts.**.

## docker-compose (easier way)
go to [docker-compose.md](../../docker-compose.md).

## Dockerfile

### 1. build image with this script  
`docker build -t {tag_name} .`  
> *example: `docker build -t redisstack .`*

### 2. make a volume to keep the data retain
`docker volume create {volume_name}`
> *example: `docker volume create redis_data`*

### 3. then run with this script  
`docker run --rm -it --env-file .env -p {port}:6379 -v {volume_name}:/data {tag_name}`
> *example: `docker run --rm -it --env-file .env -p 6379:6379 -v redis_data:/data redisstack`*<br>
> *(remove `--rm`to keep the container after the server is stopped)*

### 4. use the server address
if you running this on your device normally, you should be able to access this server with 
`http://localhost:{port}`
> *example: `http://localhost:6379`*

to stop the server, press Ctrl+C on the terminal you run `docker run` command on.


### THESE ARE JUST ONE WAY TO USE DOCKER, THERE ARE OTHER WAY MAYBE EVEN BETTER WAY TO USE IT BUT GO LOOK FOR YERSELF, OKIE?
<br><br>

# Environment Variables
copy and rename the .env.example file or make a new file named `.env`  
and put these Environment Variables in

| **Name**                  | **Description**                                              | **Example**                                                       |
|---------------------------|--------------------------------------------------------------|-------------------------------------------------------------------|
| REDIS_ARGS                | Redis Arguement more infomation on [here](https://redis.io/docs/latest/operate/oss_and_stack/management/config/) | `--requirepass=7355608` |
|                           |                                                             | `--requirepass=password1234`                                      |