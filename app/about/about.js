var app = angular.module( 'LTStudent.about', [
  'ui.router'
]);

app.config(function config( $stateProvider ) {
  $stateProvider.state( 'about', {
    url: '/home',
    views: {
      "main": {
        controller: 'AboutCtrl',
        templateUrl: 'app/about/about.tpl.html'
      }
    },
    data:{ pageTitle: 'About' }
  });
});

app.controller( 'AboutCtrl', function AboutController( $scope ) {

$scope.containerMode = "container";




});
