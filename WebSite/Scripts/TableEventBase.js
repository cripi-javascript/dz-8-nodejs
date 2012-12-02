/*global
 tmpl: false,
 Model: false,
 $: false
*/
(function (toExport) {
    "use strict";
    var TableEventBase = function ($container) {
        this.$container = $container;
    },
        rowTable = '<tr>' +
        "<td><%= number %></td>" +
        "<td><%= start %></td>" +
        "<td><%= end %></td>" +
        "<td><%= name %></td>" +
        "<td><%= x %></td>" +
        "<td><%= y %></td>" +
        "<td><%= stars %></td>" +
        "<td><%= cost %></td>" +
        "<td><%= parties %></td>" +
        "</tr>",
        templateRowParty = '<option>' +
        "<%= party %>" +
        '</option>';
    toExport.TableEventBase = TableEventBase;
    /**
     * @function Функция отображет {BaseEvent}
     * @param {BaseEvent} base
     */
    TableEventBase.prototype.updateTable = function (base) {
        var tableHtml = "",
            item,
            i,
            j,
            partiesHtml;
        this.$container.children().remove();

        for (i = 0; i < base.items.length; i += 1) {
            item = base.items[i];
            partiesHtml = "";
            for (j = 0; j < item.parties.length; j += 1) {
                partiesHtml += tmpl(templateRowParty, {"party": item.parties[j]});
            }
            if (partiesHtml.length !== 0) {
                partiesHtml = "<select>" + partiesHtml + "</select>";
            }
            tableHtml += tmpl(rowTable, {
                "number": i,
                "start": Model.printDate(item.start),
                "end": Model.printDate(item.end),
                "name": item.name,
                "x": item.gps.x,
                "y": item.gps.y,
                "stars": item.starsToString(),
                "cost": item.cost,
                "parties": partiesHtml
            });
        }
        $(tableHtml).appendTo(this.$container);
    };
}(window));