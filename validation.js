(function (exports) {
    "use strict";

    exports.ListOfEvents = new Events();

    exports.showError = function (isError, helpText) {

        if (isError) {
            helpText.show();
            return;
        }
        helpText.hide();
    };

    exports.validateTitle = function (input, helpText) {

        if ($.trim(input).length === 0) {
            showError(true, helpText);
            return false;
        }

        showError(false, helpText);
        return true;
    };

    exports.validateDate = function (input, helpText) {

        if (!isDate(new Date(input))) {
            showError(true, helpText);
            return false;
        }

        showError(false, helpText);
        return true;
    };

    exports.validateNumber = function (input, helpText) {

        if (! $.isNumeric(+input) || +input < 0) {
            showError(true, helpText);
                return false;
        }

        showError(false, helpText);
        return true;
    };
}(window));