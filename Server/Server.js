let RuleController = require('./js/ruleController');
let http = require('http');
let fs = require('fs');

const port = 30000;
const hostname = "10.5.51.39";
 

let handleRequest = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    var ruleController = new RuleController();
    var dt = new Date();
    response.write(ruleController.DrawMap());
    response.end();

};

http.createServer(handleRequest).listen(port,hostname);

