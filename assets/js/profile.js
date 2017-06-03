 // @heymrhayes
 $(function() {
  var bellScheduleEndpoint = 'https://lanetech.org/api/public.php?action=BellSchedule';
  // you can optionally add a date
  $.getJSON(bellScheduleEndpoint).done(function(data) {
   console.log("------------------------------------------------");
   console.log("BELL SCHEDULE");
   console.log(data);
   console.log("------------------------------------------------");
   $.each(data, function(i, v) {
    //
    var day = v.date.split("/");
    day = day.join("-");
    var start = moment(day + " " + v.startTime);
    var end = moment(day + " " + v.endTime);
    //
    $("#bellSchedule").append("<tr><td>" + v.period + "</td><td>" + start.format("hh:mm a") + "</td><td>" + end.format("hh:mm a") + "</td></tr>");
    //
   });
  });
 });
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
 //
 function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
   $("#main").hide();
   $("#signedOut_panel").show();
   //
   $("#studentSchedule").empty();
   $("#studentFutureSchedule").empty();
  });
 }

 function onSignIn(googleUser) {
  $("#loader_wrapper").show();
  if (googleUser) {
   console.log(googleUser.getBasicProfile().getEmail());
   $("#signedOut_panel").hide();
   $("#main").show();
   var id_token = googleUser.getAuthResponse().id_token;
   //
   $.ajax({
    url: 'https://lanetech1.ipower.com/api/student.php',
    method: 'POST',
    dataType: "json",
    data: {
     idtoken: id_token,
     action: 'studentPlannedCourses'
    }
   }).done(function(data) {
    console.log("---------------------------------------");
    console.log("FUTURE SCHEDULE");
    console.log(data);
    console.log("---------------------------------------");
    if (data.length == 0) {
     $("#studentFutureSchedule").parents().eq(1).append('<h5 class="text-center">We don\'t seem to have any courses for you.</h5>');
    } else {
     $.each(data, function(i, v) {
      $("#studentFutureSchedule").append("<tr><td>" + v.subject + "</td><td>" + v.level + "</td><td>" + v.title + "</tr>");
     });
    }
   });
   //
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
     $("#loader_wrapper").fadeOut();
    }
   });
   //
  }
 }
 $(window).on("load", function() {
  $("#loader_wrapper").fadeOut();
 });
 