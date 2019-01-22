'use strict';

const Hapi = require('hapi');
const Path = require('path');

// Add Connection
const server = Hapi.server({
    port: 4000,
    host: 'localhost',
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'public') 
        }
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return '<h1>Hello, world again!</h1>';
    }
});

server.route({
    method: 'GET',
    path: '/users/{name}',
    handler: (request, h) => {
        return  `${request.params.name}, you are welcome`
    }
});

const init = async () => {

    await server.register(require('inert'));

    server.route({
        method: 'GET',
        path: '/about',
        handler: (request, h) => {
            return h.file('about.html');
        }
    });

    await server.start();
    console.log(`Server running on port ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
