import * as redisstack from "core/redisstack/index.js";

let isShuttingDown = false;

async function shutdown(signal?: string) {
    if (isShuttingDown) return;

    isShuttingDown = true;

    console.log("Shutting down...", signal);
    try {
        await Promise.allSettled([
            redisstack.quitRedisClient()
        ])
    }
    finally {
        process.exit(0);
    }
}

function setupShutdown() {
    // Signal Interrupt, Manual Terminate (like Ctrl + C)
    process.on("SIGINT", shutdown);
    // Signal Terminate (like Docker stop???)
    process.on("SIGTERM", shutdown);
}

export {
    shutdown,
    setupShutdown
}