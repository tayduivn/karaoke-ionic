karaoke.controller('PlaylistsCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.playlist = function(){
    $http.get(rootUrl + "/playlists")
      .success(function(response){
        $scope.playlists = response;
        console.log()
    });
  }

  // $http.get(rootUrl + $scope.playlists.id + '/playlists' + $scope.playlists.id)
  //   .success(function(response){
  //     $scope.userplaylist = response
  //   })

    $scope.playlistParty
    // $scope.user

    $scope.createParty = function(){
      $http.post(
        rootUrl + "/playlists",
        {artist: $scope.artist, title: $scope.title}
      )
    }
}]);
