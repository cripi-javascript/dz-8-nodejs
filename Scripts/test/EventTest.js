/*global
 module:     false,
 test:       false,
 equal:      false,
 ok:         false,
 deepEqual:  false,
 BaseEvent:  false,
 Event:      false,
 Collection: false
 */
module("Tests of Event's constructor");
test('Проверка пустого конструктора Event', function () {
    "use strict";
    var event = new Event();
    ok(event instanceof Event);
});
test('Проверка не пустого конструктора Event', function () {
    "use strict";
    var event = new Event(new Event());
    ok(event instanceof Event);
});
test('Начальное время не валидно', function () {
    "use strict";
    var event = new Event(),
        error;
    event.start = "Ой не время";
    error = Event.isValidate(event);
    equal(error.length, 1, "Ошибок больше, чем должно было быть");
    equal(error[0].nameField, "start", "Ошибка возникла в другом поле");
});
test('Дата конца события не валидна', function () {
    "use strict";
    var event = new Event(),
        error;
    event.end = "Ой не время";
    error = Event.isValidate(event);
    equal(error.length, 1, "Ошибок больше, чем должно было быть");
    equal(error[0].nameField, "end", "Ошибка возникла в другом поле");
});
test('Даты перепутаны местами', function () {
    "use strict";
    var event = new Event(),
        error;
    event.start = new Date(100);
    event.end = new Date(1);
    error = Event.isValidate(event);
    equal(error.length, 2, "Ошибок больше или меньше, чем должно было быть");
    equal(error[0].nameField, "start", "Ошибка возникла в другом поле");
    equal(error[1].nameField, "end", "Ошибка возникла в другом поле");

    event.start = new Date(1);
    event.end = new Date(100);
    error = Event.isValidate(event);
    equal(error.length, 0, "Данные корректны!!! ошибки быть не должно");
});
test('Цена посещения положителеное число', function () {
    "use strict";
    var event = new Event(),
        error;
    event.cost = "Ой не число";
    error = Event.isValidate(event);
    equal(error.length, 1, "Ошибок больше или меньше, чем должно было быть");
    equal(error[0].nameField, "cost", "Ошибка возникла в другом поле");

    event.cost = -123;
    error = Event.isValidate(event);
    equal(error.length, 1, "Ошибок больше или меньше, чем должно было быть");
    equal(error[0].nameField, "cost", "Ошибка возникла в другом поле");

    event.cost = 100;
    error = Event.isValidate(event);
    equal(error.length, 0, "Данные корректны!!! ошибки быть не должно");
});
test('Название события от 1 до 18 символов', function () {
    "use strict";
    var event = new Event(),
        error;
    event.name = "";
    error = Event.isValidate(event);
    equal(error.length, 1, "Ошибок больше или меньше, чем должно было быть");
    equal(error[0].nameField, "name", "Ошибка возникла в другом поле");

    event.name = "1234567891012345678910123456789101234567891012345678910123456789101234567891012345678910123456789101234567891012345678910123456789101234567891012345678910";
    error = Event.isValidate(event);
    equal(error.length, 1, "Ошибок больше или меньше, чем должно было быть");
    equal(error[0].nameField, "name", "Ошибка возникла в другом поле");

    event.name = "Что-то важное";
    error = Event.isValidate(event);
    equal(error.length, 0, "Данные корректны!!! ошибки быть не должно");
});

test('GPS - два числа', function () {
    "use strict";
    var event = new Event(),
        error;
    event.gps.x = event.gps.y = "Ой не число";
    error = Event.isValidate(event);
    equal(error.length, 2, "Ошибок больше или меньше, чем должно было быть");
    equal(error[0].nameField, "gps.x", "Ошибка возникла в другом поле");
    equal(error[1].nameField, "gps.y", "Ошибка возникла в другом поле");

    event.gps.x = event.gps.y = 123;
    error = Event.isValidate(event);
    equal(error.length, 0, "Данные корректны!!! ошибки быть не должно");
});
test('Stars - рейтинг = 0,1,2,3,4,5', function () {
    "use strict";
    var event = new Event(),
        error,
        i;
    event.stars  = "Ой не число";
    error = Event.isValidate(event);
    equal(error.length, 1, "Ошибок больше или меньше, чем должно было быть");
    equal(error[0].nameField, "stars", "Ошибка возникла в другом поле");

    event.stars  = 1.1;
    error = Event.isValidate(event);
    equal(error.length, 1, "Ошибок больше или меньше, чем должно было быть");
    equal(error[0].nameField, "stars", "Ошибка возникла в другом поле");

    event.stars  = 6;
    error = Event.isValidate(event);
    equal(error.length, 1, "Ошибок больше или меньше, чем должно было быть");
    equal(error[0].nameField, "stars", "Ошибка возникла в другом поле");

    event.stars  = -1;
    error = Event.isValidate(event);
    equal(error.length, 1, "Ошибок больше или меньше, чем должно было быть");
    equal(error[0].nameField, "stars", "Ошибка возникла в другом поле");

    for (i = 0; i < 5; i += 1) {
        event.stars  = i;
        error = Event.isValidate(event);
        equal(error.length, 0, "Данные корректны!!! ошибки быть не должно");
    }
});