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
var turn = null;

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

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (client) {
    client.on('disconnect', function () {
        if(turn == client.id)
        {
            turn = null;
        }
        if (ruleController.player1.username == client.id) {
            ruleController.player1.username = ruleController.p1DefaultUsername;
            io.sockets.emit('RequestUpdate');
        }
        if (ruleController.player2.username == client.id) {
            ruleController.player2.username = ruleController.p2DefaultUsername;
            io.sockets.emit('RequestUpdate');
        }
        if (ruleController.player1.username == ruleController.p1DefaultUsername && ruleController.player2.username == ruleController.p2DefaultUsername) {
            isSetUp = false;
            ruleController.ResetGame();
            io.sockets.emit('RequestUpdate');
        }
    });
    client.on('claiming', function (player) {
        if(turn ==  null)
        {
            turn = client.id;
        }
        switch (player) {
            case 1:
                if (ruleController.player1.username == ruleController.p1DefaultUsername && ruleController.player2.username != client.id) {
                    io.sockets.emit('RequestUpdate', player, client.id);
                    ruleController.player1.username = client.id;
                }
                break;
            case 2:
                if (ruleController.player2.username == ruleController.p2DefaultUsername && ruleController.player1.username != client.id) {
                    io.sockets.emit('RequestUpdate', player, client.id);
                    ruleController.player2.username = client.id;
                }
                break;
            default:
                break;
        }
        if (!isSetUp && ruleController.player1.username != ruleController.p1DefaultUsername && ruleController.player2.username != ruleController.p2DefaultUsername) {

            isSetUp = true;
           startGame();
        }
    });


    client.on('whereCanGo', function (x, y) {
        if(turn == client.id){
            ruleController.WherePieceCanGo(ruleController.map[x][y]);    
            client.emit('redrawMap', ruleController.DrawMap(client.id));
            ruleController.Unselect();
        }
    });

    client.on('switch',function(x1,y1,x2,y2){
        var tmp = ruleController.map[x1,y1].piece;
        ruleController.map[x1,y1].piece = ruleController.map[x2,y2].piece;
        ruleController.map[x2,y2].piece = tmp;
        client.emit('redrawMap',ruleController.DrawMap(client.id));
    });

    client.emit('Update', UpdateMap(client.id));

    client.on('WantUpdate', function () {
        client.emit('Update', UpdateMap(client.id));
    });
    
    client.on('heyMateGoHere',function(selectedX,selectedY,x,y){
        var tileDeparture = ruleController.map[selectedX][selectedY];
        var tileArrival = ruleController.map[x][y];

        //Launch chatlog for move
        var logMove = ruleController.MovePiece(tileDeparture,tileArrival);
        if(logMove != null){
            io.sockets.emit('chatlog',logMove);
        }

        //Change turn
        if (turn == ruleController.player1.username){
            turn = ruleController.player2.username;
        }else{
            turn = ruleController.player1.username;
        }

        //
        if(ruleController.CheckWin(ruleController.player1,ruleController.player2)){
            io.sockets.emit('win',ruleController.player1.username +" won");
            ruleController.ResetGame();
        }else if(ruleController.CheckWin(ruleController.player2,ruleController.player1)){
            io.sockets.emit('win',ruleController.player2.username +" won");
            ruleController.ResetGame();
        }else{
            io.sockets.emit('RequestUpdate');
        }
    });
});


var hasFinishedPositioning;
function startGame() {
    ruleController.SetupPlayer();
    hasFinishedPositioning = 0;
    io.sockets.emit('beginPositioning');
}

io.sockets.on('endPositioning', function (clientId) {
    io.sockets.emit('chatLog', clientId + " has finished placing");
    hasFinishedPositioning++;
    if (hasFinishedPositioning == 2) {
        turn = ruleController.player1.username
        io.sockets.emit('turn', turn.username);
    }
});

/**
 * Met à jour la carte
 * @param {string} player nom du joueur 
 */
function UpdateMap(player = "none") {
    if (typeof player == "undefined") {
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
        'turn' :  turn,
    };
    return datas;
}



server.listen(port, hostname);


