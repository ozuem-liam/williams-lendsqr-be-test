import app from './app';
import Config from './config/config';
import Logger from './config/log';

const { appPort } = Config;

app.listen(appPort, () => {
    Logger.info({}, `server listening on ${appPort}`);
});

async function graceful() {
    // await agenda.stop();
    process.exit(0);
}

process.on('SIGTERM', graceful);

// If the Node process ends, close the Mongoose connection (ctrl + c)
process.on('SIGINT', () => {
    graceful().then(() => Logger.error(new Error('Closing job schedulers')));
});

process.on('uncaughtException', (err) => {
    Logger.error(err, 'Uncaught Exception');
});
