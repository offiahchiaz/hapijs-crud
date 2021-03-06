'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Vision = require('vision');
const Handlebars = require('handlebars');
const mongoose = require('mongoose');
const Boom = require('boom');

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

    await server.register(require('inert'));
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
 
    // GET  all Tasks route
    server.route({ 
        method: 'GET',
        path: '/tasks',
        handler: async (request, h) => {
            try {
                let tasks = await Task.find({});
                if (!tasks) tasks = [];
                return h.view('tasks_list', {tasks})
            } catch (e) {
                return Boom.badImplementation(e);
            }
        }
    });
    
    // GET Task route
    server.route({
        method: 'GET',
        path: '/task',
        handler: (request, h) => {
            return h.view('task_form');
        }
    });

    // POST Tasks route
    server.route({       
        method: 'POST',
        path: '/task', 
        handler: async (request, h) => {
            let text = request.payload.text;
            let newTask = new Task({text});
            try {
                await newTask.save();
                return h.redirect('/tasks');
            } catch (e) {
                return Boom.badImplementation(e);
            }
        }
    });

    // GET update task route
    server.route({   
        method: 'GET',
        path: '/task/{id}',
        handler: async (request, h) => {
            console.log(request.params.id);
            try {
                let task = await Task.findById(request.params.id).exec();
                return h.view('task_form', {task});
            } catch (e) {
                Boom.badImplementation(e);
            }

        }
    });

    // POST update task route
    server.route({
        method: 'PUT', 
        path: '/task/{id}',
        handler: async (request, h) => {
            let text = request.payload.text;
            console.log(request.params.id);
            try {
                await Task.findByIdAndUpdate(request.params.id, text, {});
                console.log(request.params.id); 
                return h.redirect('/tasks');
            } catch (e) {
                Boom.badImplementation(e);
            }

        }
    })

    server.route({ 
        method: 'GET',
        path: '/users/{name}',
        handler: (request, h) => {
            return  `${request.params.name}, you are welcome`
        }
    });

     

    // server.route({
    //     method: 'GET',
    //     path: '/about',
    //     handler: (request, h) => {
    //         return h.file('about.html');
    //     }
    // });

    await server.start();
    console.log(`Server running on port ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
