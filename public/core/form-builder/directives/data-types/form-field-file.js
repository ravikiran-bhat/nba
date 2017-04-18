//'use strict';
var formFieldFileTemplate = require('../../partials/form-field-file.html');
var formFieldOverlay = require('../../partials/form-field-overlay.html');

module.exports = [
  '$compile',
  /*'FormbuilderFileService',*/
  'postMessageUploadService',
  'modalService',
  'utilsService',
  'alertService',
  '$timeout',
  '$cacheFactory',
  function(compile, /*builtApi,*/ postMessageUploadService, modalService, Utils, Alert, $timeout, $cache) {
    var uploadCache = $cache('uploadCache');
    return {
      template: formFieldFileTemplate,
      restrict: 'A',
      replace: true,
      scope: {
        field     : '=field',
        obj       : '=obj',
        ctx       : '=ctx',
        prop      : '=prop',
        apikey    : '=apikey',
        authtoken : '=authtoken',
        apihost   : '=apihost',
        viewonly  : '=viewonly',
        tenant    : '=tenant'
      },
      link: function(scope, elem, attrs) {
        scope.randvalue = Utils.getRand();

        // passing url to post message directive
        scope.url = "uploads";

        //DOM
        scope.upload = {};
        scope.progressstatus = false;
        scope.fileUploaded = scope.ctx[scope.prop] ? true : false;
        
        /**
         * In case of displaying uploads in the DOM, the upload(file object) is shown in 
         the DOM instead of the value of the object(ctx[prop]).
         * So, we use scope.upload to show upload in the DOM and scope.ctx[scope.prop]
          for maintaing the scope of the object.
         * Hence, there is no binding for the file object which is displayed in the DOM.
         * The DOM is updated using $.watch to detect changes in the ctx[prop].
         * An UploadCache is maintained and uploads are stashed in it. A watcher is attached to the value of the object(ctx[prop]).
         * When the Array(ctx[prop]) is altered, the DOM is updated manually by getting the file object from the uploadCache.
         */

          scope.$watch('ctx[prop]', function(newVal, oldVal) {
            console.log("newVal, oldVal", newVal, oldVal);
            //if (scope.field.multiple) {
              if(_.isEqual(newVal, oldVal)) return;
        
              console.log("ctx[prop]", scope.ctx[scope.prop])
              if (uploadCache.get(scope.ctx[scope.prop])) {
                showUpload(uploadCache.get(scope.ctx[scope.prop]));
              }else{
                console.log("clearing upload")
                clearUpload();
              }
            //}
          })

        scope.removeUpload = function() {
          var uploadUid = _.clone(scope.ctx[scope.prop]);
          uploadCache.remove(uploadUid);

          scope.ctx[scope.prop] = "";
          scope.fileUploaded = false;
          scope.randvalue = Utils.getRand();
        }

        scope.uploadFile = function(elements) {
          Utils.sa(scope, function() {
            scope.progressstatus = true;
          });

          $(elem).find('form').trigger('submit');
          console.log("calling postMessageUploadService")
          postMessageUploadService.getPostMessage(scope.randvalue)
            .then(function(res) {
              if (res.hasOwnProperty('error_code')) {
                scope.progressstatus = false;
                Alert.notify({
                  title: "File upload failed!",
                  content: res.error_message,
                  type: 'error'
                })
              }else {
                res.upload.url = addAuthTokenAndApikey(res.upload.url);
                showUpload(res.upload);
              }
            });
        }

        /* On click event for choosing upload from already uploaded */
        scope.showGallery = function() {
          console.log(scope.authtoken);
          modalService.openModal({
            authtoken : scope.authtoken,
            apikey    : scope.apikey
          }, formFieldOverlay, assetGalleryCtrl)
            .then(function(selectedItem) {
              showUpload(selectedItem);
            }, function() {});
        }

        /* modal controller */
        var assetGalleryCtrl = function($scope, $modalInstance, data) {
          $scope.data = data;

          $scope.selected = {
            item: ''
          };
          $scope.isActive = function(obj) {
            return $scope.selected.item == obj;
          }
          $scope.ok = function() {
            $modalInstance.close($scope.selected.item);
          };
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
          $scope.itemDirectUpload = function(item) {
            $modalInstance.close(item);
          }
        }


        function clearUpload() {
          scope.upload = {};      
          scope.progressstatus = false;
          scope.fileUploaded = false;
        }

        function showUpload(upload) {
          // set the upload cache for upload objects
          if (!uploadCache.get(upload.uid)) {
            uploadCache.put(upload.uid, upload);
          }
          scope.upload = upload;
          scope.upload.file_size = Utils.bytesToSize(upload.file_size);
          scope.ctx[scope.prop] = upload.uid;
          scope.upload.isImage = Utils.isImage(upload.filename);

          if(scope.upload.url.lastIndexOf('AUTHTOKEN') == -1)
            scope.upload.url = addAuthTokenAndApikey(scope.upload.url);
            

          scope.progressstatus = false;
          scope.fileUploaded = true;
        }

        function addAuthTokenAndApikey(url) {
          return url += '?AUTHTOKEN=' + scope.authtoken +"&application_api_key="+scope.apikey+"&timestamp="+ Math.round(+new Date()/1000);
        }

        $timeout(function(){
          if (scope.fileUploaded) {
            if(typeof scope.ctx[scope.prop] == "string"){
              scope.ctx[scope.prop] = uploadCache.get(scope.ctx[scope.prop]);
            }
            showUpload(scope.ctx[scope.prop]);
          }else{
            scope.ctx[scope.prop] = "";
          }
        });

      }
    }
  }
]