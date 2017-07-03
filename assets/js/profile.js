/* no need
$(function() {
 var bellScheduleEndpoint = 'https://lanetech.org/api/public.php?action=BellSchedule';
 $.getJSON(bellScheduleEndpoint).done(function(data) {
  console.log("------------------------------------------------");
  console.log("BELL SCHEDULE");
  console.log(data);
  console.log("------------------------------------------------");
  $.each(data, function(i, v) {
   var day = v.date.split("/");
   day = day.join("-");
   var start = moment(day + " " + v.startTime);
   var end = moment(day + " " + v.endTime);
   $("#bellSchedule").append("<tr><td>" + v.period + "</td><td>" + start.format("hh:mm a") + "</td><td>" + end.format("hh:mm a") + "</td></tr>");
  });
 });
});
*/
//
function getFriendlyTime(date) {
 var hour;
 var ampm;
 var minutes;
 if (date.getHours() >= 13) {
  hour = date.getHours() - 12;
 } else {
  hour = date.getHours();
 }
 if (date.getHours() === 0) {
  hour = 12;
 }
 //
 if (date.getHours() >= 12) {
  ampm = "pm";
 } else {
  ampm = "am";
 }
 //
 if (date.getMinutes() == 0) {
  minutes = "00";
 } else {
  if (date.getMinutes() < 10) {
   minutes = "0" + date.getMinutes();
  } else {
   minutes = date.getMinutes();
  }
 }
 //
 var friendlyTime = hours + ":" + minutes + ampm;
 return friendlyTime;
}
///////////////////////////
$(window).on("load", function() {
 $("#loader_wrapper").fadeOut();
});
///////////////////////////
var auth2;
//
function handleClientLoad() {
 console.debug("-------------------- GAPI devspace --------------------");
 console.debug("GAPI START");
 gapi.load('auth2', initSigninV2);
};
//
var initSigninV2 = function() {
 console.debug("GAPI INIT");
 auth2 = gapi.auth2.init({
  client_id: "466686405732-8e9j1kgs5bo1uu41pc4gkltlhonbka70.apps.googleusercontent.com",
  scope: "profile",
  hosted_domain: "cps.edu",
 });
 // 
 auth2.isSignedIn.listen(signinChanged);
 // 
 auth2.currentUser.listen(userChanged);
 //
 if (auth2.isSignedIn.get() == true) {
  auth2.signIn();
 }
 //
};
//
var signinChanged = function(state) {
 console.debug('Signin state changed to ' + state);
 if (!state) {
  $("#main").hide();
  $("#signedOut_panel").show();
  //
  $("#not_cps").hide();
  $("#studentSchedule").empty();
  $("#studentFutureSchedule").empty();
  $("#studentFutureSchedule_error").hide();
 } else {
  $("#signedOut_panel").hide();
  $("#main").show();
 }
};
//
var userChanged = function(user) {
 googleUser = user;
 //
 console.log();
 $("#loader_wrapper").show();
 if (auth2.isSignedIn.get()) {
  console.debug("USER");
  console.debug(user.getBasicProfile().getEmail());
  console.debug('User now: ' + user);
  var id_token = user.getAuthResponse().id_token;
  console.debug(id_token);
  // STUDENT BASIC DATA
  $.ajax({
   url: 'https://lanetech1.ipower.com/api/student.php',
   method: 'POST',
   dataType: "json",
   data: {
    idtoken: id_token,
    action: 'studentBasicData'
   },
   success: function(data) {
    console.log("AJAX call done inline");
    if (!data) {
     console.log("nope");
    }
    console.log(data);
    $.each(data.schedule, function(i, v) {
     $("#studentSchedule").append("<tr><td>" + v.period + "</td><td>" + v.courseName + "</td><td>" + v.teacherLastName + "</tr>");
    });
    $("#firstName").text(data["firstName"]);
    $("#lastName").text(data["lastName"]);
    $("#gradeLevel").text(data["gradeLevel"]);
    $("#demerits").text(data["demerits"]);
    $("#counselorEmail").text(data["counselorEmail"]);
    $("#counselorName").text(data["counselorFirstName"] + " " + data["counselorLastName"]);
    $("#loader_wrapper").fadeOut();
   },
   error: function(jqXHR, error) {
    console.log(error);
    if (error == "parsererror") {
     $("#main").hide();
     $("#not_cps").show();
    } else {
     $("#main").hide();
     $("#unknown_error").show();
    }
   }
  });
  // 17-18 SCHEDULE
  $.ajax({
   url: 'https://lanetech1.ipower.com/api/student.php',
   method: 'POST',
   dataType: "json",
   data: {
    idtoken: id_token,
    action: 'studentPlannedCourses'
   },
   success: function(data) {
    console.log("---------------------------------------");
    console.log("FUTURE SCHEDULE");
    console.log(data);
    console.log("---------------------------------------");
    if (data.length == 0) {
     $("#studentFutureSchedule_error").show();
    } else {
     $.each(data, function(i, v) {
      $("#studentFutureSchedule").append("<tr><td>" + v.subject + "</td><td>" + v.level + "</td><td>" + v.title + "</tr>");
     });
    }
   },
   error: function() {
    alert("An error occurred while trying to get next year's schedule.");
   }
  });
 } else {
  console.debug("NO USER");
  console.debug("dev");
  $("#loader_wrapper").fadeOut();
 }
 //
};
//
function signIn() {
 auth2.signIn({
  prompt: "select_account"
 });
}
