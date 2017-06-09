var content;
var url = "https://www.googleapis.com/blogger/v3/blogs/7913237957447191767/posts?key=AIzaSyDO0gVmX_e8P578L5BXnMakhHA_2TTOZw4";
//
function parseBlogPost(data) {
    content = $("<div>" + data.items[0].content + "</div>");
    content.find("img").removeAttr('height');
    content.find("img").removeAttr('width');
    content.find("img").addClass('img-responsive');
    content.find("img").addClass('center-block');
    var parent = content.find("img").parent().parent();
    var tempContent = content.find("img").detach();
    parent.append(tempContent);
    $("#blog_RecentPost").append(content);
    $("#blog_RecentPost").prepend('<h5 class="text-center">' + data.items[0].title + '</h5>');
}
//
$.ajax({
    url: url,
    method: 'GET',
    dataType: 'jsonp'
}).done(function(data) {
    console.log(data);
    //
    localStorage.setItem("index_blogPost", JSON.stringify(data));
    localStorage.setItem("index_blogPost_backup_date", new Date());
    //
    parseBlogPost(data);
    //
}).fail(function(jqXHR) {
    console.log("--------------------------------------------------------------------");
    console.log("There was an error while trying to get Lane Tech's blog data.");
    console.log(jqXHR);
    console.log("--------------------------------------------------------------------");
    //
    console.log(jqXHR.status);
    //
    if (localStorage["index_blogPost"]) {
        var savedDate = new Date(localStorage.index_blogPost_backup_date);
        $("#blog_warningDate").text(savedDate.toDateString() + " at " + getFriendlyTime(savedDate));
        $("#blog_warningOffline").fadeIn();
        parseBlogPost(JSON.parse(localStorage["index_blogPost"]));
    } else {
        $("#blog_RecentPost").parent().hide();
        $("#blog_error").fadeIn();
    }
    //
});
/////
function getFriendlyTime(date) {
    var friendlyTime;
    if (date.getHours() >= 13) {
        friendlyTime = date.getHours() - 12;
    } else {
        friendlyTime = date.getHours();
    }
    if (friendlyTime === 0) {
        friendlyTime = 12;
    }
    if (date.getHours() >= 12) {
        if (date.getMinutes() == 0) {
            friendlyTime += ":" + "00pm";
        } else {
            friendlyTime += ":" + date.getMinutes() + "pm";
        }
    } else {
        if (date.getMinutes() == 0) {
            friendlyTime += ":" + "00am";
        } else {
            friendlyTime += ":" + date.getMinutes() + "am";
        }
    }
    return friendlyTime;
}
//
var maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 1);
var gkey = 'AIzaSyDqeyRVEU5D_2kMbseIxy7vCwasgiw6mFo';
//
function calStuff() {
    var ids = ["lanetechccc@gmail.com", "lanetechcollegeprep@gmail.com", "cps.edu_7nit1kh7d5hb3qscd6de3f0q68@group.calendar.google.com"];
    for (var i = 0; i < ids.length; i++) {
        listUpcomingEvents(ids[i]);
    }
}
//
function displayEvents(events, cal_id) {
    events = JSON.parse(events);
    console.log("---------------------------------------------");
    console.log("DISPLAY FUNC");
    console.log(events);
    console.log("---------------------------------------------");
    if (events.length > 0) {
        for (var j = 0; j < events.length; j++) {
            var event = events[j];
            //console.log("---- EVENT ----");
            //console.log(event);
            //console.log("---------------");
            var when = event.start.date;
            //
            var agendaCard = $("#template_calendar_card").clone();
            agendaCard.removeAttr("id");
            //
            switch (cal_id) {
                case "lanetechccc@gmail.com":
                    agendaCard.find(".agenda_calendarName").text("College & Career Center");
                    agendaCard.find(".panel-heading").css("background-color", "#DBC97F");
                    break;
                case "lanetechcollegeprep@gmail.com":
                    agendaCard.find(".agenda_calendarName").text("General");
                    break;
                case "cps.edu_7nit1kh7d5hb3qscd6de3f0q68@group.calendar.google.com":
                    agendaCard.find(".agenda_calendarName").text("Athletics");
                    agendaCard.find(".panel-heading").css("background-color", "#5C5C5C");
                    break;
                default:
                    agendaCard.find(".agenda_calendarName").text("Lane Tech");
            }
            agendaCard.find(".agenda_eventTitle").text(event.summary);
            //
            if (when) {
                var datefull = when.split("-");
                //
                var year = parseInt(datefull[0]);
                var month = parseInt(datefull[1]);
                var day = parseInt(datefull[2]);
                month--;
                var d = new Date(year, month, day)
                agendaCard.find(".panel-body").append("<p>" + d.toDateString() + "</p>");
            } else {
                //
                var item_date = new Date(event.start.dateTime);
                var item_date2 = new Date(event.end.dateTime);
                //
                agendaCard.find(".panel-body").append("<p>" + item_date.toDateString() + " at " + getFriendlyTime(item_date) + " to " + item_date2.toDateString() + " at " + getFriendlyTime(item_date2) + "</p>");
            }
            //
            //
            switch (cal_id) {
                case "lanetechccc@gmail.com":
                case "lanetechcollegeprep@gmail.com":
                    $("#calendar_space").prepend(agendaCard);
                    break;
                case "cps.edu_7nit1kh7d5hb3qscd6de3f0q68@group.calendar.google.com":
                default:
                    $("#calendar_space").append(agendaCard);
            }
            //console.log("APPENDING " + event.summary)
            //$("#screen_agenda").append("<p>" + event.summary + ' (' + when + ') |||| ' + "response.result.items[i].id" + "</p>");
        }
    }
}
//
function listUpcomingEvents(cal_id) {
    $.ajax({
        type: 'GET',
        url: encodeURI('https://www.googleapis.com/calendar/v3/calendars/' + cal_id + '/events?key=' + gkey),
        dataType: 'json',
        data: {
            'calendarId': cal_id,
            'timeMin': (new Date()).toISOString(),
            'timeMax': maxDate.toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'orderBy': 'startTime'
        },
        success: function(events) {
            console.log("----------------------------------------------------------------------");
            console.log(cal_id);
            console.log(events.items);
            console.log("----------------------------------------------------------------------");
            //
            localStorage.setItem("index_" + cal_id, JSON.stringify(events.items));
            localStorage.setItem("index_calendar_backup_date", new Date());
            //
            displayEvents(localStorage["index_" + cal_id], cal_id);
        },
        error: function(jqXHR) {
            console.log("--------------------------------------------------------------------");
            console.log("An error has occured while trying to get Lane Tech's calendar events.");
            console.log(jqXHR);
            console.log("--------------------------------------------------------------------");
            //
            console.log(jqXHR.status);
            console.log(cal_id);
            //
            if (localStorage["index_" + cal_id]) {
                var savedDate = new Date(localStorage.index_calendar_backup_date);
                $("#calendar_warningDate").text(savedDate.toDateString() + " at " + getFriendlyTime(savedDate));
                $("#calendar_warningOffline").fadeIn();
                displayEvents(localStorage["index_" + cal_id], cal_id);
            } else {
                if (jqXHR.status == 0) {
                    $("#calendar_errorOffline").fadeIn();
                } else {
                    $("#calendar_error").fadeIn();
                }
            }
            //
        }
    });
}
$(document).ready(function() {
    calStuff();
});
//
$(window).on('load', function(e) {
    $("#loader_wrapper").fadeOut();
});
//
