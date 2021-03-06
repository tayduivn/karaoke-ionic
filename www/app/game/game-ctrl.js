karaoke.controller('GameCtrl', ['$http', '$scope', '$state', '$ionicPopup', '$window', '$timeout', function($http, $scope, $state, $ionicPopup, $window, $timeout){
  $scope.party = {
    id: ""
  }

  function setHeader() {
      return {
        "access-token": window.sessionStorage.token,
        "token-type": "Bearer",
        "client": window.sessionStorage.client,
        "expiry": window.sessionStorage.expiry,
        "uid": window.sessionStorage.uid,
        "id": window.sessionStorage.id
      };
  };

  $scope.IsHidden = true;
  $scope.btnClick = function(){
    $scope.IsHidden = false
  }

  $scope.createParty = function() {
    $http.post(rootUrl + '/api/parties', {}, {headers: setHeader()})
    .then(function(response){
      console.log(response)
      $state.go('tabs.game', {reload: true});
      $scope.partyID = response.data.id
      $scope.idAlert(response.data.id)
    })
  }

  $scope.joinParty = function() {
    $http.put(rootUrl + "/api/parties/" + $scope.party.id, {}, {headers: setHeader()})
    .then(function(response){
      console.log(response)
      $state.go('tabs.game', {reload: true});
      angular.element('#game-title').text("Game #ID: " + response.data.id)
    })
  }

  $scope.shuffleSong = function(){
    $scope.show = false
    $http.post(rootUrl + "/api/song_matches", {}, {headers: setHeader()})
      .then(function(response){
        $scope.btnClick()
        $scope.IsHidden = false
        $timeout(function(){
          $scope.IsHidden = true
          angular.element("#upcoming-singer").append("<div class='list card'><div class='item'><p><strong>"+response.data.song_title+"</strong></p><p>"+response.data.song_artist+"</p><p>"+response.data.singer_name+"</p></div></div>")
        }, 2000);
    }).catch(function(data){
      $scope.noPartyAlert();
    })
  }

  $http.get(rootUrl + "/api/song_matches", {headers: setHeader()})
    .then(function(response){
      console.log(response)
      var userPartySongs = response.data
      $scope.partySongs = response.data
      $scope.currentSinger = response.data[0]
      partySong = userPartySongs.shift()
    })

  $scope.doneSong = function() {
    $http.delete(rootUrl + "/api/song_matches/" + partySong.song_id, {
      headers: setHeader()
    }).then(function(response){
       $window.location.reload();
    }).catch(function(data){
      $scope.waitAlert();
    })
  }

  $http.get(rootUrl + "/api/parties/players_data", {headers: setHeader()})
    .then(function(response){
      $scope.partyPeople = response.data
    })

  $scope.leaveParty = function() {
    $http.put(rootUrl + "/api/parties/remove_player", {}, {headers: setHeader()})
      .then(function(){
      $state.go('tabs.home');
    })
  }

  $scope.idAlert = function(id) {
    var alertPopup = $ionicPopup.alert({
     title: "YOUR party ID:  " + id,
     template: 'Share this id with your friends to join the party'
   });
  }

  $scope.waitAlert = function() {
    var alertPopup = $ionicPopup.alert({
     title: "WAIT YOUR TURN"
   });
  }

  $scope.noPartyAlert = function() {
    var alertPopup = $ionicPopup.alert({
     title: "NO CURRENT PARTY",
    });
  }


}]);
