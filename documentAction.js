$(function (exports) {
    "use strict";

    var ListOfEvents = new Events(),
        sortedList = new Events(),
        queue = new Events,
        filterOption = "all",
        sortOption = "without";

    var template = '<li class="event_item" >' +
                        "<div>Название: <%= name %></div>" +
                        "<div>Начало: <%= start %></div>" +
                        "<div>Окончание: <%= end %></div>" +
                        "<div>Местоположение: <%= location %></div>" +
                        "<div>Напомнить за: <%= remindTime %></div>" +
                        "<div>Описание: <%= description %></div>" +
                        "<div>Рейтинг: <%= raiting %></div></li>";
    $(document).ready(initialise);

/**
    * Загружает свое состояние с сервера
    * при отсутствии соединения/страницы на сервере пытается подключиться через 5 минут снова
    *
*/
    function initialise() {

        $('.date').datepicker();

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

        var name = $("#title").val().trim(),
            start = $("#from").val(),
            end = $("#to").val(),
            location = $("#location").val().trim(),
            raiting = $("#raiting").val(),
            description = $("#description").val().trim(),
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

        ListOfEvents = ListOfEvents.add(element);
        queue = queue.add(element);

        $.post('current-event.json', queue.serialise())
            .success(function () {
                queue = new Events();
                changeDocument("sort");
                document.forms["form"].reset();
                //alert("Все события были успешно отправлены.");
            })
            .error( function () {
                alert("Отсутсвует подключение к серверу.");
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

        if (changeType === "sort") {
            sortedList = sortEvents();
        }
        var filterList = filterEvents(sortedList),
            length = filterList.length(),
            i;

        var $box = $("<ul class='events'/>");
        var $temp = $();

        for (i = 0; i < length; i++)
            {
               $temp = $temp.add($(tmpl(template, filterList.items[i])));
            }

        $temp.appendTo($box);
        $box.appendTo($("#collection"));
}

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

        $('.filter').each(function() {
            $(this).on('change', function () {
            filterOption = $('input[name="filter"]:checked').val(); 
            changeDocument("filter");
        })});

        $('.sort').each(function() {
            $(this).on('change', function () {
            sortOption = $('input[name="sort"]:checked').val(); 
            changeDocument("sort");
        })});


        $("#addButton").on('click', preventDefault);
    }

}(window));