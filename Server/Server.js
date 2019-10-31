let RuleController = require('./js/ruleController');
let http = require('http');
let fs = require('fs');

const port = 30000;
const hostname = "127.0.0.1";
 

let handleRequest = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.readFile('./Client/index.html','utf8',function(err,data){
        if(err) throw err;
        var ruleController = new RuleController();
        data = data.replace("{ map }",ruleController.DrawMap());
                
        
        data = data.replace('{username1}',ruleController.player1.username);
        data = data.replace('{MARSHAL1}',ruleController.player1.listPieces['MARSHAL']);
        data = data.replace('{GENERAL1}',ruleController.player1.listPieces['GENERAL']);
        data = data.replace('{COLONEL1}',ruleController.player1.listPieces['COLONEL']);
        data = data.replace('{MAJOR1}',ruleController.player1.listPieces['MAJOR']);
        data = data.replace('{CAPTAIN1}',ruleController.player1.listPieces['CAPTAIN']);
        data = data.replace('{LIEUTENANT1}',ruleController.player1.listPieces['LIEUTENANT']);
        data = data.replace('{SERGEANT1}',ruleController.player1.listPieces['SERGEANT']);
        data = data.replace('{MINER1}',ruleController.player1.listPieces['MINER']);
        data = data.replace('{SCOUT1}',ruleController.player1.listPieces['SCOUT']);
        data = data.replace('{SPY1}',ruleController.player1.listPieces['SPY']);
        data = data.replace('{FLAG1}',ruleController.player1.listPieces['FLAG']);
        data = data.replace('{BOMB1}',ruleController.player1.listPieces['BOMB']);
                
        
        data = data.replace('{username2}',ruleController.player2.username);
        data = data.replace('{MARSHAL2}',ruleController.player2.listPieces['MARSHAL']);
        data = data.replace('{GENERAL2}',ruleController.player2.listPieces['GENERAL']);
        data = data.replace('{COLONEL2}',ruleController.player2.listPieces['COLONEL']);
        data = data.replace('{MAJOR2}',ruleController.player2.listPieces['MAJOR']);
        data = data.replace('{CAPTAIN2}',ruleController.player2.listPieces['CAPTAIN']);
        data = data.replace('{LIEUTENANT2}',ruleController.player2.listPieces['LIEUTENANT']);
        data = data.replace('{SERGEANT2}',ruleController.player2.listPieces['SERGEANT']);
        data = data.replace('{MINER2}',ruleController.player2.listPieces['MINER']);
        data = data.replace('{SCOUT2}',ruleController.player2.listPieces['SCOUT']);
        data = data.replace('{SPY2}',ruleController.player2.listPieces['SPY']);
        data = data.replace('{FLAG2}',ruleController.player2.listPieces['FLAG']);
        data = data.replace('{BOMB2}',ruleController.player2.listPieces['BOMB']);
        response.write(data);
        response.end();
    });

};

http.createServer(handleRequest).listen(port,hostname);

