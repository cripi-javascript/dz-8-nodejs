var fs = require('fs'),
    express = require('express');

var app = express();
var staticDir = __dirname;

app.post('/current-event.json', function (request, response) {
            var writeStream = fs.createWriteStream('./current-event.json');
            request.pipe(writeStream);
    
            request.on('end', function () {
                writeStream.end();
                response.send("ok");
                response.end();
            });
        });

app.get('/current-event.json', function (request, response) {
            var readStream = fs.createReadStream('./current-event.json');
            readStream.pipe(response);

            readStream.on('close', function () {
                response.end();
            });
});

app.use(express.static(staticDir));

app.listen(8080);