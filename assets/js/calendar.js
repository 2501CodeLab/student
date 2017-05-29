//////////////////////////////////////////////////////////////////////////////
var gDev;
//
var laneEvents = [];
var cccEvents = [];
var athleticsEvents = [];
//
var taskCounter = 0;
//
var gkey = 'AIzaSyDqeyRVEU5D_2kMbseIxy7vCwasgiw6mFo';
//
var mainCounter = 0;
//
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
function calStuff() {
    var ids = ["lanetechccc@gmail.com", "lanetechcollegeprep@gmail.com", "cps.edu_7nit1kh7d5hb3qscd6de3f0q68@group.calendar.google.com"];
    //var ids = ["cps.edu_7nit1kh7d5hb3qscd6de3f0q68@group.calendar.google.com"];
    for (var i = 0; i < ids.length; i++) {
        listCalendarEvents(ids[i]);
    }
}
//
$(document).ready(function() {
    calStuff();
});
//
function listCalendarEvents(cal_id) {
    console.log(new Date().toISOString());
    $.ajax({
        type: 'GET',
        url: encodeURI('https://www.googleapis.com/calendar/v3/calendars/' + cal_id + '/events?key=' + gkey),
        dataType: 'json',
        data: {
            'timeMin': new Date(new Date().getFullYear(), 0, 1).toISOString(),
            //2017-04-04T21:12:37-05:00
            //'timeMin': "2017-01-01T21:12:37-05:00",
            //'timeMin': new Date().toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'orderBy': 'startTime'
        },
        success: function(events) {
            console.log("----------------------------------------------------------------------");
            console.log("SUCCESS");
            console.log(cal_id);
            console.log(events);
            console.log("----------------------------------------------------------------------");
            //
            localStorage.setItem("full_" + cal_id, JSON.stringify(events.items));
            localStorage.setItem("full_calendar_backup_date", new Date());
            //
            displayEvents(localStorage["full_" + cal_id], cal_id);
            //
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
            if (localStorage["full_" + cal_id]) {
                var savedDate = new Date(localStorage.full_calendar_backup_date);
                $("#calendar_warningDate").text(savedDate.toDateString() + " at " + getFriendlyTime(savedDate));
                $("#calendar_warningOffline").fadeIn();
                displayEvents(localStorage["full_" + cal_id], cal_id);
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
//
function displayEvents(events, cal_id) {
    //
    events = JSON.parse(events);
    //
    if (events.length > 0) {
        //console.log("LOGGING EVENTS");
        for (var j = 0; j < events.length; j++) {
            mainCounter++;
            var event = events[j];
            //console.log("----------------------------");
            //console.log("EVENT LOG " + cal_id);
            //console.log(event);
            //console.log("----------------------------");
            var when = event.start.date;
            var object_color;
            //
            switch (cal_id) {
                case "lanetechccc@gmail.com":
                    object_color = "event-ccc";
                    break;
                case "lanetechcollegeprep@gmail.com":
                    object_color = "event-lane";
                    break;
                case "cps.edu_7nit1kh7d5hb3qscd6de3f0q68@group.calendar.google.com":
                    object_color = "event-athletics";
                    break;
                default:
                    object_color = "event-danger";
            }
            var object_data;
            if (when) {
                object_data = {
                    "id": mainCounter,
                    "title": event.summary,
                    "class": object_color,
                    "start": event.start.date,
                    "end": event.end.date,
                    "desc": event.description,
                    "loc": event.location
                };
            } else {
                object_data = {
                    "id": mainCounter,
                    "title": event.summary,
                    "class": object_color,
                    "start": event.start.dateTime,
                    "end": event.end.dateTime,
                    "desc": event.description,
                    "loc": event.location
                };
            }
            //
            switch (cal_id) {
                case "lanetechccc@gmail.com":
                    cccEvents.push(object_data);
                    break;
                case "lanetechcollegeprep@gmail.com":
                    laneEvents.push(object_data);
                    break;
                case "cps.edu_7nit1kh7d5hb3qscd6de3f0q68@group.calendar.google.com":
                    athleticsEvents.push(object_data);
                    break;
                default:
                    console.log("Problem handling events for: " + cal_id);
            }
        }
    }
    taskCounter++;
}
//
var taskManager = setInterval(function() {
    if (taskCounter == 3) {
        //
        var calcEventLimit = 0;
        if ($(window).width() < 768) {
            // MOBILE
            calcEventLimit = 1;
        } else {
            // TABLET
            calcEventLimit = 4;
        }
        //
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,today,next',
                center: 'title',
                right: 'month,agendaDay,listDay'
            },
            displayEventTime: false, // don't show the time column in list view
            height: "auto",
            contentHeight: "auto",
            eventLimit: true, // for all non-agenda views
            eventLimitClick: "listDay",
            views: {
                month: {
                    eventLimit: calcEventLimit // adjust to 6 only for agendaWeek/agendaDay
                }
            },
            viewRender: function() {
                $('.fc-today-button').addClass('btn btn-default');
                $(".fc-button-group").addClass("btn-group");
                $('.fc-prev-button, .fc-next-button, .fc-month-button, .fc-agendaDay-button, .fc-listDay-button').addClass('btn btn-primary');
            },
            eventSources: [{
                events: cccEvents,
                className: 'event-ccc'
            }, {
                events: laneEvents,
                className: 'event-lane'
            }, {
                events: athleticsEvents,
                className: 'event-athletics'
            }],
            eventClick: function(event) {
                console.log("----------------------------------------------");
                console.log("CLICK EVENT");
                console.log(event);
                console.log("----------------------------------------------");
                //
                $("#event_title").text(event.title);
                //
                if (event.desc) {
                    var desc = event.desc;
                    desc = desc.replace(/(?:\r\n|\r|\n)/g, '<br/>');
                    $("#event_desc p").html(desc);
                    $("#event_desc").show();
                } else {
                    $("#event_desc").hide();
                }
                //
                if (event.loc) {
                    $("#event_loc p").html(event.loc);
                    $("#event_loc").show();
                } else {
                    $("#event_loc").hide();
                }
                //
                console.log("CALC DATES");
                var date_start = moment(event.start);
                var date_end = moment(event.end);
                if (date_start.add(1, 'days').isSame(date_end)) {
                    $("#event_allDay p").text(event.start.format("dddd, MMMM Do YYYY"));
                    $("#event_start, #event_end").hide();
                    $("#event_allDay").show();
                } else {
                    $("#event_start p").text(event.start.format("dddd, MMMM Do YYYY, h:mm a"));
                    $("#event_end p").text(event.end.format("dddd, MMMM Do YYYY, h:mm a"));
                    $("#event_start, #event_end").show();
                    $("#event_allDay").hide();
                }
                //
                $("#events_modal").modal("show");
                return false;
            },
        });
        //
        clearInterval(taskManager);
        $("#loader_wrapper").fadeOut();
    }
}, 300);
