/*global
 module:     false,
 test:       false,
 equal:      false,
 ok:         false,
 BaseEvent:  false,
 Event:      false,
 Collection: false
*/
module("test simple SQL");
test('add()', function () {
    "use strict";
    var testBase = new BaseEvent([]);
    testBase = testBase.add(new Event({"start": new Date(1), "end": new Date(2)}));
    equal(testBase.items.length, 1);
    ok(testBase instanceof BaseEvent);
    ok(testBase instanceof Collection);
    ok(true, true);
});
test('Фильтры времени', function () {
    "use strict";
    var testBase,
        pastEventBase,
        nextEventBase,
        nowEventBase,
        periodEventBase,
        pastEvent,
        nextEvent,
        nowEvent,
        currentDate;
    currentDate = new Date();
    nowEvent = new Event({
        "start": new Date(currentDate.getTime() - 100000),
        "end": new Date(currentDate.getTime() + 100000),
        "id": "now"
    });
    pastEvent = new Event({
        "start": new Date(currentDate.getTime() - 100000001),
        "end": new Date(currentDate.getTime() - 100000001),
        "id": "past"
    });
    nextEvent = new Event({
        "start": new Date(currentDate.getTime() + 100000000),
        "end": new Date(currentDate.getTime() + 100000100),
        "id": "next"
    });
    testBase = new BaseEvent([pastEvent, nextEvent, nowEvent]);
    pastEventBase = testBase.pastEventBase();
    nextEventBase = testBase.nextEventBase();
    nowEventBase = testBase.nowEventBase();
    periodEventBase = testBase.getEventFromPeriod(new Date(currentDate.getTime() - 200000), new Date(currentDate.getTime() + 200000));
    equal(pastEventBase.items.length, 1);
    ok(pastEventBase.items[0].id === "past");
    equal(nextEventBase.items.length, 1);
    ok(nextEventBase.items[0].id === "next");
    equal(nowEventBase.items.length, 1);
    ok(nowEventBase.items[0].id === "now");
    equal(periodEventBase.items.length, 1);
    ok(periodEventBase.items[0].id === "now");

});
test('Фильтр по другу', function () {
    "use strict";
    var testBase,
        eventWithFriendBase,
        withFriend,
        withoutFriend;
    withFriend = new Event({
        "parties": ["Mangin.Alexander"],
        "id": "ok"
    });
    withoutFriend = new Event();
    testBase = new BaseEvent([withFriend, withoutFriend]);
    eventWithFriendBase = testBase.withFriend("Mangin.Alexander");
    equal(eventWithFriendBase.items.length, 1);
    ok(eventWithFriendBase.items[0].id === "ok");
});
test('Фильтр цены', function () {
    "use strict";
    var testBase, result, less, bigger, free;
    free = new Event();
    less = new Event();
    less.cost = 100;
    less.id = 1;
    bigger = new Event();
    bigger.cost = 999;
    bigger.id = 2;
    testBase = new BaseEvent([less, bigger, free]);

    result = testBase.getEventWithCost(10, 101);
    equal(result.items.length, 1);
    ok(result.items.some(function (event) {
        return event.id === 1;
    }));
});
test('Сортировка по звездам)))', function () {
    "use strict";
    var testBase = new BaseEvent([new Event({"stars": 3}), new Event({"stars": 2}), new Event({"stars": 5})]),
        sortByStarsEventBase = testBase.sortByStars();
    equal(testBase.items.length, sortByStarsEventBase.items.length);
    ok(sortByStarsEventBase.items[0].stars === 5);
    ok(sortByStarsEventBase.items[1].stars === 3);
    ok(sortByStarsEventBase.items[2].stars === 2);
});
test('Сортировка по дате', function () {
    "use strict";
    var testBase = new BaseEvent([new Event({"start": new Date(1), "finish": new Date(2), "id": 2}),
            new Event({"start": new Date(0), "finish": new Date(1), "id": 1}),
            new Event({"start": new Date(2), "finish": new Date(3), "id": 3})]),
        sortByDateEventBase = testBase.sortByDate();
    equal(testBase.items.length, sortByDateEventBase.items.length);
    ok(sortByDateEventBase.items[0].id === 1);
    ok(sortByDateEventBase.items[1].id === 2);
    ok(sortByDateEventBase.items[2].id === 3);
});