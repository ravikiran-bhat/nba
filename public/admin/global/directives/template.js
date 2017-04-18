 'use strict';
var templateTmpl              = require('./partials/template.html')
var languageModalOverlay      = require('./partials/language-selection-modal.html');
var buttonsModalOverlay       = require('./partials/buttons-selection-modal.html');
var customButtonsModalOverlay = require('./partials/custom-btn-selection-modal.html');

module.exports = [
  'utilsService',
  'alertService',
  '$timeout',
  'constants',
  'modalService',
  'tip',
  function(Utils, Alert, $timeout, constants, Modal,TIP) {
    return {
      template: templateTmpl,
      restrict: 'A',
      replace: true,
      scope: {
        templateData     : "=templateData",
        prefilled        : "=",
        showTemplateName : "="
      },
      link: function(scope, elem, attrs) {
        var defaultTemplate = {
          name: undefined,
          content:[{
            locale    :  "en-us",
            title     : "",
            body      : "",
            sub_title : ""  
          }],
          push_action     : constants.notification.defaultAction,
          data            : {},
          bcolor          : "",  
          image           :  "",  
          bimage          : "",  
          video           :  "",  
          small_icon      : "",  
          large_icon      : "",  
          sound           :  "",  
          buttons         : [],
          collapse_id     : "",
          silent_push     : false,
          mutable_content : true
        }

        function initialiseActionSelect(elemClass, initialValue, updateValue, index){
          setTimeout(function() {
            var  actionSelector = $(elem).find(elemClass);
            actionSelector.select2({
              closeOnSelect : true,
              multiple      : false,
              placeholder   : "Select Message Action",
              data          : [{
                id   : 'home',
                text : 'Home'
              }, {
                id: 'web_page',
                text: 'Web Page'
              }, {
                id: 'other',
                text: 'Other'
              }]
            });
            actionSelector.select2("val", initialValue)
            actionSelector.on('change', function(e) {
              updateValue(e.val, index)
            })
          }, 10);
        }
        
        scope.languages    = constants.notification.languages
        //scope.templateData = scope.template.uid ? R.cloneDeep(scope.template) : defaultTemplate
        
        var messageWrap           = $('.new-message-wrap');
        var originalTemplate      = R.cloneDeep(scope.templateData)
        scope.templateData        = scope.prefilled ? scope.templateData : defaultTemplate;
        scope.pushNotificationBtn = {};

        /*Message section*/
        scope.removeLanguage = function(index, locale){
          scope.templateData.content.splice(index, 1);
        }

        //language selection modal
        scope.selectLanguages = function() {
          var modalData = {
            languages         : scope.languages,
            content : R.cloneDeep(scope.templateData.content)
          }
          Modal.openModal(modalData,languageModalOverlay,languageModalInstanceCtrl)
          .then(function(content) {
            scope.templateData.content = [scope.templateData.content[0]].concat(content)
          })
        }
        
        var languageModalInstanceCtrl = function($scope, $modalInstance, data) {
          $scope.languages         = data.languages;
          $scope.content           = data.content;
          $scope.selectedLanguages = data.content ? data.content.filter(function(content){
            return content.locale !== 'en-us'
          }).map(function(content){
            return content.locale
          }) : []

          //to retain the values entered by the user
          function getFromExistingContent(locale){
            return $scope.content.filter(function(con){
              return con.locale === locale
            })[0]
          }
          $scope.ok = function() {
            var contentData = $scope.selectedLanguages.map(function(locale){
            var content = getFromExistingContent(locale)
              return content ? content : {
                locale    : locale,
                title     : "",
                body      : "",
                sub_title : ""
              }
            })

            $modalInstance.close(contentData);
            return false;
          };

          $scope.selectLanguage = function(language){
            if($scope.selectedLanguages.indexOf(language)===-1){
              $scope.selectedLanguages.push(language)
              return
            }
            $scope.selectedLanguages.splice($scope.selectedLanguages.indexOf(language), 1)
          }

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
        }

        scope.togglePanel =function(e) {
          var parentElem = $(event.currentTarget).parent().parent();
          parentElem.toggleClass('active');
          destroyTips();
        }

        function destroyTips() {
         TIP.destroyAll(messageWrap);
        }

        function updatePushActionValue(newVal){
          scope.$apply(function(){
            scope.templateData.push_action = newVal === 'home' ? newVal : ""
          })
        }

        /*Message Action Section*/
        initialiseActionSelect('.js-message-action-select', scope.templateData.push_action, updatePushActionValue)
       

        /*Buttons*/
        var elemPrefix = '.js-btn-action-select-'
        scope.buttons  = constants.notification.buttons;
        
        function updateButtonActionValue(newVal, index){
          scope.$apply(function(){
            scope.templateData.buttons[index].action = newVal === 'home' ? newVal : ""
          })
        }

        scope.selectButtonsModal = function(){
          var modalData = {
            buttons : scope.buttons
          }
          function addToButtons(data){
            scope.templateData.buttons.push({
              id: data.id,
              text: data.text,
              action: data.action,
              icon: ""
            }) 
          }

          Modal.openModal(modalData, buttonsModalOverlay, buttonsModalInstanceCtrl)
          .then(function(selectedButton) {
            var selectedButtonsCount  = selectedButton.option2 ? 2 : 1
            var checkButtonCount      = scope.templateData.buttons.length + selectedButtonsCount

            if(checkButtonCount > constants.notification.buttonLimit){
              Alert.notify({
                title   : "Not allowed",
                content : "Max three buttons can be added"
              })
              return;
            }

            addToButtons(selectedButton.option1)
            //selectedButton.option1.action = "home"
            initialiseActionSelect(elemPrefix+selectedButton.option1.id , selectedButton.option1.action, updateButtonActionValue, scope.templateData.buttons.length -1)
            if(selectedButton.option2){
              addToButtons(selectedButton.option2)
              initialiseActionSelect(elemPrefix+selectedButton.option2.id , selectedButton.option2.action, updateButtonActionValue, scope.templateData.buttons.length -1)
            }
          })
        }

        scope.selectCustomButtonsModal = function(){
          var modalData = {
            buttons : scope.buttons
          }

          function addToButtons(data){
            scope.templateData.buttons.push({
              id: data.id,
              text: data.text,
              action: data.action,
              icon: ""
            }) 
          }

          Modal.openModal(modalData, customButtonsModalOverlay, customButtonsModalInstanceCtrl)
          .then(function(customButton) {
            if(scope.templateData.buttons.length > constants.notification.buttonLimit -1) {
              Alert.notify({
                title   : "Not allowed",
                content : "Max three buttons can be added"
              })
              return;
            }
            addToButtons(customButton)
            initialiseActionSelect(elemPrefix+customButton.id , customButton.action, updateButtonActionValue,scope.templateData.buttons.length -1);
          })
        }

        scope.removeButton = function(index){
         scope.templateData.buttons.splice(index,1)
        }
        
        var customButtonsModalInstanceCtrl = function($scope,$modalInstance,data){
          $scope.buttons            = data.buttons;
          $scope.customButton       = {};
          $scope.customBtnDataArray = [];

          $scope.buttonObject = {
            text:"",
            id: "",
            action:"home"
          }

          $scope.createCustomBtns = function(){
            if(!(_.isEmpty($scope.buttonObject.text)) && !(_.isEmpty($scope.buttonObject.id)))
            $modalInstance.close($scope.buttonObject);
          }

          $scope.ok = function(btn) {
           $modalInstance.close(btn)
          };

          $scope.cancel = function() {
           $modalInstance.dismiss('cancel');
          }
        }

        var buttonsModalInstanceCtrl = function($scope,$modalInstance,data){
          $scope.buttons = data.buttons;
          $scope.customButton = {};
          $scope.ok = function(btn) {
            $modalInstance.close(btn)
          };

          $scope.selectButton = function(btn) {
            $scope.ok(btn)
          }

          $scope.cancel = function() {
           $modalInstance.dismiss('cancel');
          }
        }

        var maintainDevicePosition = function() {
          var $deviceSample = $(".message-content-preview"),
          $window           = $(window),
          offset            = $deviceSample.offset(),
          topPadding        = 40;

          $window.scroll(function() {
            if ($window.scrollTop() > offset.top) {
              $deviceSample.stop().animate({
                marginTop: $window.scrollTop() - offset.top + topPadding
              });
            } else {
              $deviceSample.stop().animate({
                marginTop: 0
              });
            }
          });
        }

        maintainDevicePosition();

        /*Media - Images, videos, icons*/
        scope.onMediaKeyup = function(e, key) {
          if(key === 'bimage' || key === 'image') {
            runImage(e.target.value, key)
          }

          if(key === 'bimage') {
            checkBackgroundImage(e.target.value);
          }
        }

        function testImage(url, timeoutT) {
          return new Promise(function(resolve, reject) {
            var timeout    = timeoutT || 5000;
            var timer, img = new Image();
            img.onerror = img.onabort = function() {
              clearTimeout(timer);
              reject({status: "Error", message: "Invalid URL"});
              scope.imageLoaded = false;          
            };
            img.onload = function() {
              clearTimeout(timer);
              resolve({status: "success", url: url});
              scope.imageLoaded = true;
            };
            img.src = url;
            timer = setTimeout(function() {
              img.src = "";
              reject({status: "Error", message: "Timeout error"});
            },timeout);
          });
        }

        function checkBackgroundImage(url) {
          $('.sdi-media-block').css({
            "background-image":"url("+url+")",
            "display":"block"
          });
        }

        function runImage(url, key) {
          testImage(url)
          .then(function(res){
            scope.templateData[key] = res.url;
          }, function(xhr){
          });
        }

        /*data */
        scope.dataArray = []
        scope.addData = function(){
          scope.dataArray.push({
            key   : "",
            value : ""
          })
        }

        scope.removeData = function(index){
          delete scope.templateData.data[scope.dataArray[index].key]
          scope.dataArray.splice(index, 1)
        }
        
        scope.$watch("dataArray", function(newData, oldData){
          scope.templateData.data = scope.dataArray.map(function(data){
            var obj       = {}
            obj[data.key] = data.value
            return obj
          })
        }, true)
      }
    }
  }
]