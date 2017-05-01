var mainCalendarData = [];
var mainCounter = 0;
var calendarColors = {};
var taskCounter = 0;
var totalCalendars = 1;
/////
var CLIENT_ID = '642579947353-05qqqb9heom2j074m62d9brpp9pjegtt.apps.googleusercontent.com';
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

function handleClientLoad() {
    //console.log("CLIENT LOADING");
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(function() {
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
            $("#agenda_list").empty();
        });
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        $(".authorize-button").hide();
        $(".signout-button").show();
        listUpcomingEvents();
        $("#login-prompt").hide();
        $("#main").show();
    } else {
        $(".authorize-button").show();
        $(".signout-button").hide();
        $("#login-prompt").show();
        $("#main").hide();
        $("#calendar").empty();
        mainCalendarData = [];
        mainCounter = 0;
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
    var maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    //console.log(maxDate);
    gapi.client.calendar.calendarList.list().then(function(response) {
        console.log("---- RESPONSE ----");
        console.log(response);
        totalCalendars = response.result.items.length;
        console.log("-------------------");
        //
        //
        for (var l = 0; l < response.result.items.length; l++) {
            calendarColors[response.result.items[l].summary] = response.result.items[l].backgroundColor;
            $("head").append('<style>.day-highlight.dh-' + response.result.items[l].backgroundColor.substring(1, 7) + '{ background-color: ' + response.result.items[l].backgroundColor + '; }</style>');
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
                var events = responseinner.result.items;
                console.log("---- RESPONSE EVENTS ----");
                console.log(responseinner);
                console.log("-------------------------");
                if (events.length > 0) {
                    for (j = 0; j < events.length; j++) {
                        mainCounter++;
                        var event = events[j];
                        //console.log("APPENDING " + event.summary)
                        //$("#screen_agenda").append("<p>" + event.summary + ' (' + when + ') |||| ' + "response.result.items[i].id" + "</p>");
                        var when = event.start.date;
                        /*
                        {
                            "id": "276",
                            "title": "Short day event",
                            "url": "https://preview.c9users.io/angelcarbajal/webdevs2/devspace/ltstudentapp/calendar.html",
                            "class": "event-success",
                            "start": "1363245600000",
                            "end": "1363252200000",
                            "custom": "yes"
                        }
                        */
                        //
                        console.log(event.description);
                        if (when) {
                            if (event.start.date == event.end.date) {
                                var event_date = when.split("-");
                                //
                                var year = parseInt(event_date[0]);
                                var month = parseInt(event_date[1]);
                                var day = parseInt(event_date[2]);
                                month--;
                                var object_date = new Date(year, month, day);
                                var object_timestamp = object_date.getTime();
                                var object_data = {
                                    "id": mainCounter,
                                    "title": event.summary,
                                    "url": event.htmlLink,
                                    "class": calendarColors[responseinner.result.summary].substring(1, 7),
                                    //"class": "event-warning",
                                    "start": object_timestamp,
                                    "end": object_timestamp,
                                    "desc": event.description,
                                    "loc": event.location
                                };
                                mainCalendarData.push(object_data);
                            } else {
                                var event_start_date = event.start.date.split("-");
                                var event_end_date = event.end.date.split("-");
                                //
                                var year = parseInt(event_start_date[0]);
                                var month = parseInt(event_start_date[1]);
                                var day = parseInt(event_start_date[2]);
                                month--;
                                //
                                var year2 = parseInt(event_end_date[0]);
                                var month2 = parseInt(event_end_date[1]);
                                var day2 = parseInt(event_end_date[2]);
                                month2--;
                                //
                                var object_start_date = new Date(year, month, day);
                                var object_start_timestamp = object_start_date.getTime();
                                //
                                var object_end_date = new Date(year2, month2, day2);
                                var object_end_timestamp = object_end_date.getTime();
                                //
                                var object_data = {
                                    "id": mainCounter,
                                    "title": event.summary,
                                    "url": event.htmlLink,
                                    "class": calendarColors[responseinner.result.summary].substring(1, 7),
                                    //"class": "event-warning",
                                    "start": object_start_timestamp,
                                    "end": object_end_timestamp,
                                    "desc": event.description,
                                    "loc": event.location
                                };
                                //
                                mainCalendarData.push(object_data);
                            }
                            //
                            //
                        } else {
                            var event_start_date = new Date(event.start.dateTime);
                            var event_end_date = new Date(event.end.dateTime);
                            //
                            var object_start_timestamp = event_start_date.getTime();
                            var object_end_timestamp = event_end_date.getTime();
                            //
                            var object_data = {
                                "id": mainCounter,
                                "title": event.summary,
                                "url": event.htmlLink,
                                "class": calendarColors[responseinner.result.summary].substring(1, 7),
                                "start": object_start_timestamp,
                                "end": object_end_timestamp,
                                "desc": event.description,
                                "loc": event.location
                            };
                            mainCalendarData.push(object_data);
                        }
                    }
                }
                var options = {
                    events_source: mainCalendarData,
                    view: 'week',
                    tmpl_path: 'assets/tmpls/',
                    tmpl_cache: false,
                    modal: "#events-modal",
                    modal_type: "template",
                    weekbox: false,
                    format12: true,
                    display_week_numbers: false,
                    modal_title: function(e) {
                        console.log(e);
                        return e.title
                    },
                    onAfterEventsLoad: function(events) {
                        if (!events) {
                            return;
                        }
                        var list = $('#eventlist');
                        list.html('');
                        $.each(events, function(key, val) {
                            $(document.createElement('li')).html('<a href="' + val.url + '">' + val.title + '</a>').appendTo(list);
                        });
                    },
                    onAfterViewLoad: function(view) {
                        $('.page-header h3').text(this.getTitle());
                        var tempdemo = false;
                        if (tempdemo) {
                            $("#calendar").find(".cal-day-today span").append('<div class="tutorial_circle" data-trigger="focus" data-container="body" data-toggle="popover" data-placement="top" data-content="Click the date number to see more events!"></div>');
                            $('.tutorial_circle').popover('show');
                        }
                    },
                    classes: {
                        months: {
                            general: 'label'
                        }
                    }
                };
                var calendar = $('#calendar').calendar(options);
                $('.btn-group a[data-calendar-nav]').each(function() {
                    var $this = $(this);
                    $this.click(function() {
                        calendar.navigate($this.data('calendar-nav'));
                    });
                });
                $('.btn-group a[data-calendar-view]').each(function() {
                    var $this = $(this);
                    $this.click(function() {
                        calendar.view($this.data('calendar-view'));
                    });
                });
                taskCounter++;
            });
            //
        }
    });
    //
}
var taskManager = setInterval(function() {
    if (taskCounter == totalCalendars) {
        $("#loader_wrapper").fadeOut();
        clearInterval(taskManager);
    }
}, 300);
