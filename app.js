
const port = 8080;
const hostname = "127.0.0.1";

//Inclusion des fichiers externes
let RuleController = require('./js/ruleController');
const app = require('express')();
let server = require('http').Server(app);
var io = require('socket.io')(server);
let fs = require('fs');

//Création des variables
var ruleController = new RuleController();
var isSetUp = false;
var hasFinishedPositioning;
var turn = null;
var hasFinishedPositioning = 0;

//Chemin pour les images
app.get('/img/*', function (req, response) {
    //Défini les options
    var options = {
        root: __dirname + '/Client/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    //Renvoi l'image ou une erreur
    fs.exists('./Client' + req.path, function (exists) {
        if (exists) {
            response.sendFile(req.path, options);
        } else {
            response.status(404).send("T'es trop con ça existe pas");
        }
    });
});

//Chemin pour le jeu de base
app.get('/', function (req, response) {
    //Le serveur renvoi le contenu de index.html
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.readFile('./Client/index.html', 'utf8', function (err, data) {
        if (err) throw err;
        response.write(data);
        response.end();
    });
});

// Quand un client se connecte, il s'est connecté
io.sockets.on('connection', function (client) {
    client.on('surrend', function () {
        //Défini qui gagne si on se rend
        if (ruleController.player1.username == client.id) {
            io.sockets.emit('win', ruleController.player2.username + " won");
        }
        if (ruleController.player2.username == client.id) {
            io.sockets.emit('win', ruleController.player1.username + " won");
        }
    });
    client.on('changeName', function (newName) {
        //Empêche de prendre un nom déjà existant
        if (ruleController.player1.username != newName && ruleController.player2.username != newName) {
            //Vérifie le nom du client et lui donne ce nom
            if (ruleController.player1.username == client.id) {
                if (turn == ruleController.player1.username) {
                    turn = newName;
                }
                ruleController.player1.username = newName;
            }
            if (ruleController.player2.username == client.id) {
                if (turn == ruleController.player2.username) {
                    turn = newName;
                }
                ruleController.player2.username = newName;
            }
            
            ancientId = client.id;
            client.id = newName;
            io.sockets.emit('nameChanged', ancientId, newName);
        }
    })
    // Permet de changer les variables lorsque l'utilisateur se deconnecte
    client.on('disconnect', function () {
        if (turn == client.id) {
            turn = null;
        }
        if (ruleController.player1.username == client.id) {
            ruleController.player1.username = ruleController.p1DefaultUsername;
            io.sockets.emit('RequestUpdate');
            if(hasFinishedPositioning < 2){
                hasFinishedPositioning++;
            }
        }
        if (ruleController.player2.username == client.id) {
            ruleController.player2.username = ruleController.p2DefaultUsername;
            io.sockets.emit('RequestUpdate');
            if(hasFinishedPositioning < 2){
                hasFinishedPositioning++;
            }
        }
        //Reset game if both player disconnected
        if (ruleController.player1.username == ruleController.p1DefaultUsername && ruleController.player2.username == ruleController.p2DefaultUsername) {
            isSetUp = false;
            ruleController.ResetGame();
            io.sockets.emit('RequestUpdate');
        }
    });
    
    client.on('claiming', function (player) {
        turn = client.id;
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
        //Démarre le jeu si nécessaire
        if (!isSetUp && ruleController.player1.username != ruleController.p1DefaultUsername && ruleController.player2.username != ruleController.p2DefaultUsername) {

            isSetUp = true;
            startGame();
        }
    });

    //Envoi les positions ou la piece en x y peut aller
    client.on('whereCanGo', function (x, y) {
        if (turn == client.id && hasFinishedPositioning >= 2) {
            ruleController.WherePieceCanGo(ruleController.map[x][y]);
            client.emit('redrawMap', ruleController.DrawMap(client.id));
            ruleController.Unselect();
        }
    });

    // permet de changer une tile en mode "selectionner"
    client.on('select', function (x, y) {
        ruleController.map[x][y].selected = true;
        client.emit('redrawMap', ruleController.DrawMap(client.id, true));
        ruleController.map[x][y].selected = false;
    });

    //Inverse deux pièces pendant le placement
    client.on('switch', function (x1, y1, x2, y2) {
        var tmp = ruleController.map[x1][y1].piece;
        ruleController.map[x1][y1].piece = ruleController.map[x2][y2].piece;
        ruleController.map[x2][y2].piece = tmp;
        client.emit('redrawMap', ruleController.DrawMap(client.id));
    });
    //Met à jour
    client.emit('Update', UpdateMap(client.id));
    // Recupere la demande de mise à jour et met à jours
    client.on('WantUpdate', function () {
        client.emit('Update', UpdateMap(client.id));
    });

    //Fait un déplacement
    client.on('heyMateGoHere', function (selectedX, selectedY, x, y) {
        //Vérifie si c'est pendant le positionnement
        if (hasFinishedPositioning >= 2) {
            var tileDeparture = ruleController.map[selectedX][selectedY];
            var tileArrival = ruleController.map[x][y];
            
            //Launch chatlog for move
            var logMove = ruleController.MovePiece(tileDeparture, tileArrival);
            if (logMove != null) {
                io.sockets.emit('chatlog', logMove);
            }  
                     
            //Change turn
            if (turn == ruleController.player1.username) {
                turn = ruleController.player2.username;
            } else {
                turn = ruleController.player1.username;
            }

            //
            if (ruleController.CheckWin(ruleController.player1, ruleController.player2)) {
                io.sockets.emit('win', ruleController.player1.username + " won");
                ruleController.ResetGame();
                hasFinishedPositioning=0;
                isSetUp = false;
            } else if (ruleController.CheckWin(ruleController.player2, ruleController.player1)) {
                io.sockets.emit('win', ruleController.player2.username + " won");
                ruleController.ResetGame();
                hasFinishedPositioning=0;
                isSetUp = false;
            } else {
                io.sockets.emit('RequestUpdate');
            }
        }
    });
    //affiche le message expliquant qu'un utililisateur à fini de positionner ses pièces
    client.on('endPositioning', function () {
        io.sockets.emit('chatlog', client.id + " has finished placing");
        hasFinishedPositioning++;
    });
});

//Routine de début de jeu
function startGame() {
    ruleController.SetupPlayer();
    hasFinishedPositioning = 0;
    io.sockets.emit('beginPositioning');
}


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

        'defaultSet': ruleController.defaultListOfPieces,

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
        
        'turn': turn,
    };
    return datas;
}

//Lance le serveur
server.listen(port, hostname);


