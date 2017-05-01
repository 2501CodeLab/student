 var user;

 function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
   $("#main").hide();
   $("#signedOut_panel").show();
   $("#not_cps").hide();
   $("#main").empty();
   $("#main").append('<button class="btn btn-primary center-block" onclick="signOut();">Sign out</button><br>');
   //
  });
 }
 //
 var mainData = {};
 //
 function onSignIn(googleUser) {
  if (googleUser) {
   user = googleUser;
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
     action: 'studentGradeHistory'
    }
   }).done(function(data) {
    console.log("GRADE DATA");
    console.log(data);
    //
    if (data.length == 0) {
     $("#main").hide();
     $("#not_cps").show();
    } else {
     for (var i = 0; i < data.length; i++) {
      if (!mainData[data[i].grade]) {
       mainData[data[i].grade] = [data[i]];
      } else {
       mainData[data[i].grade].push(data[i]);
      }
     }
     $.each(mainData, function(k, v) {
      console.log(v);
      if (!$("#table_" + k).length) {
       $("#main").prepend('<div class="table-responsive"> <table class="table table-striped"> <thead> <tr> <th>Course</th> <th>Teacher</th> <th>Letter Grade</th> <th>Average</th> </tr> </thead> <tbody id="table_' + k + '_s1"> </tbody> </table> </div>');
       $("#main").prepend("<h4>1st Semester</h4>");
       $("#main").prepend('<div class="table-responsive"> <table class="table table-striped"> <thead> <tr> <th>Course</th> <th>Teacher</th> <th>Letter Grade</th> <th>Average</th> </tr> </thead> <tbody id="table_' + k + '_s2"> </tbody> </table> </div>');
       $("#main").prepend("<h4>2nd Semester</h4>");
       $("#main").prepend("<h3>" + k + "th Grade</h3>");
       $("#main").prepend("<hr>");
      }
      for (var i = 0; i < v.length; i++) {
       console.log(v[i].term.charAt(5));
       if (v[i].term.charAt(5) == "1") {
        $("#table_" + k + "_s1").append("<tr><td>" + v[i].class + "</td><td>" + v[i].teacher + "</td><td>" + v[i].letter_grade + "<td>" + v[i].average + "</td></tr>");
       } else {
        $("#table_" + k + "_s2").append("<tr><td>" + v[i].class + "</td><td>" + v[i].teacher + "</td><td>" + v[i].letter_grade + "<td>" + v[i].average + "</td></tr>");
       }
      }
      if ($("#table_" + k + "_s1").children().length == 0) {
       $("#table_" + k + "_s1").parents().eq(1).append('<h5 class="text-center">No data found.</h5>');
      }
      if ($("#table_" + k + "_s2").children().length == 0) {
       $("#table_" + k + "_s2").parents().eq(1).append('<h5 class="text-center">No data found.</h5>');
      }
     });
    }
    $("#loader_wrapper").fadeOut();
   });
   return "yes";
  } else {
   $("#loader_wrapper").fadeOut();
   return "no";
  }
 }
 // temp fix
 $(window).on("load", function() {
  $("#loader_wrapper").fadeOut();
 });
 