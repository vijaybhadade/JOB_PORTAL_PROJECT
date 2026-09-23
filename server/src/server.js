const database = require("./config/db");
const env = require("./config/env");
const app = require("./app");

const startServer = async () => {
    try {
        await database();

        app.listen(env.PORT, () => {
            console.log(`Backend started`);
            console.log(`Environment: ${env.nodeEnv}`);
            console.log(`Port: ${env.PORT}`);
            console.log(`Health: http://localhost:${env.PORT}/api/health`);
        });

    } catch (error) {
        console.error("Server failed!");
        console.error(error.message);
        process.exit(1);
    }
};

startServer();