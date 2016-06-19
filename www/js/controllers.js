angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('MenuCtrl', function($scope, Menu) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Menu.all();
  $scope.remove = function(item) {
    Menu.remove(item);
  };
})


.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('MapCtrl', ['$scope', function($scope) {
  $scope.map = map;
  $scope.pin = pin;

  //window.onload = initMap();


  var pin, showButton, geocoder, track;
  var pathService, pathDisplay, map, marker;
  var pins = [];
  var addInfo = new google.maps.InfoWindow();
  var home = new google.maps.Marker();
  var drop = document.getElementById('pin');
  var getRoute = document.getElementById('getRoute');
  var locationOptions = {
    enableHighAccuracy: true,
    timeout: 3000,
    maximumAge: 0
  };
  var mapOptions = {
    zoom: 10,
    center: {lat: 37.803, lng: -122.320}
  };

  function locationInfo(addInfo, marker, text, map){
    google.maps.event.addListener(marker, 'click', function(){
      addInfo.setContent(text);
      addInfo.open(map, marker);
    });
  }


  function geoCode(location, mark){
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      latLng: location
    },function(response){
      if(response && response.length > 0){
        locationInfo(addInfo, mark, response[0].formatted_address, map);
      }else{
        locationInfo(addInfo, mark, marker.getPosition().toUrlValue(6), map);
      }
    });
  }

   function dropPins(anc, map){
     pin = new google.maps.Marker({
       position: anc,
       map: map,
       animation: google.maps.Animation.DROP,
       draggable:true
     });
     geoCode(anc, pin);
     map.panTo(anc);
     pins.push(pin);
     google.maps.event.addListener(pin, 'drag', function(){
       addInfo.close();
     });
     google.maps.event.addListener(pin, 'dragend', function(){
       geoCode(pin.getPosition(), pin);
       addInfo.open();
     });
   }

   function initMap(){
     if(navigator.geolocation){
       navigator.geolocation.getCurrentPosition(setWatch, localErr);
     } else{alert('Cannot find your location');}
     map.addListener('click', function(e){
       dropPins(e.latLng, map);
     });
     $scope.dropPin = true;
     track.index = 1;
     map.controls[google.maps.ControlPosition.TOP_RIGHT].push(track);
   }

   function localErr(){
     alert('Location service disabled or unable to determine your location');
   }

   function setWatch(position){
     var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
     map.setCenter(location);
     home.setOptions({
       position: location,
       map: map,
       icon: {
         path: google.maps.SymbolPath.CIRCLE,
         scale: 6,
         fillOpacity:0.8,
         fillColor: '#03acff',
         strokeColor: '#fff',
         strokeWeight: 2
       },
       title: "You are here"
       });
    map.setZoom(14);
    watchPos();
   }

   function watchPos(){
     var watch = navigator.geolocation.watchPosition(function(pos, locationOptions){
       var newLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
       home.setPosition(newLocation);
       map.addListener('bounds_changed', function(){
         map.setCenter(map.getCenter());
       });
     });
     drop.addEventListener('click', function(){
       dropPins(home.getPosition(), map);
     });
     track.addEventListener('click', function(){
       map.setCenter(home.getPosition());
     });
   }


   function directions(pathService, pathDisplay){
     $scope.directionText = true;
     pathDisplay.setMap(map);
     waypts=[];
     for (var i = 0; i<pins.length; i++){
       waypts.push({location: pins[i].getPosition(), stopover: true});
       pins[i].setMap(null);
     }
     pins.length = 0;
     pathService.route({
       origin: home.getPosition(),
       destination: home.getPosition(),
       waypoints: waypts,
       optimizeWaypoints: true,
       travelMode: google.maps.TravelMode.WALKING
     },function(response, status){
       if(status === google.maps.DirectionsStatus.OK){
         pathDisplay.setDirections(response);
         var route = response.routes[0];
         var summary = document.getElementById('route-panel');
         summary.innerHTML = '';
         for(var i=0; i<route.legs.length; i++){
           var segment = i + 1;
           summary.innerHTML += '<b>Route Leg: '+segment+'</b><br>';
           summary.innerHTML += route.legs[i].start_address+', <b>TO:</b> ';
           summary.innerHTML += route.legs[i].end_address+'<br>';
           summary.innerHTML += route.legs[i].distance.text+'<br><br>';
         }
         summary.innerHTML += '<b>END</b>';
       }else{
         window.alert('Sorry, failed to create a route'+status);
       }
     });
   }

  getRoute.addEventListener('click', function(){
    directions(pathService, pathDisplay);
  });

  $scope.$on('$ionicView.enter', function(){
    if(map){

    }else{
      pathService = new google.maps.DirectionsService();
      pathDisplay = new google.maps.DirectionsRenderer({map:map, draggable: true});
      map = new google.maps.Map(document.getElementById('map'), mapOptions);
      track = document.getElementById('track');
      initMap();
    }
  });

}])

.controller('AccountCtrl', function($scope) {

  $scope.settings = settings;

  var settings = {

  };

});
