/*global
 Collection: false
 */
(function (toExport) {
    "use strict";
    /**
     * Создает оболочку над массивом событий, предоставляющую "sql" подобные операции
     *
     * @class Оболочка над массивом событий.
     * @augments Collection
     */
    var BaseEvent = function BaseEvent(events) {
        Collection.call(this, events);
    },
        starsComparer,
        dateComparer;

    toExport.BaseEvent = BaseEvent;

    BaseEvent.prototype = Object.create(Collection.prototype, {
        constructor: {
            value: BaseEvent,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    /**
     *
     *@field {BaseEvent}  - ссылка на "родной" конструктор
    */
    BaseEvent.prototype.constructor = BaseEvent;
    /**
     *@function Возвращает новую оболочку, но уже только с прошедшими событиями
     *
     *@return {BaseEvent}
    */
    BaseEvent.prototype.pastEventBase = function () {
        var currentDate = new Date();
        return this.filter(function (event) {
            return event.end.getTime() < currentDate.getTime();
        });
    };
    /**
     * @function Возвращает новую оболочку, но уже только с ненаступившими событиями
     *
     * @return {BaseEvent}
    */
    BaseEvent.prototype.nextEventBase = function () {
        var currentDate = new Date();
        return this.filter(function (event) {
            return event.start.getTime() > currentDate.getTime();
        });
    };
    /**
     * @function Возвращает новую оболочку, но уже с событиями, которые идут в данный момент
     *
     * @return
    */
    BaseEvent.prototype.nowEventBase = function () {
        var currentDate = new Date();
        return this.filter(function (event) {
            return (event.start.getTime() <= currentDate.getTime() && event.end.getTime() >= currentDate.getTime());
        });
    };

    /**
     * @function Возвращает новую оболочку, но уже с событиями, в которых участвует определенный человек
     *
     * @return
     */
    BaseEvent.prototype.withFriend = function (myFriend) {
        return this.filter(function (event) {
            return event.parties.some(function (party) {
                return party.name === myFriend.name;
            });
        });
    };

    /**
     * @function Возвращает новую оболочку, но уже с событиями, которые будут в определенный период
     *
     * @param {Date} fromDate - начала периода
     * @param {Date} toDate - конец периода
     *
     * @return
    */
    BaseEvent.prototype.getEventFromPeriod = function (fromDate, toDate) {
        return this.filter(function (event) {
            return (event.start.getTime() > fromDate.getTime() && event.end.getTime() < toDate.getTime());
        });
    };

    /**
     * @function Возвращает новую оболочку, но уже с событиями, которые стоят не меньше min и не больше max
     *
     * @param {Number} min - начала периода
     * @param {Number} max - начала периода
     *
     * @return {BaseEvent}
     */
    BaseEvent.prototype.getEventWithCost = function (min, max) {
        return this.filter(function (event) {
            return (event.cost >= min && event.cost <= max);
        });
    };

    /**
     * @function Компаратор рейтинга по убыванию
     * @private
     *
     * @field {Date} a
     * @field {Date} b
     *
     * @return {Number}
     */
    starsComparer = function compare(a, b) {
        if (a.stars > b.stars) {
            return -1;
        }
        if (a.stars < b.stars) {
            return 1;
        }
        return 0;
    };
    /**
     * @function Возвращает новую оболочку c теми же событиями, но отсортированными по уменьшению количества звезд
     *
     * @return {BaseEvent}
    */
    BaseEvent.prototype.sortByStars = function (ascending) {
        return this.sortBy(starsComparer, ascending);
    };

    /**
     * @function Компаратор дат по возрастанию
     * @private
     *
     * @field {Date} a
     * @field {Date} b
     *
     * @return {Number}
     */
    dateComparer = function (a, b) {
        if (a.start.getTime() < b.start.getTime()) {
            return -1;
        }
        if (a.start.getTime() > b.start.getTime()) {
            return 1;
        }
        return 0;
    };

    /**
     * @function Возвращает новую оболочку c теми же событиями, но отсортированными по дате
     *
     * @return {BaseEvent}
     */
    BaseEvent.prototype.sortByDate = function (ascending) {
        return this.sortBy(dateComparer, ascending);
    };
}(window));