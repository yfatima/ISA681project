//const Express = require("express")();
//const Http = require("http").Server(Express);
//const Socketio = require("socket.io")(Http);
//const cors = require('cors');
//var jsonObj = require("./gamedata.json");


const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
app.use(cors());
const Socketio = socketio(server, {
    cors: {
        origins: ["*"],
        handlePreflightRequest:(req, res) => {
            res.writeHead(200, {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST",
                "Access-Control-Allow-Headers": "",
                "Access-Control-Allow-Credentials": true
            });
            res.end();

        }
    }
});


// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header("Access-Control-Allow-Headers",
//   'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization');
//     next();
//   });

const { addUser, removeUser, getUser,
    getUsersInGame, getWords, addWord, getData } = require("./User.js");



// const express = require('express');
// const http = require('http');

// const app = express();
// const server = http.createServer(app);
// const cors = require('cors');
// const Socketio = require('socket.io')(http, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// });
//const Socketio = socketio(server);



// const Socketio = socketio(server);

// http.listen(3000, () => {
//     console.log("Listening at :3000...");
// });

Socketio.on("connection", (socket) => {
    socket.on('join', ({ name, game }, callback) => {

        const { error, user } = addUser(
            { id: socket.id, name, game });

        if (error) return callback(error);

        // Emit will send message to the user
        // who had joined
        socket.emit('message', {
            user: 'admin', text:
                `${user.name},
                    welcome to Lettered Box game.`
        });

        // Broadcast will send message to everyone
        // in the game except the joined user
        socket.broadcast.to(user.game)
            .emit('message', {
                user: "admin",
                text: `${user.name}, has joined`
            });

        socket.join(user.game);

        callback();
    })

    socket.on('startGame', (callback) => {

        Socketio.emit('start', {
            letters: getData(),
            text: "start game"
        });
        callback();
    })

    socket.on('userstatus', (callback) => {
        const user = getUser(socket.id);
        Socketio.emit('status', {
            words: getWords(user.id),
            text: `words already used by ${user.name}`
        });
        callback();
    })

    socket.on('sendMove', (word, callback) => {

        const user = getUser(socket.id);
        Socketio.to(user.game).emit('move',
            { user: user.name, move: word });

        const result = addWord(user.id, word);

        socketio.emit('newword', {
            name: user.name,
            word: word
        });
        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            Socketio.to(user.game).emit('message',
                {
                    user: 'admin', text:
                        `${user.name} had left`
                });
        }
    })

});

server.listen(process.env.PORT || 3000,
    () => console.log(`Server has started.`));
