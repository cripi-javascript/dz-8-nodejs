var fs = require('fs'),
    express = require('express');

var app = express();
var staticDir = __dirname;

app.post('/current-event.json', function (request, response) {
            var writeStream = fs.createWriteStream('./current-event.json', {'flags': 'a'});
            request.on('data', function (textData) {
                textData = textData.toString()
                                    .replace('[', ",")
                                    .replace(']', "");
                writeStream.write(textData);
            });
            response.send("hello");
            response.end();
        });

app.get('/current-event.json', function (request, response) {
    var readStream = fs.createReadStream('./current-event.json', {'flags': 'r'});
    readStream.on('data', function(textData) {
        response.send('[' + textData + ']');
    });
    response.end();
});

app.use(express.static(staticDir));

app.listen(8080);