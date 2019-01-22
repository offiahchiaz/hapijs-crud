'use strict';

const Hapi = require('hapi');

// Add Connection
const server = Hapi.server({
    port: 4000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return '<h1>Hello, world again!</h1>';
    }
});

const init = async () => {

    await server.start();
    console.log(`Server running on port ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
