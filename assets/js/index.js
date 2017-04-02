// 7913237957447191767
var content;
var url = "https://www.googleapis.com/blogger/v3/blogs/7913237957447191767/posts?key=AIzaSyDO0gVmX_e8P578L5BXnMakhHA_2TTOZw4";
$.ajax({
    url: url,
    method: 'GET',
    dataType: 'jsonp'
}).done(function(data) {
    console.log(data);
    //
    content = $(data.items[0].content);

    content.find("img").removeAttr('height');
    content.find("img").removeAttr('width');
    content.find("img").addClass('img-responsive');
    content.find("img").addClass('center-block');

    var parent = content.find("img").parent().parent();

    var tempContent = content.find("img").detach();

    parent.append(tempContent);



    $("#blog_RecentPost").append(content);

    $("#blog_RecentPost").prepend('<h5 class="text-center">' + data.items[0].title + '</h5>');
    //
}).fail(function(jqXHR, textStatus, errorThrown) {
    alert("There was an error while trying to get Lane Tech's blog data.");
    console.log(jqXHR);
    console.log(textStatus);
    console.log(errorThrown);
});


/////

var CLIENT_ID = '642579947353-3s7ebvmj44r7tnfnpkh1oao69vcgpekb.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');


function handleClientLoad() {
    console.log("CLIENT LOADING");
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
        calStuff();
    }
    else {
        $(".authorize-button").show();
        $(".signout-button").hide();
    }
}


function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

//
var mainCalendarData = {};
var calendarColors = {};
//

function listUpcomingEvents(cal_id) {

    var maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 1);



    gapi.client.calendar.events.list({
        'calendarId': cal_id,
        'timeMin': (new Date()).toISOString(),
        'timeMax': maxDate.toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function(responseinner) {
        var events = responseinner.result.items;
        //console.log("---- RESPONSE EVENTS ----");
        //console.log(responseinner);
        //console.log("-------------------------");


        if (events.length > 0) {




            for (j = 0; j < events.length; j++) {
                var event = events[j];

                //console.log("---- EVENT ----");
                //console.log(event);
                //console.log("---------------");

                when = event.start.date;


                //

                var agendaCard = $("#template_calendar_card").clone();
                agendaCard.removeAttr("id");
                //
                agendaCard.find(".agenda_calendarName").text(responseinner.result.summary);
                agendaCard.find(".agenda_eventTitle").text(event.summary);

                agendaCard.css("border-color", calendarColors[responseinner.result.summary]);
                agendaCard.find(".panel-heading").css("border-color", calendarColors[responseinner.result.summary]);
                agendaCard.find(".panel-heading").css("background-color", calendarColors[responseinner.result.summary]);
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
                }
                else {
                    //
                    var item_date = new Date(event.start.dateTime);
                    var itemTimeFriendly;
                    if (item_date.getHours() >= 13) {
                        itemTimeFriendly = item_date.getHours() - 12;
                    }
                    else {
                        itemTimeFriendly = item_date.getHours();
                    }
                    if (itemTimeFriendly === 0) {
                        itemTimeFriendly = 12;
                    }
                    if (item_date.getHours() >= 12) {
                        if (item_date.getMinutes() == 0) {
                            itemTimeFriendly += ":" + "00pm";
                        }
                        else {
                            itemTimeFriendly += ":" + item_date.getMinutes() + "pm";
                        }

                    }
                    else {
                        if (item_date.getMinutes() == 0) {
                            itemTimeFriendly += ":" + "00am";
                        }
                        else {
                            itemTimeFriendly += ":" + item_date.getMinutes() + "am";
                        }
                    }
                    //
                    var item_date2 = new Date(event.end.dateTime);
                    var itemTimeFriendly2;
                    if (item_date2.getHours() >= 13) {
                        itemTimeFriendly2 = item_date2.getHours() - 12;
                    }
                    else {
                        itemTimeFriendly2 = item_date2.getHours();
                    }
                    if (itemTimeFriendly2 === 0) {
                        itemTimeFriendly2 = 12;
                    }
                    if (item_date2.getHours() >= 12) {
                        if (item_date2.getMinutes() == 0) {
                            itemTimeFriendly2 += ":" + "00pm";
                        }
                        else {
                            itemTimeFriendly2 += ":" + item_date2.getMinutes() + "pm";
                        }

                    }
                    else {
                        if (item_date2.getMinutes() == 0) {
                            itemTimeFriendly2 += ":" + "00am";
                        }
                        else {
                            itemTimeFriendly2 += ":" + item_date2.getMinutes() + "am";
                        }
                    }
                    //
                    agendaCard.find(".panel-body").append("<p>" + item_date.toDateString() + " at " + itemTimeFriendly + " to " + item_date2.toDateString() + " at " + itemTimeFriendly2 + "</p>");
                }
                //



                //
                $("#main").append(agendaCard);

                //console.log("APPENDING " + event.summary)
                //$("#screen_agenda").append("<p>" + event.summary + ' (' + when + ') |||| ' + "response.result.items[i].id" + "</p>");
            }



        }
    });





}

function calStuff() {
    var ids = ["lanetechccc@gmail.com", "lanetechcollegeprep@gmail.com", "cps.edu_7nit1kh7d5hb3qscd6de3f0q68@group.calendar.google.com"];

    for (var i = 0; i < ids.length; i++) {
        listUpcomingEvents(ids[i]);

    }
}
