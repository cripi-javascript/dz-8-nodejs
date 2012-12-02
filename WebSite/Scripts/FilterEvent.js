/*global
$:false,
console:false
 */
(function (toExport) {
    "use strict";
    var FilterEventBase = function ($container) {
        this.$container = $container;
    },
        readFilter = function ($container) {
            var timeStatusFilter = $container.find('[name = "TimeStatusFilter"]').filter("input:checked").val(),
                costFilter = $container.find('[name = "CostFilter"]').filter("input:checked").val(),
                sortFilter = $container.find('[name = "Sort"]').filter("input:checked").val();
            return [timeStatusFilter,
                costFilter,
                sortFilter
                ];
        };
    /**
     *
     * @function применить группу фильтров к базе base, содержащей события календаря
     * @param {BaseEvent} base база к которой применится группа фильтров
     * @return {BaseEvent} база с примененными фильтрами
     */
    FilterEventBase.prototype.apply = function (base) {
        var filters = readFilter(this.$container),
            newBase = base,
            filterModule = this;
        $.each(filters, function (i, filter) {
            if (filterModule[filter]) {
                newBase = filterModule[filter](newBase);
            } else {
                console.log("Фильтр не обнаружен: " + filter);
            }
        });
        return newBase;
    };
    /**
     *
     * @function фильтр пустышка
     * @param {BaseEvent} base база к которой применится фильтр
     * @return {BaseEvent}
     */
    FilterEventBase.prototype.none = function (base) {
        return base;
    };
    /**
     *
     * @function фильтр, возрвщающий прощедщие события
     * @param {BaseEvent} base база к которой применится фильтр
     * @return {BaseEvent}
     */
    FilterEventBase.prototype.past = function (base) {
        return base.pastEventBase();
    };
    /**
     *
     * @function фильтр, возрвщающий текущие события
     * @param {BaseEvent} base база к которой применится фильтр
     * @return {BaseEvent}
     */
    FilterEventBase.prototype.now = function (base) {
        return base.nowEventBase();
    };
    /**
     *
     * @function фильтр, возрвщающий грядущие события
     * @param {BaseEvent} base база к которой применится фильтр
     * @return {BaseEvent}
     */
    FilterEventBase.prototype.next = function (base) {
        return base.nextEventBase();
    };
    /**
     *
     * @function фильтр, возрвщающий события в определенный период
     * @param {BaseEvent} base база к которой применится фильтр
     * @return {BaseEvent}
     */
    FilterEventBase.prototype.period = function (base) {
        var startDate = new Date(this.$container.find(".StartDate").eq(0).val()),
            finishDate = new Date(this.$container.find(".EndDate").eq(0).val());
        if (startDate.getTime() <= finishDate.getTime()) {
            return base.getEventFromPeriod(startDate, finishDate);
        }
        return base;
    };
    /**
     *
     * @function фильтр, возрвщающий события определенной стоимости
     * @param base
     * @return {BaseEvent}
     */
    FilterEventBase.prototype.minMaxCost = function (base) {
        var minCost = parseFloat(this.$container.find(".MinCost").eq(0).val()),
            maxCost = parseFloat(this.$container.find(".MaxCost").eq(0).val());
        if (minCost <= maxCost) {
            return base.getEventWithCost(minCost, maxCost);
        }
        return base;
    };
    /**
     *
     * @function фильтр, сортирует по звездам
     * @param base
     * @return {BaseEvent}
     */
    FilterEventBase.prototype.stars = function (base) {
        return base.sortByStars(false);
    };
    /**
     *
     * @function фильтр, сортирует по дате
     * @param base
     * @return {BaseEvent}
     */
    FilterEventBase.prototype.date = function (base) {
        return base.sortByDate(false);
    };

    toExport.FilterEventBase = FilterEventBase;
}(window));