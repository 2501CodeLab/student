console.log('%c --------------------------------------', 'color: #ff3e3e;');
console.log('%c rude', 'color: #ff3e3e;');
console.log('%c ', 'color: #ff3e3e;');
console.log('%c snooping around the console like that', 'color: #ff3e3e;');
console.log('%c Just kidding.', 'color: #ff3e3e;');
console.log('%c That\'s okay, if anything, we encourage it! Check out our Github at: https://github.com/2501CodeLab/', 'color: #ff3e3e;');
console.log('%c All of our projects\' code is usually there.', 'color: #ff3e3e;');
console.log('%c Found a bug? Broke something? Got an error? Report it to us!', 'color: #ff3e3e;');
console.log('%c --------------------------------------', 'color: #ff3e3e;');
//
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});
//
(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-88791541-5', 'auto');
ga('send', 'pageview');
//
$("#zy_washere").hover(function() {
    $("#zy_msg").hide();
    $("#zy_logo").fadeIn();
}, function() {
    $("#zy_logo").hide();
    $("#zy_msg").fadeIn();
});
//
$.ajax({
    url: "https://lt-student-1dbfa.firebaseio.com/announcement.json",
    dataType: "json",
    success: function(data) {
        console.log("App alert data", data);
        if (data.show) {
            $("#app_alert_wrapper").prepend('<div id="app_alert" style="margin-top: 20px" class="alert ' + data.class + '"> <p>' + data.content + '</p> </div>');
        }
    },
    error: function(e) {
        console.error("Couldn't get app alert.", e);
    }
});
