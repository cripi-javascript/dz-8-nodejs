/*global
 FactoryEvent: false,
 FilterEventBase:false,
 TableEventBase: false,
 Event: false,
 confirm:false,
 alert:false,
 Model:false,
 $:false,
 BaseEvent:false,
 console:false
 */
(function (toExport) {
    "use strict";
    /**
     *
     * @param {jQuery} $factory  объект, содержащий фабрику событий
     * @param {jQuery} $filter объект, содержащий различные фильтры
     * @param {jQuery} $table
     * @param {String} baseUrl
     * @constructor контроллер каландаря
     */
    var Calendar = function ($factory, $filter, $table, baseUrl) {
        var cloneCalendar = this;
        this.factory = new FactoryEvent($factory);
        this.filter = new FilterEventBase($filter);
        this.table = new TableEventBase($table);

        this.loadBase(baseUrl);
        this.factory.WriteDefaultEvent();

        this.factory.$container.find("input[type = text], input[type = date]").on("blur", function () {
            cloneCalendar.factory.eventValidation();
        });

        this.factory.$container.find("#SubmitNewEventButton").on("click", function () {
            var eventObj = cloneCalendar.factory.readEvent(),
                errors = Event.isValidate(eventObj),
                isCritical = errors.some(function (element) {
                    return element.isCritical;
                });
            cloneCalendar.factory.eventValidation();
            if (!isCritical) {
                if (errors.length !== 0) {
                    if (confirm('Некоторые незначительные поля некорректны, продолжить?')) {
                        cloneCalendar.saveNewEvent(baseUrl, eventObj);
                        alert("УИИИ!!!");
                    }
                } else {
                    cloneCalendar.saveNewEvent(baseUrl, eventObj);
                    alert("УИИИ!!!");
                }
            }
        });
        //todo это гомосятина ! но почему то у input type = radio, нет события blur
        this.filter.$container.find("input").on("click", function () {
            var newBaseEvent = cloneCalendar.filter.apply(cloneCalendar.baseEvent);
            cloneCalendar.table.updateTable(newBaseEvent);
        });
        this.filter.$container.find("input").on("blur", function () {
            var newBaseEvent = cloneCalendar.filter.apply(cloneCalendar.baseEvent);
            cloneCalendar.table.updateTable(newBaseEvent);
        });
    };
    toExport.Calendar = Calendar;
    Calendar.prototype = Object.create(Model.prototype, {
        constructor: {
            value: Event,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    /**
     * @function Загрузить по url базу событий
     * @param baseUrl {String} url
     *
     */
    Calendar.prototype.loadBase = function (baseUrl) {
        var calendar = this,
            i,
            events;
        $.getJSON(baseUrl, function (date) {
            events = [];
            for (i = 0; i < date.items.length; i += 1) {
                var item = date.items[i];
                events.push(new Event({
                    "start": new Date(item.start),
                    "end": new Date(item.end),
                    "name": item.name,
                    "gps": {
                        "x": parseFloat(item.gps.x),
                        "y": parseFloat(item.gps.y)
                    },
                    "cost": parseFloat(item.cost),
                    "stars": parseInt(item.stars, 10),
                    "parties": item.parties
                }));
            }
            calendar.baseEvent = new BaseEvent(events);
            calendar.table.updateTable(calendar.baseEvent);
        });
    };
    /**
     *
     * @param {String} saveUrl url
     * @param {Object} newEvent новое событие похожий на Event.
     * @function отправляет json с новым событием на сервер
     */
    Calendar.prototype.saveNewEvent = function (saveUrl, newEvent) {
        var cloneCalendar = this,
            newBaseEvent;
        $.post(saveUrl, newEvent)
            .done(function () {
                cloneCalendar.baseEvent.items.push(new Event(newEvent));
                var newBaseEvent = cloneCalendar.filter.apply(cloneCalendar.baseEvent);
                cloneCalendar.table.updateTable(newBaseEvent);
                cloneCalendar.factory.WriteDefaultEvent();
                console.log("Данный удачно сохранились");
            })
            .fail(function () {
                alert("Данные не сохранились. Позвоните в тех поддержку");
                console.log("Данные не сохранились");
            });
        //todo убрать все что ниже как добавиться сервер. Тк будет дублирование
        cloneCalendar.baseEvent.items.push(new Event(newEvent));
        newBaseEvent = cloneCalendar.filter.apply(cloneCalendar.baseEvent);
        cloneCalendar.table.updateTable(newBaseEvent);
        cloneCalendar.factory.WriteDefaultEvent();
    };
}(window));