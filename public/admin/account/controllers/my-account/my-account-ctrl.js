'use strict';
module.exports = [
  '$scope',
  '$state',
  'utilsService',
  '$interpolate',
  '$sce',
  'currentUser',
  'plans',
  function($scope, $state, utilsService, $interpolate, $sce, currentUser, plans) {

    //Render HTML Code
    $scope.renderHtml = function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };
    var plan               = plans.filter(function(plan){
      if(plan.plan_id === currentUser.plan_id){
        return plan
      }
    })[0];
    var messageFromPlan    = plan.message || 'No message';
    var planDefaultMessage = '';
    var accountInTrial     = plan.plan_type === 'trial';
    var accountInFreePlan  = plan.plan_type === 'plan' && (plan.plan_id === 'zero_dollar');
    var expiration         = '';

    $scope.showplanInfoMsg = accountInTrial || accountInFreePlan;
    
    if($scope.showplanInfoMsg){
      //If account in free plan
      if(accountInFreePlan){
        expiration = moment(currentUser.created_at).add(90, 'days');
      } else if(accountInTrial){
        expiration = moment(currentUser.created_at).add(plan.duration_in_days, 'days');
      }
    }

    //Interpolation
    var interpolateMessageFunc = $interpolate(messageFromPlan);

    //Check and interpolate `expiration`
    if(expiration){
      var interpolateMessage = interpolateMessageFunc({expiration:expiration.format('Do MMM YYYY')});
    }
    
    //Show plan message to display
    $scope.planMessage = interpolateMessage || messageFromPlan;

    //Extract email from planMessage
    var emails = $scope.planMessage.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+[a-z]/gmi);

    //Create array of object with email and HTML String
    if(emails){
      var emailsWithHTML = emails.map(function(email){
        return {email:email, htmlString:'<a href="mailto:'+email+'">'+email+'</a>'}
      }).forEach(function(emailObject){
        $scope.planMessage = $scope.planMessage.replace(emailObject.email, emailObject.htmlString);
      });
    }

    //plan.message is empty show planDefaultMessage
    if(_.isEmpty(messageFromPlan)){
      $scope.planDefaultMessage = planDefaultMessage;
    }

    $scope.planDefaultMessage = planDefaultMessage || $scope.planMessage;
  }
]