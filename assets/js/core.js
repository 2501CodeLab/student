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
