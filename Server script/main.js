(function () {
    "use strict";
    var express = require('express'),
        optimist = require('optimist').default('port', 8080).default('host', '127.0.0.1'),
        color = require('colors'),
        fs = require('fs'),
        eventValidator = require('./validateEvent.js'),
        guidModule = require('./guid.js'),
        cfg,
        app = express(),
        printDate = function (date) {
            return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
        };
    app.use(express.static("../WebSite"));
    app.use(express.bodyParser());

    app.post("/saveNewEvent", function (req, res) {
        console.log("Обработка запроса на добавления нового события в Бд....".green);
        var newEventRequest = JSON.parse(req.param('request')),
            newEvent;
        if (!eventValidator.validate(newEventRequest)) {
            console.log("Событие не валидное".red);
            res.send({"request": false});
            console.log("Обработка закончена".green);
            return;
        }
        console.log("Событие прошло валидацию");
        newEvent = {
            "start": printDate(new Date(newEventRequest.start)),
            "end": printDate(new Date(newEventRequest.end)),
            "gps": {
                "x": parseFloat(newEventRequest.gps.x),
                "y": parseFloat(newEventRequest.gps.x)
            },
            "name": newEventRequest.name,
            "stars": newEventRequest.stars,
            "cost": newEventRequest.cost,
            "parties": newEventRequest.parties,
            "id": guidModule.GUID.createGUID()
        };
        console.log("Начинаем обновлять БД");
        console.log("Открываем бд");
        fs.readFile("../WebSite/base.json", "utf8", function (err, date) {
            if (err) {
                res.send({"request": false});
                console.log("Открыть бд не удалось".red);
                console.log("Обработка закончена".red);
                return;
            }
            console.log("Файл прочитался");

            var eventList = JSON.parse(date);
            console.log("Файл преобразовали в json");
            eventList.items.push(newEvent);
            console.log("Сохраняем изменение в бд");
            fs.writeFile("../WebSite/base.json", JSON.stringify(eventList), "utf8", function (error) {
                if (error) {
                    res.send({"request": false});
                    console.log("Сохранить Бд не удалось".red);
                    console.log("Обработка закончена".red);
                    return;
                }
                console.log("Все удачно сохранилось");
                console.log("Обработка закончена".green);
                res.send({"request": true, "id": newEvent.id});
            });
        });

    });

    cfg = optimist.argv;
    app.listen(cfg.port, cfg.host);
    console.log("Server up: ".green + cfg.host + ":" + cfg.port);
}());