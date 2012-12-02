/*global
$: false,
Event: false,
 Model: false
 */
(function (toExport) {
    "use strict";
    /**
     *
     * @param $container
     * @constructor создать объект работающий с фабрикой событий расположенных на странице
     */
    var FactoryEvent = function ($container) {
        this.$container = $container;
        this.$startEvent = this.$container.find(".EventsStartDate").eq(0);
        this.$endEvent = this.$container.find(".EventsEndDate").eq(0);
        this.$name = this.$container.find(".EventsName").eq(0);
        this.$x = this.$container.find(".EventsX").eq(0);
        this.$y = this.$container.find(".EventsY").eq(0);
        this.$stars = this.$container.find(".EventsStars").eq(0);
        this.$cost = this.$container.find(".EventsCost").eq(0);
    };

    toExport.FactoryEvent = FactoryEvent;

    /**
     * @function - функция читает {Event} элемент из фибричных полей
     * @return {Object}
     */
    FactoryEvent.prototype.readEvent = function () {
        var parties = [];
        this.$container.find(".EventsParty").each(function () {
            var party = $.trim($(this).val());
            if (party !== "") {
                parties.push(party);
            }
        });
        return {
            "start": new Date(this.$startEvent.val()),
            "end": new Date(this.$endEvent.val()),
            "name": this.$name.val(),
            "gps": {
                "x": parseFloat(this.$x.val()),
                "y": parseFloat(this.$y.val())
            },
            "stars": parseFloat(this.$stars.val()),
            "cost": parseInt(this.$cost.val(), 10),
            "parties": parties
        };
    };

    /**
     * @function - функция пишет в поля фабрики Default поля
     */
    FactoryEvent.prototype.WriteDefaultEvent = function () {
        var defaultEvent = new Event();
        this.$container.each(function () {
            $(this).attr("value", "");
        });

        this.$startEvent.val(Model.printDate(defaultEvent.start));
        this.$endEvent.val(Model.printDate(defaultEvent.end));
        this.$name.val(defaultEvent.name);
        this.$x.val(defaultEvent.gps.x);
        this.$y.val(defaultEvent.gps.y);
        this.$stars.val(defaultEvent.stars);
        this.$cost.val(defaultEvent.cost);
    };
    /**
     * @function проверяет объект созданный фабрикой, активизирует валидаторы
     */
    FactoryEvent.prototype.eventValidation = function () {
        var eventObj = this.readEvent(),
            errors = Event.isValidate(eventObj),
            fieldToDomElementHash = {
                "start": this.$startEvent,
                "end": this.$endEvent,
                "name": this.$name,
                "gps.x": this.$x,
                "gps.y": this.$y,
                "stars": this.$stars,
                "cost": this.$cost
            },
            fieldToDOM,
            $validator;
        for (fieldToDOM in fieldToDomElementHash) {
            if (fieldToDomElementHash.hasOwnProperty(fieldToDOM)) {
                $validator = fieldToDomElementHash[fieldToDOM].parents().eq(0).next();
                $validator.empty();
                $validator.removeClass("CriticalError");
                $validator.removeClass("Error");
                $validator.addClass("Valid");
            }
        }

        $.each(errors, function (index, erorr) {
            var $DOMObject = fieldToDomElementHash[erorr.nameField],
                $validator = $DOMObject.parents().eq(0).next();
            if ($validator.children().length === 0) {
                $validator.removeClass("Valid");
                if (erorr.isCritical === true) {
                    $validator.addClass("CriticalError");
                } else {
                    $validator.addClass("Error");
                }
                $("<span/>", {
                    "text": erorr.message
                }).appendTo($validator);
            }
        });
    };
}(window));