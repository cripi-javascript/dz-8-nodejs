/**
 * Created with JetBrains WebStorm.
 * User: painandfear
 * Date: 11/27/12
 * Time: 9:53 PM
 * To change this template use File | Settings | File Templates.
 */
(function (toExport) {
    "use strict";
    /**
     *
     * @constructor {FieldError} - объект с сообщение о том что поле содержит не корректную информацию
     * @field {nameField} - имя поля в котором возникла ошибка
     * @field {isCritical} - критично ли поле или можно заполнить default значением
     * @field {message} - дружелюбное сообщение для пользователя
     */

    toExport.FieldsError = function (nameField, message, isCritical) {
        this.nameField = nameField || "errorField";
        this.message = message || "";
        this.isCritical = isCritical || false;
    };
}(window));