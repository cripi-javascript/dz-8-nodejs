﻿/*global
$: false,
 window: false
 */
(function (toExport) {
    "use strict";
/**
 * @class Абстрактный класс объектов ООП
 *
 * @param {Object} data копируемый объект
*/
    var Model = function (data) {
        var nameField;
        for (nameField in data) {
            if (data.hasOwnProperty(nameField)) {
                this[nameField] = data[nameField];
            }
        }
    },
        printDate;
    toExport.Model = Model;

/**
 * @function setter
 *
 * @param {Object} attributes присваиваемый объект
*/
    Model.prototype.set = function (attributes) {
        var nameAttr;
        for (nameAttr in attributes) {
            if (attributes.hasOwnProperty(nameAttr)) {
                if (typeof this[nameAttr] !== "undefined") {
                    this[nameAttr] = attributes[nameAttr];
                }
            }
        }
    };

/**
 * @function getter
 *
 * @param {String} attribute имя поля
 *
 * @return {Object}
*/
    Model.prototype.get = function (attribute) {
        if (typeof attribute !== 'string' || typeof this[attribute] === "undefined") {
            return undefined;
        }
        return this[attribute];
    };

    /**
     * @function записать даты в нормальном виде
     * @param {Date} date
     */
    if (toExport.$.browser.msie) {
        printDate = function (date) {
            return date.getFullYear().toString() + "/" + date.getMonth().toString() + "/" + date.getDate().toString();
        };
    } else {
        printDate = function (date) {
            var month = date.getMonth(),
                day = date.getDate();
            month = (month < 10) ? "0" + month.toString() : month.toString();
            day = (day < 10) ? "0" + day.toString() : day.toString();
            return date.getFullYear() + "-" + month + "-" + day;
        };
    }
    Model.printDate = printDate;
}(window));