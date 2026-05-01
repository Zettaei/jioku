# W H A T
docker-compose in this project is just a shortcut way to easily setup and run everything at once  
all the services are independent, can be setup and run on its own (I think...)

<br>

# H O W
> *You must already have installed **Docker** and **docker-compose***

## 1. Service's Environment Variables
every services need environment variables, you must assign them before running
you can see how on these:
- API: [/api/README.md#Environment Variables](/services/api/README.md#environment-variables)
- Frontend: [/frontend/README.md#Environment Variables](/services/frontend/README.md#environment-variables)
- PaddleOCR: [/paddleocr/README.md#Environment Variables](/services/paddleocr/README.md#environment-variables)
- Redis Stack: [/redis/README.md#Environment Variables](/services/redis/README.md#environment-variables)


## 2. Run
execute this script in terminal to run docker-compose for services,  
`docker-compose up --build {service(s)}`  
***Example 1:** `docker-compose up api paddleocr redisstack`*  
***Example 2:** `docker-compose up redisstack`*  
***Example 3:** `docker-compose up`*  
***Note 1:** you can run all at once by not specify any service*
***Note 2:** `--build` can be remove if there is no file changed*

to stop the running containers execute this script:
`docker-compose stop {service(s)}`  
***Example 1:** `docker-compose stop api paddleocr redisstack`*  
***Example 2:** `docker-compose stop redisstack`*  
***Example 3:** `docker-compose stop`*  
***Note:** you can run all at once by not specify any service*

<br>

# Environment Variables
copy and rename the .env.example file or make a new file named `.env`  
and put these Environment Variables in

| **Name**                  | **Description**                                              | **Example**                                                       |
|---------------------------|--------------------------------------------------------------|-------------------------------------------------------------------|
| FRONTEND_URL              | Frontend server/client URL this server will talk to          | `http://localhost:3000`                                           |