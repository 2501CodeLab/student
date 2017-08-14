var app = angular.module( 'LTStudent.home', [
  'ui.router'
]);

app.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'app/home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Home' }
  });
});

app.controller( 'HomeCtrl', function HomeController( $scope ) {
$scope.containerMode = "none";

    var slides = $scope.slides = [];
    $scope.active = 0;

    slides.push({
      image: 'https://2501codelab.github.io/student/assets/media/default_background.png',
      title: "LT Student v2.0",
      caption: "Now indev!",
      id: 0
    });

    slides.push({
      image: 'https://2501codelab.github.io/student/assets/media/default_background.png',
      title: "Built on AngularJS",
      caption: "Now 137% faster!",
      id: 1
    });

    slides.push({
      image: 'https://2501codelab.github.io/student/assets/media/default_background.png',
      title: "still indev",
      caption: "Now 50% more broken!",
      id: 2
    });


});
