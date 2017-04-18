'use strict';
var formFieldLocationTemplate = require('../../partials/form-field-location.html');

module.exports = [
  '$q',
  'libraryService',
  function($q, LIB) {
    return {
      template: formFieldLocationTemplate,
      restrict: 'A',
      replace: true,
      scope: {
        obj: '=obj'
      },
      link: function(scope, elem, attrs) {
        /** 
         *Reason for using two different scope variable for same condition is because, In some cases even if location status is true the haslocationTag condition can be false;
         **/
        scope.hasLocationTag = (scope.obj.hasOwnProperty('__loc') && scope.obj.__loc !== null) ? true : false;
        scope.locationStatus = (scope.obj.hasOwnProperty('__loc') && scope.obj.__loc !== null) ? true : false;
        scope.loc = {}
        scope.marker = null;



        //Watch for location Status change
        scope.$watch('locationStatus', function() {
          if (scope.locationStatus) {
            //Check if location tag is present
            scope.loc.lat = scope.hasLocationTag ? scope.obj.__loc[1] : 37.74045209829323;
            scope.loc.lng = scope.hasLocationTag ? scope.obj.__loc[0] : -122.4431164995849;

            populateLatLngInputs(scope.loc.lat, scope.loc.lng)

            //Initialize geolocation function on getting Google Maps Implicitly
            LIB.get('googleMaps').then(function() {
              InitializeGeoLocationMap();
            })
            $("#object-geo-location-map").show();
          } else {
            scope.obj.__loc = null;
            scope.hasLocationTag = false;
            $("#object-geo-location-map").hide();
          }
        })


        //On lat-lng new input, change the location
        scope.$watchCollection('[loc.lat,loc.lng]', function() {
          if (scope.locationStatus) {
            populateLatLngInputs(scope.loc.lat, scope.loc.lng);
            LIB.get('googleMaps').then(function() {
              setMapMarker();
            })
          }
        })


        //Initializing Map data
        function InitializeGeoLocationMap() {
          google.maps.visualRefresh = true;
          var latlng = new google.maps.LatLng(scope.loc.lat, scope.loc.lng)
          var mapOptions = {
            zoom: 18,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControl: true
          }
          scope.mapObject = new google.maps.Map(document.getElementById("object-geo-location-map"),
            mapOptions);

          //Set Map marker initially
          setMapMarker();

        }

        //Set Map marker
        function setMapMarker() {
          var latlng = new google.maps.LatLng(scope.loc.lat, scope.loc.lng);
          scope.mapObject.setCenter(latlng);
          if (scope.marker != null) {
            scope.marker.setMap(null);
            scope.marker = null;
          }
          scope.marker = new google.maps.Marker({
            map: scope.mapObject,
            position: latlng,
            draggable: true,
            icon: 'images/gmap/spotlight-poi.png'
          });

          //attach listener to map marker initially
          attachListenerToMarker();
        }


        //Attach a listener to map marker incase of draging it to new location
        function attachListenerToMarker() {

          google.maps.event.addListener(scope.marker, 'dragend', function() {

            var position = scope.marker.getPosition();
            scope.mapObject.setCenter(position);

            scope.$apply(function() {
              populateLatLngInputs(position.lat(), position.lng())
            });
          });
        }

        //populate locaton data 
        function populateLatLngInputs(lat, lng) {
          if (!scope.hasLocationTag) {
            scope.obj.__loc = [];
          }
          scope.obj.__loc[1] = scope.loc.lat = lat;
          scope.obj.__loc[0] = scope.loc.lng = lng;

          //MAke location tag true
          scope.hasLocationTag = true;
        }

        //Initialize Select2 for Map Search Box
        scope.searchRef = _.throttle(function(query) {
          var deferred = $q.defer();
          var geocoder = new google.maps.Geocoder();
          var objResults = {};
          geocoder.geocode({
            'address': query
          }, function(locationData, status) {

            if (locationData) {
              objResults = {
                results: locationData.map(function(location) {
                  return {
                    id: location.formatted_address,
                    text: location.formatted_address,
                    other: location
                  }
                })
              }
              deferred.resolve(objResults);
            }
          })
          return deferred.promise;
        }, 10);

        //On address selection re-render Map
        scope.onSelectedSearchlocation = function(result) {
          result = result.other;
          scope.$apply(function() {
            populateLatLngInputs(result["geometry"]["location"].lat(), result["geometry"]["location"].lng());
          })
          setMapMarker();
        }



      }
    }
  }
]