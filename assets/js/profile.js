 // @heymrhayes
 $(function() {
  var bellScheduleEndpoint = 'https://lanetech.org/api/public.php?action=BellSchedule';
  // you can optionally add a date
  $.getJSON(bellScheduleEndpoint).done(function(data) {
   $.each(data, function(i, v) {
    $("#bellSchedule").append("<tr><td>" + v.period + "</td><td>" + v.startTime + "</td><td>" + v.endTime + "</td></tr>");
   })
  })
 })

 function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
   $("#main").hide();
   $("#signedOut_panel").show();
   //
   $("#studentSchedule").empty();
  });
 }

 function onSignIn(googleUser) {
  if (googleUser) {
   console.log(googleUser.getBasicProfile().getEmail());
   $("#signedOut_panel").hide();
   $("#main").show();
   var id_token = googleUser.getAuthResponse().id_token;
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
 