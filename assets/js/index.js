var content;
var url = "https://www.googleapis.com/blogger/v3/blogs/7913237957447191767/posts?key=AIzaSyDO0gVmX_e8P578L5BXnMakhHA_2TTOZw4";
$.ajax({
    url: url,
    method: 'GET',
    dataType: 'jsonp'
}).done(function(data) {
    console.log(data);
    //
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
    //
}).fail(function(jqXHR, textStatus, errorThrown) {
    alert("There was an error while trying to get Lane Tech's blog data.");
    console.log(jqXHR);
    console.log(textStatus);
    console.log(errorThrown);
});
/////
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
            events = events.items;
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
                    switch (cal_id) {
                        case "lanetechccc@gmail.com":
                            agendaCard.find(".agenda_calendarName").text("College & Career Center");
                            break;
                        case "lanetechcollegeprep@gmail.com":
                            agendaCard.find(".agenda_calendarName").text("General");
                            break;
                        case "cps.edu_7nit1kh7d5hb3qscd6de3f0q68@group.calendar.google.com":
                            agendaCard.find(".agenda_calendarName").text("Athletics");
                            break;
                        default:
                            agendaCard.find(".agenda_calendarName").text("???");
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
                        var itemTimeFriendly;
                        if (item_date.getHours() >= 13) {
                            itemTimeFriendly = item_date.getHours() - 12;
                        } else {
                            itemTimeFriendly = item_date.getHours();
                        }
                        if (itemTimeFriendly === 0) {
                            itemTimeFriendly = 12;
                        }
                        if (item_date.getHours() >= 12) {
                            if (item_date.getMinutes() == 0) {
                                itemTimeFriendly += ":" + "00pm";
                            } else {
                                itemTimeFriendly += ":" + item_date.getMinutes() + "pm";
                            }
                        } else {
                            if (item_date.getMinutes() == 0) {
                                itemTimeFriendly += ":" + "00am";
                            } else {
                                itemTimeFriendly += ":" + item_date.getMinutes() + "am";
                            }
                        }
                        //
                        var item_date2 = new Date(event.end.dateTime);
                        var itemTimeFriendly2;
                        if (item_date2.getHours() >= 13) {
                            itemTimeFriendly2 = item_date2.getHours() - 12;
                        } else {
                            itemTimeFriendly2 = item_date2.getHours();
                        }
                        if (itemTimeFriendly2 === 0) {
                            itemTimeFriendly2 = 12;
                        }
                        if (item_date2.getHours() >= 12) {
                            if (item_date2.getMinutes() == 0) {
                                itemTimeFriendly2 += ":" + "00pm";
                            } else {
                                itemTimeFriendly2 += ":" + item_date2.getMinutes() + "pm";
                            }
                        } else {
                            if (item_date2.getMinutes() == 0) {
                                itemTimeFriendly2 += ":" + "00am";
                            } else {
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
        },
        error: function(response) {
            alert("An error has occured while trying to get Lane Tech's calendar events.");
            //
            console.log(response);
        }
    });
}
$(document).ready(function() {
    calStuff();
});
///
var config = {
    apiKey: "AIzaSyDoFhb7KHPyBHftlwotKdfDUkZbh0iyL0E",
    authDomain: "lt-student-1dbfa.firebaseapp.com",
    databaseURL: "https://lt-student-1dbfa.firebaseio.com",
    projectId: "lt-student-1dbfa",
    storageBucket: "lt-student-1dbfa.appspot.com",
    messagingSenderId: "663702008341"
};
firebase.initializeApp(config);
//
var newsRef = firebase.database().ref('news/');
newsRef.once('value').then(function(data) {
    for (var i = 0; i < data.val().length; i++) {
        var carouselCard = $("#template_carousel_card").clone();
        carouselCard.removeAttr("id");
        carouselCard.find(".carousel_news_title").text(data.val()[i].title);
        carouselCard.find(".carousel_news_caption").text(data.val()[i].caption);
        carouselCard.find(".carousel_img").css("background-image", "url(" + data.val()[i].img + ")");
        if (i == 0) {
            carouselCard.addClass("active");
        }
        $(".carousel-inner").append(carouselCard);
    }
    $('.carousel').carousel({
        interval: 5000,
        pause: null
    });
});
//
var newsRef = firebase.database().ref('announcement/');
newsRef.once('value').then(function(data) {
    if (data.val().show) {
        $("#main").prepend('<div id="app_alert" style="margin-top: 20px" class="alert alert-dismissible ' + data.val().class + '"> <p>' + data.val().content + '</p> </div>');
    }
});
//
$(window).on('load', function(e) {
    $("#loader_wrapper").fadeOut();
});
