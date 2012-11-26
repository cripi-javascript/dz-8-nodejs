$(function (exports) {
    "use strict";

    var ListOfEvents = new Events(),
        sortedList = new Events(),
        filterOption = "all",
        sortOption = "without";

    $(document).ready(initialise);

/**
    * Загружает свое состояние с сервера
    * при отсутствии соединения/страницы на сервере пытается подключиться через 5 минут снова
    *
*/
    function initialise() {

        $( '.date' ).datepicker();

        $.getJSON('current-event.json')
            .complete(function () { $("#notify").hide(); })
            .error(function () { $('#notifyError').show(); })
            .success(function (result) {
                var i, newEvent;

                for (i = 0; i < result.length; i++) {
                    newEvent = new Event(result[i]).validate();
                    ListOfEvents = ListOfEvents.add(newEvent);
                }
                changeDocument("sort");
                addListener();
            });
    }
/**
 * Добавляет новое событие в список. Если установлены опции фильтрации и сортировки 
 * - то располагает элементы на странице, в с-ии с ними
 *
*/
    function preventDefault() {

        var name = $("#title").val(),
            start = $("#from").val(),
            end = $("#to").val(),
            location = $("#location").val(),
            raiting = $("#raiting").val(),
            description = $("#description").val(),
            remindTime = $("#remindTime").val();

        if (!validateTitle(name, $('#title_help'))) { alert("Событие не было добавлено. Ошибка"); return; }
        if (!validateDate(start, $('#from_help'))) { alert("Событие не было добавлено. Ошибка"); return; }
        if (!validateNumber(remindTime, $('#remindTime_help'))) { alert("Событие не было добавлено. Ошибка"); return; }

        var element = new Event({
                name: name,
                start: start,
                end: end,
                location: location,
                raiting: raiting,
                description: description,
                remindTime: remindTime
            }).validate();

        var result = ListOfEvents.add(element);

        $.post('current-event.json', result.serialise())
            .error( function () {
              /*if (error === "error") {
                    alert("Не могу подключиться к северу. Попробуйте позже");
                    return;
                }*/
            })
            .complete(function () {
                ListOfEvents = result;
                changeDocument("sort");
                document.forms["form"].reset();
            });
    }

    function filterEvents(listEvents) {
        switch (filterOption) {
        case "future":
            return listEvents.coming();
        case "past":
            return listEvents.past();
        default:
            return listEvents;
        }
    }

    function sortEvents() {
        switch (sortOption) {
        case "byName":
            return ListOfEvents.sortByName();
        case "byStart":
            return ListOfEvents.sortByTime();
        case "byRaiting":
            return ListOfEvents.sortByRaiting();
        default:
            return ListOfEvents;
        }
    }

/**
 * Сортирует и фильтрует события в соответствии с указанными опциями.
 *
 * @param {string} changeType - если указана строка "sort", то события также будут отсортированы,
 *  инчае - только отфильтрованы
 * @return коллекция объектов типа event
*/

    function changeDocument(changeType) {
        var $removeList = $(".events");
        $removeList.remove();

        var $addList = $('<ul />')
            .addClass("events");

        var fragment = document.createDocumentFragment();

        if (changeType === "sort") {
            sortedList = sortEvents();
        }
        var filterList = filterEvents(sortedList),
            length = filterList.length(),
            i;

        for (i = 0; i < length; i++)
        {
            var element = filterList.items[i];
            var $el = addLiElement(element);
            $el.appendTo($addList);
        }

         var $parent = $(".collection");
        $addList.appendTo(fragment);
        $parent.append(fragment);
}

/**
 * Создает DOM-элемент типа li, заполняется полями из объекта
 *
 * @param {Event} element - объект типа Element
 *
 * @return Возвращает созданный дом-элемент типа li
*/

    function addLiElement (element) {
        var $el = $('<li />')
            .addClass("event_item"),

            $name = $('<div />', {
            text: "Название: " + element.name
        }).appendTo($el),

            $start = $('<div />', {
            text: "Начало: " + element.start
        }).appendTo($el),

            $end = $('<div />', {
            text: "Окончание: " + element.end
        }).appendTo($el),

            $location = $('<div />', {
            text: "Местоположение: " + element.location
        }).appendTo($el),

            $remindTime = $('<div />', {
            text: "Напомнить за: " + element.remindTime + "минут"
        }).appendTo($el),

            $description = $('<div />', {
            text: "Описание: " + element.description
        }).appendTo($el),

            $raiting = $('<div />', {
            text: "Рейтинг: " + element.raiting
        }).appendTo($el);

        return $el;
    };

/**
 * Навешивает обработчики событий на страницу
*/
     function addListener() {

        $("#title").on('blur', function($event) {
            var cur = $event.currentTarget;
            validateTitle(cur.value, $('#title_help'));
        });

        $("#from").on('blur', function ($event) {
            var cur = $event.currentTarget;
            validateDate(cur.value, $('#from_help'));
        });

        $("#remindTime").on('blur', function ($event) {
            var cur = $event.currentTarget;
            validateNumber(cur.value, $('#remindTime_help'));
        });

        $('.filter').each(function(index) {
            $(this).on('change', function ($event) {
            filterOption = $('input[name="filter"]:checked').val(); 
            changeDocument("filter");
        })});

        $('.sort').each(function(index) {
            $(this).on('change', function ($event) {
            sortOption = $('input[name="sort"]:checked').val(); 
            changeDocument("sort");
        })});


        $("#addButton").on('click', preventDefault);
    }

}(window));