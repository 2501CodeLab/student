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
//$(window).on("load", function() {
//    console.log("%c>> WINDOW LOADED", "color: #39b54a;");
//    if ("serviceWorker" in navigator) {
//        navigator.serviceWorker.register('sw.js').then(function(registration) {
//            console.log("%c>> LOADED AND REGISTERING", "color: #39b54a;");
//        }, function(error) {
//            console.log("%c>> ------------------------", "color: #39b54a;");
//            console.log("%c>> REGISTER FAILED", "color: #39b54a;");
//            console.log(error);
//            console.log("%c>> ------------------------", "color: #39b54a;");
//        });
//    }
//});
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
        carouselCard.find(".carousel_news_caption").html(data.val()[i].caption);
        carouselCard.find(".carousel_img").css("background-image", "url(" + data.val()[i].img + "), url(assets/media/default_background.png)");
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
        $("#app_alert_wrapper").prepend('<div id="app_alert" style="margin-top: 20px" class="alert ' + data.val().class + '"> <p>' + data.val().content + '</p> </div>');
    }
});
