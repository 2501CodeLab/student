var mainCalendarData = [];
//
var taskCounter = 0;
//
var gkey = 'AIzaSyDqeyRVEU5D_2kMbseIxy7vCwasgiw6mFo';
//
var maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 1);
//
var mainCounter = 0;
//
var ids = ["lanetechccc@gmail.com", "lanetechcollegeprep@gmail.com", "cps.edu_7nit1kh7d5hb3qscd6de3f0q68@group.calendar.google.com"];
//
$(document).ready(function() {
    for (var i = 0; i < ids.length; i++) {
        //
        $.ajax({
            type: 'GET',
            url: encodeURI('https://www.googleapis.com/calendar/v3/calendars/' + ids[i] + '/events?key=' + gkey),
            dataType: 'json',
            data: {
                //'timeMin': new Date(new Date().getFullYear(), 0, 1).toISOString(),
                //2017-04-04T21:12:37-05:00
                'timeMin': "2017-04-04T21:12:37-05:00",
                //'timeMin': new Date().toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'orderBy': 'startTime'
            },
            success: function(events) {
                //
                //console.log("FOUND");
                console.log(events);
                //
                //
                if (events.items.length > 0) {
                    //console.log("LOGGING EVENTS");
                    for (j = 0; j < events.items.length; j++) {
                        mainCounter++;
                        var event = events.items[j];
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
                        var object_color;
                        //console.warn(events.etag);
                        switch (events.etag) {
                            case "\"p320a5kstke7d60g\"":
                                object_color = "event-warning";
                                //console.log("ESUCCESS");
                                break;
                            case "\"p338970nroaet60g\"":
                                //console.log("EWARN");
                                object_color = "event-success";
                                break;
                            case "\"p334e9itth27d60g\"":
                                //console.log("EINFO");
                                object_color = "event-info";
                                break;
                            default:
                                //console.log("E NULL");
                                object_color = "event-success";
                                break;
                        }
                        // optimize
                        //console.log(event.description);
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
                                    "class": object_color,
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
                                    "class": object_color,
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
                                "class": object_color,
                                "start": object_start_timestamp,
                                "end": object_end_timestamp,
                                "desc": event.description,
                                "loc": event.location
                            };
                            mainCalendarData.push(object_data);
                        }
                    }
                }
                ////////////////////////
                //console.log("--- CURRENT ---");
                //console.info(mainCalendarData);
                //console.log("---------------");
                var options = {
                    events_source: mainCalendarData,
                    view: 'month',
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
                        if (!localStorage.calendar_demo) {
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
            },
            error: function(response) {
                //
                console.log(response);
            }
        });
        //
    }
});
var taskManager = setInterval(function() {
    if (taskCounter == 3) {
        $("#loader_wrapper").fadeOut();
        clearInterval(taskManager);
    }
}, 300);
