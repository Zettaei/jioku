import { ENV_VARS, REDIS_OPTIONS } from "src/config.js";
import { createClient, type RedisClientType } from "redis";
import { RedisError } from "../errors/internalError.js";

let redis: RedisClientType | null;

async function getRedisClient()
: Promise<RedisClientType> 
{
    if(redis?.isOpen) {
        return redis;
    }

    try {
        redis = createClient({
            url: ENV_VARS.REDISSTACK_URL.value,
            username: ENV_VARS.REDISSTACK_USERNAME.value,
            password: ENV_VARS.REDISSTACK_PASSWORD.value,
            // socket: {
            //     reconnectStrategy: (retries) => {
            //         console.error("Couldn't connect Redis, will retry in " + REDIS_OPTIONS.RETRY_CONNECTION_MS/100 + " seconds")
            //         return REDIS_OPTIONS.RETRY_CONNECTION_MS
            //     }
            // }
        });

        await redis.connect();

        return redis;
    }
    catch(err) {
        redis = null;
        throw new RedisError("Redis Connection Error", "", err);
    }
}

async function quitRedisClient()
: Promise<void>
{
    if(!redis?.isOpen) {
        return;
    }

    try {
        await redis.quit();
    }
    catch {}
    finally {
        redis = null;
    }
}


export { 
    getRedisClient,
    quitRedisClient
};