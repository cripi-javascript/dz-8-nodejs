var path = require('path'),
    connect = require(__dirname + '\\node_modules\\connect'),
    fs = require('fs'),
    express = require(__dirname + '\\node_modules\\express');

var app = express();
var staticDir = __dirname;

app.use(express.bodyParser());

app.post('/current-event.json', function (request, response) {
            //fs.writeFile('./current-event.json', request.body);
            response.send(JSON.stringify(request.body.data) + "ehelloo");
        });

app.use(express.static(staticDir));

app.listen(8080);