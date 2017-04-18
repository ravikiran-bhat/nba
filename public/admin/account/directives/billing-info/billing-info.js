'use strict';
var billingInfoTemplate = require('./partials/billing-info.html')

module.exports = [
  'alertService',
  'utilsService',
  'constants',
  'appCacheService',
  'libraryService',
  function(Alert, Utils, constants, appCacheService, LIB) {
    return {
      template: billingInfoTemplate,
      restrict: 'A',
      replace: true,
      scope: {
        billingInfo: "="
      },
      link: function(scope, elem, attrs) {
        var form = $('#billing-info-form');
        var key = constants.braintree.key.dev;
        var btnSaveCard = form.find('.js-btn-save-card');
        var serverConfig = appCacheService.get('serverConfig');
        scope.isModal = scope.billingInfo.callback ? true : false;

        scope.brainTreeLoaded = false;

        scope.years = getYearsArray();
        scope.hasBillingInfo = false;

        if (scope.billingInfo.number) {
          scope.hasBillingInfo = true;
        }

        if (window.location.host === constants.env_url.prod || window.location.host === constants.env_url.stag) {
          key = constants.braintree.key.prod
        }

        LIB.get('brainTree').then(function() {
          var braintree = Braintree.create(key);
          braintree.onSubmitEncryptForm('billing-info-form', billingInfoForm);
        })

        scope.updateCard = function() {
          scope.billingInfo = {};
          scope.hasBillingInfo = false;
        }

        function billingInfoForm(e) {
          e.preventDefault();
          btnSaveCard.button('loading');
          $.post(form.attr('action'), form.serialize(), function(data) {
            var account = appCacheService.get('currentAccount')[0];
            account.has_billing_info = true;
            appCacheService.set('currentAccount', [account]);

            Utils.sa(scope, function() {
              if (scope.isModal)
                scope.billingInfo.callback.ok(scope.billingInfo.plan);

              scope.hasBillingInfo = true;
            })

            Alert.notify({
              title: 'Success',
              content: data.notice,
              type: 'success'
            });
          }).fail(function(xhr) {
            console.log("Billing info: ", xhr);
            if (scope.isModal)
              scope.billingInfo.callback.cancel();

            var error = JSON.parse(xhr.responseText);
            Alert.notify({
              title: error.error_message,
              content: Utils.parseError(error),
              type: 'error'
            });
          }).always(function() {
            btnSaveCard.button('reset');
          });
        }

        function getYearsArray() {
          var currentYear = new Date().getFullYear();
          var yearsArray = [];
          for (var i = 0; i < 12; i++) {
            yearsArray.push(currentYear++);
          }
          return yearsArray;
        }

        function getBrainTree() {
          if (serverConfig.onPremise || LIB.has('brainTree')) {
            scope.brainTreeLoaded = true;
            return;
          }

          $.getScript('https://js.braintreegateway.com/v1/braintree.js')
            .done(function(script, textStatus) {
              console.log("Script", script);
              LIB.register('brainTree');
              Utils.sa(scope, function() {
                scope.brainTreeLoaded = true;
              });
              console.log("Go for BrainTree!")
            }).fail(function(jqxhr, settings, exception) {
              Utils.sa(scope, function() {
                scope.brainTreeLoaded = false;
              });
              console.log("No go for BrainTree!")
            });
        }
        getBrainTree();
      }
    }
  }
]