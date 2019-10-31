let RuleController = require('./js/ruleController');
let http = require('http');
let fs = require('fs');

const port = 30000;
const hostname = "127.0.0.1";
 

let handleRequest = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.readFile('../Client/index.html',function(err,data){
        console.log(data);
    });
    var ruleController = new RuleController();
    var dt = new Date();
    var writed = ruleController.DrawMap()+"<style>.tile {border:1px solid black;width: 50px;height: 50px;display: inline-block;}.go {background-color: green;}.cantgo {background-color: red;}.selected{background-color: greenyellow;}</style>";
    response.write(writed);
    response.end();

};

http.createServer(handleRequest).listen(port,hostname);

