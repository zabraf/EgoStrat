let RuleController = require('./js/ruleController');

const app = require('express')();

let server = require('http').Server(app);
// Chargement de socket.io
var io = require('socket.io')(server);

let fs = require('fs');

var ruleController = new RuleController();

const port = 8080;
const hostname = "127.0.0.1";

var isSetUp = false;

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
        response.write(data);
        response.end();
    });

});
var cpt = 0;

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (client) {
    console.log('Un client est connecté !' + client.id);
    client.on('disconnect', function () {
        if(ruleController.player1.username == client.id){
            ruleController.player1.username = ruleController.p1DefaultUsername;
        }
        if(ruleController.player2.username == client.id){
            ruleController.player2.username = ruleController.p2DefaultUsername;
        }
        if(ruleController.player1.username == ruleController.p1DefaultUsername && ruleController.player2.username == ruleController.p2DefaultUsername){
            isSetUp = false;
            ruleController.ResetMap();
            io.sockets.emit('claimed');
        }
        console.log('un client se déconnect !' + client.id);
    });
    client.on('claiming', function (player) {
        switch (player) {
            case 1:
                if (ruleController.player1.username == ruleController.p1DefaultUsername && ruleController.player2.username != client.id) {
                    io.sockets.emit('claimed', player, client.id);
                    ruleController.player1.username = client.id;
                }
                break;
            case 2:
                if (ruleController.player2.username == ruleController.p2DefaultUsername && ruleController.player1.username != client.id) {
                    io.sockets.emit('claimed', player, client.id);
                    ruleController.player2.username = client.id;
                }
                break;
            default:
                break;
        }
        if (!isSetUp && ruleController.player1.username != ruleController.p1DefaultUsername && ruleController.player2.username != ruleController.p2DefaultUsername) {
            ruleController.SetupPlayer();
            isSetUp = true;
        }
    });

    client.emit('Update', UpdateMap(client.id));
    client.on('requestUpdate',function(){
        client.emit('Update',UpdateMap(client.id));
    });
});


function startGame() {
    io.sockets.emit('beginPositioning', piecesToPut);
    io.sockets.on('endPositioning', function (clientId) {
        io.sockets.emit('chatLog', clientId + " has finished placing");
    });
}
function UpdateMap(player = "none") {
    if(typeof player == "undefined"){
        player = "none";
    }

    var datas = {
        'map': ruleController.DrawMap(player),

        'username1': ruleController.player1.username,
        'MARSHAL1': ruleController.player1.listPieces['MARSHAL'],
        'GENERAL1': ruleController.player1.listPieces['GENERAL'],
        'COLONEL1': ruleController.player1.listPieces['COLONEL'],
        'MAJOR1': ruleController.player1.listPieces['MAJOR'],
        'CAPTAIN1': ruleController.player1.listPieces['CAPTAIN'],
        'LIEUTENANT1': ruleController.player1.listPieces['LIEUTENANT'],
        'SERGEANT1': ruleController.player1.listPieces['SERGEANT'],
        'MINER1': ruleController.player1.listPieces['MINER'],
        'SCOUT1': ruleController.player1.listPieces['SCOUT'],
        'SPY1': ruleController.player1.listPieces['SPY'],
        'FLAG1': ruleController.player1.listPieces['FLAG'],
        'BOMB1': ruleController.player1.listPieces['BOMB'],
        'canClaim1': ruleController.player1.username == ruleController.p1DefaultUsername,

        'username2': ruleController.player2.username,
        'MARSHAL2': ruleController.player2.listPieces['MARSHAL'],
        'GENERAL2': ruleController.player2.listPieces['GENERAL'],
        'COLONEL2': ruleController.player2.listPieces['COLONEL'],
        'MAJOR2': ruleController.player2.listPieces['MAJOR'],
        'CAPTAIN2': ruleController.player2.listPieces['CAPTAIN'],
        'LIEUTENANT2': ruleController.player2.listPieces['LIEUTENANT'],
        'SERGEANT2': ruleController.player2.listPieces['SERGEANT'],
        'MINER2': ruleController.player2.listPieces['MINER'],
        'SCOUT2': ruleController.player2.listPieces['SCOUT'],
        'SPY2': ruleController.player2.listPieces['SPY'],
        'FLAG2': ruleController.player2.listPieces['FLAG'],
        'BOMB2': ruleController.player2.listPieces['BOMB'],
        'canClaim2': ruleController.player2.username == ruleController.p2DefaultUsername,
    };
    return datas;
}

server.listen(port, hostname);


