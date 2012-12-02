$(function (){
        var $eventFactory = $("#EventFactory");
        var $eventFilter = $("#EventFilter");
        var $eventTable = $("#eventList");
        var calendar = new Calendar($eventFactory, $eventFilter, $eventTable, "./base.json");
    });