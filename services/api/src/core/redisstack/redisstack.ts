import { ENV_VARS } from "src/config.js";
import { createClient, type RedisClientOptions } from "redis";

const redisOptions: RedisClientOptions = {
    url: ENV_VARS.REDISSTACK_URL.value,
    username: ENV_VARS.REDISSTACK_USERNAME.value,
    password: ENV_VARS.REDISSTACK_PASSWORD.value
}

const redisstack = createClient(redisOptions);

export { redisstack };