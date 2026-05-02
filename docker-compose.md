# W H A T
docker-compose in this project is just a shortcut way to easily setup and run everything at once  
all the services are independent, can be setup and run on its own (I think...)

<br>

# H O W
> *You must already have installed **Docker** and **docker-compose***

## 1. Related Environment Variables
every services need environment variables, you must assign .env in each of the services before running,
go and do that on these:
- API: [/api/README.md#Environment Variables](/services/api/README.md#environment-variables)
- Frontend: [/frontend/README.md#Environment Variables](/services/frontend/README.md#environment-variables)
- PaddleOCR: [/paddleocr/README.md#Environment Variables](/services/paddleocr/README.md#environment-variables)
- Redis Stack: [/redis/README.md#Environment Variables](/services/redis/README.md#environment-variables)

after that make another `.env` for **docker-compose** as well, go to [#Environment Variables](#environment-variables).

## 2. Run
> ***Docker** must be running while doing this steps*

execute this script in terminal to run docker-compose for services,  
`docker-compose up --build {service(s)}`  

***Example 1:** `docker-compose up api paddleocr redisstack`*  
***Example 2:** `docker-compose up redisstack`*  
***Example 3:** `docker-compose up`*  
***Note 1:** you can run all at once by not specify any service*
***Note 2:** `--build` can be remove if there is no file changed*

**Stop**  
to stop the running containers execute this press `Ctrl+C` on the terminal you ran  the command on.

or run this script in other terminal:  
`docker-compose stop {service(s)}`

***Example 1:** `docker-compose stop api paddleocr redisstack`*  
***Example 2:** `docker-compose stop redisstack`*  
***Example 3:** `docker-compose stop`*  
***Note:** you can run all at once by not specify any service*.

### Optional: Redis Insight
the file `docker-compose.tools.yml` contain some useful tool, like Redis Insight which is for managing Redis (or Redis Stack in this case), in order to use it execute this script:  
`docker-compose -f docker-compose.tools.yml --build up`

**Stop**   
to stop the running containers execute this press `Ctrl+C` on the terminal you ran the command on.

or run this script in other terminal:   
`docker-compose stop redisinsight`

<br>

# Environment Variables
copy and rename the .env.example file or make a new file named `.env`  
and put these Environment Variables in

| **Name**                       | **Description**                                              | **Example**                                                       |
|--------------------------------|--------------------------------------------------------------|-------------------------------------------------------------------|
| COMPOSE_PROJECT_NAME           | Docker Compose project. name                                  | `jioku_app`                                                       |
| COMPOSE_API_EXPOSE_PORT        | Host port to expose the API service. on                       | `8787`                                                            |
| COMPOSE_FRONTEND_EXPOSE_PORT   | Host port to expose the Frontend service. on                  | `3000`                                                            |
| COMPOSE_PADDLEOCR_HOST         | Hostname/container name of the PaddleOCR. service             | `paddleocr`                                                       |
| COMPOSE_PADDLEOCR_EXPOSE_PORT  | Host port to expose the PaddleOCR service. on                 | `8866`                                                            |
| COMPOSE_REDIS_EXPOSE_PORT      | Host port to expose the Redis Stack service. on               | `6379`                                                            |
| COMPOSE_REDISINSIGHT_EXPOSE_PORT | Host port to expose RedisInsight. on                        | `5540`                                                            |
| COMPOSE_REDISINSIGHT_REDIS_HOST             | Hostname/container name of the Redis Stack service.           | `redisstack`                                                      |
| COMPOSE_REDISINSIGHT_REDIS_PASSWORD         | Password if you use for Redis Stack, for auto connect Redis Stack to RedisInsight (must be the same as the .env in services/redis `--requirepass {password}` but remove the `--requirepass ` out).                                    | `your-redis-password`                                             |

<br>