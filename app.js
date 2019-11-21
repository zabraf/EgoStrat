let RuleController = require('./js/ruleController');

const app = require('express')();

let server = require('http').Server(app);
// Chargement de socket.io
var io = require('socket.io')(server);

let fs = require('fs');

var ruleController = new RuleController();

const port = 8080;
const hostname = "127.0.0.1";

app.get('/img/*', function (req, response) {
    var options = {
        root: __dirname + '\\Client\\',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    fs.exists('./Client' + req.path, function (exists) {
        if (exists) {
            response.sendFile(req.path, options);
        } else {
            response.status(404).send("T'es trop con ça existe pas");
        }
    });
});

app.get('/', function (req, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.readFile('./Client/index.html', 'utf8', function (err, data) {
        if (err) throw err;

        data = data.replace("{ map }", ruleController.DrawMap());

        data = data.replace('{username1}', ruleController.player1.username);
        data = data.replace('{MARSHAL1}', ruleController.player1.listPieces['MARSHAL']);
        data = data.replace('{GENERAL1}', ruleController.player1.listPieces['GENERAL']);
        data = data.replace('{COLONEL1}', ruleController.player1.listPieces['COLONEL']);
        data = data.replace('{MAJOR1}', ruleController.player1.listPieces['MAJOR']);
        data = data.replace('{CAPTAIN1}', ruleController.player1.listPieces['CAPTAIN']);
        data = data.replace('{LIEUTENANT1}', ruleController.player1.listPieces['LIEUTENANT']);
        data = data.replace('{SERGEANT1}', ruleController.player1.listPieces['SERGEANT']);
        data = data.replace('{MINER1}', ruleController.player1.listPieces['MINER']);
        data = data.replace('{SCOUT1}', ruleController.player1.listPieces['SCOUT']);
        data = data.replace('{SPY1}', ruleController.player1.listPieces['SPY']);
        data = data.replace('{FLAG1}', ruleController.player1.listPieces['FLAG']);
        data = data.replace('{BOMB1}', ruleController.player1.listPieces['BOMB']);
        data = data.replace('{claim1}', ruleController.player1.listPieces['BOMB']);


        data = data.replace('{username2}', ruleController.player2.username);
        data = data.replace('{MARSHAL2}', ruleController.player2.listPieces['MARSHAL']);
        data = data.replace('{GENERAL2}', ruleController.player2.listPieces['GENERAL']);
        data = data.replace('{COLONEL2}', ruleController.player2.listPieces['COLONEL']);
        data = data.replace('{MAJOR2}', ruleController.player2.listPieces['MAJOR']);
        data = data.replace('{CAPTAIN2}', ruleController.player2.listPieces['CAPTAIN']);
        data = data.replace('{LIEUTENANT2}', ruleController.player2.listPieces['LIEUTENANT']);
        data = data.replace('{SERGEANT2}', ruleController.player2.listPieces['SERGEANT']);
        data = data.replace('{MINER2}', ruleController.player2.listPieces['MINER']);
        data = data.replace('{SCOUT2}', ruleController.player2.listPieces['SCOUT']);
        data = data.replace('{SPY2}', ruleController.player2.listPieces['SPY']);
        data = data.replace('{FLAG2}', ruleController.player2.listPieces['FLAG']);
        data = data.replace('{BOMB2}', ruleController.player2.listPieces['BOMB']);
        response.write(data);
        response.end();
    });

});
var cpt = 0;

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (client) {
    cpt ++;
    console.log('Un client est connecté !' + client.id);
    client.on('disconnect', function () {
        cpt --;
        console.log(cpt);
        console.log('un client se déconnect !' + client.id);
    });
    console.log(cpt);
    console.log(client);
    client.on('claiming', function (player,clientId) {
        switch (player) {
            case 1:
                if (ruleController.player1.username == "P1" && ruleController.player2.username != clientId) {
                    io.sockets.emit('claimed', player, clientId);
                    ruleController.player1.username = clientId;
                }
                break;
            case 2:
                if (ruleController.player2.username == "P2" && ruleController.player1.username != clientId) {
                    io.sockets.emit('claimed', player, clientId);
                    ruleController.player2.username = clientId;
                }
                break;
            default:
                break;
        }
        if(ruleController.player1.username != "P1" && ruleController.player2.username != "P2"){
            ruleController.SetupPlayer();
            io.sockets.emit('UpdateMap',ruleController.map);
        }
    });

    client.emit('connected', client.id);
});


function startGame() {

    io.sockets.emit('beginPositioning', piecesToPut);
    io.sockets.on('endPositioning', function (clientId) {
        io.sockets.emit('chatLog', clientId + " has finished placing");
    });
}


server.listen(port, hostname);


