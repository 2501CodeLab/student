//////////////////////////////////////////////////////////////////////////////
var gDev;
//
var laneEvents = [];
var cccEvents = [];
var athleticsEvents = [];
//
var gkey = 'AIzaSyDqeyRVEU5D_2kMbseIxy7vCwasgiw6mFo';
//
var devCalendarData = {};
var mainCounter = 0;
var calendarColors = {};
var taskCounter = 0;
var totalCalendars = 1;
var mainEventSources = [];
/////
var CLIENT_ID = '642579947353-05qqqb9heom2j074m62d9brpp9pjegtt.apps.googleusercontent.com';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
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
function grabBackup() {
    //
    $(".authorize-button").hide();
    $("#login-prompt").hide();
    $("#main").show();
    if (localStorage["agenda_calendar_backup_date"]) {
        var savedDate = new Date(localStorage.agenda_calendar_backup_date);
        $("#agenda_warningDate").text(savedDate.toDateString() + " at " + getFriendlyTime(savedDate));
        $("#agenda_warningOffline").fadeIn();
    } else {
        $("#calendar_error").fadeIn();
        return false;
    }
    //
    console.log("GRABBING BACKUP");
    totalCalendars--;
    var response = JSON.parse(localStorage["agenda_calendar_list"]);
    //
    for (var l = 0; l < response.result.items.length; l++) {
        calendarColors[response.result.items[l].summary] = response.result.items[l].backgroundColor;
        $("head").append('<style>.c_' + response.result.items[l].backgroundColor.substring(1, 7) + '{ background-color: ' + response.result.items[l].backgroundColor + '; }</style>');
        //
        devCalendarData[response.result.items[l].summary] = [];
        var eventSource = {
            events: devCalendarData[response.result.items[l].summary],
            className: "c_" + response.result.items[l].backgroundColor.substring(1, 7)
        };
        mainEventSources.push(eventSource);
        totalCalendars++;
    }
    //
    for (var l = 0; l < response.result.items.length; l++) {
        console.log("GATHERING " + response.result.items[l].summary);
        var responseinner = JSON.parse(localStorage["agenda_calendar_" + response.result.items[l].summary]);
        //console.log("----------------------------------------------");
        //console.log("BACKUP RESPONSE INNER");
        //console.log(responseinner);
        //console.log("----------------------------------------------");
        var events = responseinner.result.items;
        //console.log("----------------------------------------------");
        //console.log("BACKUP RESPONSE INNER - EVENTS");
        //console.log(events);
        //console.log("----------------------------------------------");
        if (events.length > 0) {
            for (j = 0; j < events.length; j++) {
                mainCounter++;
                var event = events[j];
                var when = event.start.date;
                var object_data;
                var object_color = calendarColors[responseinner.result.summary].substring(1, 7);
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
                devCalendarData[responseinner.result.summary].push(object_data);
            }
        }
        //console.log("BACKUP EVENT FIRE")
        taskCounter++;
    }
}
//
function handleClientLoad() {
    //console.log("CLIENT LOADING");
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(function(response) {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        //
        $(".authorize-button").click(function() {
            handleAuthClick();
        });
        $(".signout-button").click(function() {
            handleSignoutClick();
        });
    }, function(e) {
        console.log("---------------------------------");
        console.log("Error initializing Google API.");
        console.log(e);
        grabBackup();
        console.log("---------------------------------");
    });
}

function updateSigninStatus(isSignedIn) {
    console.log("UPDATE GAPI STATUS FIRE");
    if (isSignedIn) {
        console.log("GAPI SIGNED IN");
        $(".authorize-button").hide();
        $(".signout-button").show();
        listUpcomingEvents();
        //grabBackup();
        $("#login-prompt").hide();
        $("#main").show();
    } else {
        console.log("GAPI NOT SIGNED IN")
        $(".authorize-button").show();
        $(".signout-button").hide();
        $("#login-prompt").show();
        $("#main").hide();
        $("#calendar").empty();
        mainCalendarData = [];
        mainCounter = 0;
        $("#loader_wrapper").fadeOut();
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}
//
function listUpcomingEvents() {
    console.log("USER SEEMS ONLINE, CALLING GAPI");
    var maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    //console.log(maxDate);
    gapi.client.calendar.calendarList.list().then(function(response) {
        totalCalendars = response.result.items.length;
        console.log("---- RESPONSE ----");
        console.log(response);
        console.log("-------------------");
        localStorage.setItem("agenda_calendar_list", JSON.stringify(response));
        //
        for (var l = 0; l < response.result.items.length; l++) {
            calendarColors[response.result.items[l].summary] = response.result.items[l].backgroundColor;
            $("head").append('<style>.c_' + response.result.items[l].backgroundColor.substring(1, 7) + '{ background-color: ' + response.result.items[l].backgroundColor + '; }</style>');
            //
            /*
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
            */
            //
            devCalendarData[response.result.items[l].summary] = [];
            var eventSource = {
                events: devCalendarData[response.result.items[l].summary],
                className: "c_" + response.result.items[l].backgroundColor.substring(1, 7)
            };
            mainEventSources.push(eventSource);
            //
        }
        //console.log(response.result.items);
        for (var i = 0; i < response.result.items.length; i++) {
            //
            gapi.client.calendar.events.list({
                'calendarId': response.result.items[i].id,
                'timeMin': new Date(new Date().getFullYear(), 0, 1).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'orderBy': 'startTime'
            }).then(function(responseinner) {
                //console.log("---- RESPONSE EVENTS ----");
                //console.log(responseinner);
                //console.log("-------------------------");
                localStorage.setItem("agenda_calendar_" + responseinner.result.summary, JSON.stringify(responseinner));
                console.log("EVENT STORED");
                localStorage.setItem("agenda_calendar_backup_date", new Date());
                //
                var events = responseinner.result.items;
                if (events.length > 0) {
                    for (j = 0; j < events.length; j++) {
                        mainCounter++;
                        var event = events[j];
                        var when = event.start.date;
                        var object_data;
                        var object_color = calendarColors[responseinner.result.summary].substring(1, 7);
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
                        devCalendarData[responseinner.result.summary].push(object_data);
                    }
                }
                taskCounter++;
            });
            //
        }
    }, function(e) {
        console.log("---------------------------------");
        console.log("Error getting user's list of calendars.");
        console.log(e);
        grabBackup();
        console.log("---------------------------------");
    });
    //
}
var taskManager = setInterval(function() {
    if (taskCounter == totalCalendars) {
        console.log("TASK MANAGER COM");
        //
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
            defaultView: "month",
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
            eventSources: mainEventSources,
            //events: mainCalendarData,
            //eventSources: [{
            //    events: cccEvents,
            //    className: 'event-ccc'
            //}, {
            //    events: laneEvents,
            //    className: 'event-lane'
            //}, {
            //    events: athleticsEvents,
            //    className: 'event-athletics'
            //}],
            eventClick: function(event) {
                //console.log("----------------------------------------------");
                //console.log("CLICK EVENT");
                //console.log(event);
                //console.log("----------------------------------------------");
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
                //console.log("CALC DATES");
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
