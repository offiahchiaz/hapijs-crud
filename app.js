'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Vision = require('vision');
const Handlebars = require('handlebars');
const mongoose = require('mongoose');

const Task = require('./models/task');

mongoose.connect('mongodb://localhost/hapidb', {useNewUrlParser: true})
    .then(() =>  console.log('Connected to database'))
    .catch(err => console.log(err));

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


const init = async () => {

    await server.register(Vision);

    server.views({
        engines: { html: Handlebars},
        path: __dirname + '/views'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.view('index'); 
        }
    });

    // GET Tasks route
    server.route({ 
        method: 'GET',
        path: '/tasks',
        handler: (request, h) => {
            Task.find((err, tasks) => {
                if (!tasks) { console.log('No tasks found')}
                return h.view('task', {
                    
                    tasks
                }); 
            });
        }
    });

    server.route({ 
        method: 'POST',
        path: '/tasks',
        handler: (request, h) => {
            Task.find((err, tasks) => {
                if (!tasks) { console.log('No tasks found')}
                return h.view('task', {
                    
                    tasks
                }); 
            });
        }
    });

    server.route({ 
        method: 'GET',
        path: '/users/{name}',
        handler: (request, h) => {
            return  `${request.params.name}, you are welcome`
        }
    });

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
