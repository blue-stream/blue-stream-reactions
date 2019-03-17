import * as mongoose from 'mongoose';
import * as rabbit from './utils/rabbit';
import { Server } from './server';
import { log } from './utils/logger';
import { config } from './config';
import { ReactionBroker } from './reaction/reaction.broker';
import { RPCServer } from './utils/rpc.server';

process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception', err.stack);
    rabbit.closeConnection();
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection', err);
    rabbit.closeConnection();
    process.exit(1);
});

process.on('SIGINT', async () => {
    try {
        console.log('User Termination');
        await mongoose.disconnect();
        rabbit.closeConnection();
        process.exit(0);
    } catch (error) {
        console.error('Faild to close connections', error);
    }
});

(async () => {
    await mongoose.connect(
        config.db.connectionString,
        { useNewUrlParser: true },
    );

    console.log('[MongoDB] connected');

    log('info' , 'Server Started', `Port: ${config.server.port}`);

    await rabbit.connect();
    await ReactionBroker.subscribe();

    console.log('Starting RPC Server');
    RPCServer.http().listen(config.rpc.port, function () {
        console.log(`RPC server running on port ${config.rpc.port}`);
    });

    console.log('Starting server');
    const server: Server = Server.bootstrap();

    server.app.on('close', () => {
        rabbit.closeConnection();
        mongoose.disconnect();
        console.log('Server closed');
    });
})();
