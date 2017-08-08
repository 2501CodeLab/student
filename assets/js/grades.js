 var mainData = {};
 $(window).on("load", function() {
  $("#loader_wrapper").fadeOut();
 });
 var auth2;
 //
 function handleClientLoad() {
  console.log("-------------------- GAPI devspace --------------------");
  console.log("GAPI START");
  gapi.load('auth2', initSigninV2);
 }
 //
 var initSigninV2 = function() {
  console.log("GAPI INIT");
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
 };
 //
 var signinChanged = function(state) {
  console.log('Signin state changed to ' + state);
  if (!state) {
   $("#main").hide();
   $("#signedOut_panel").show();
   //
   $("#not_in_system").hide();
   mainData = {};
   $("#main").html('<button class="btn btn-primary center-block" onclick="auth2.signOut();">Sign out</button>');
  } else {
   $("#signedOut_panel").hide();
   $("#main").show();
  }
 };
 //
 var userChanged = function(user) {
  console.log("USERCHANGED EVENT");
  googleUser = user;
  //
  $("#loader_wrapper").show();
  if (auth2.isSignedIn.get()) {
   console.log("IS LOGGED IN");
   console.log("USER");
   console.log(user.getBasicProfile().getEmail());
   $(".email_display").text(user.getBasicProfile().getEmail());
   console.log('User now: ', user);
   var id_token = user.getAuthResponse().id_token;
   console.log(id_token);
   // GRADES
   $.ajax({
    url: 'https://lanetech1.ipower.com/api/student.php',
    method: 'POST',
    dataType: "json",
    data: {
     idtoken: id_token,
     action: 'studentGradeHistory'
    },
    success: function(data) {
     console.log("---------------------------------------");
     console.log("STUDENT GRADES SUCCESS");
     console.log(data);
     console.log("---------------------------------------");
     //
     if (data.length == 0) {
      $("#main").hide();
      $("#not_in_system").show();
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
    },
    error: function(jqXHR) {
     console.log("---------------------------------------");
     console.log("Error getting student grade data");
     console.log(jqXHR);
     console.log(googleUser);
     console.log("---------------------------------------");
     $("#main").hide();
     $("#unknown_error").show();
     $("#loader_wrapper").hide();
    }
   });
  } else {
   console.log("NOT LOGGED IN");
   $("#loader_wrapper").hide();
  }
  //
 };
 //
 function signIn() {
  auth2.signIn({
   prompt: "select_account"
  });
 }
