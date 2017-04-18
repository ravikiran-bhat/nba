'use strict';

var selectRuleTmpl = require('../../partials/rules/select-rule.html');

module.exports = [
  '$compile',
  'oqService',
  'utilsService',
  function($compile, qbService, Utils) {
    return {
      replace: true,
      restrict: 'A',
      scope: {
        query: '=oqSelectRuleView'
      },
      link: function(scope, elem, attrs) {
        var $template = angular.element(selectRuleTmpl);
        $compile($template)(scope);
        elem.append($template);
        var defaultOperator = "equals"
        scope.operator = scope.query.fieldData.operator || '$' + defaultOperator;
        scope.operand = {};
        initiateOperatorSelectField()
        setOperandOnLoad();
        function initiateOperatorSelectField(){
          elem.find('.js-operator-select').val(scope.operator).select2({
            containerCssClass: 'select2-sm',
            minimumResultsForSearch: -1
          });

          elem.find('.js-operator-select').off('change').on('change', function() {
            changeOperator($(this).select2('val'));
          })
        }
        function changeOperator(operator){
          scope.$apply(function(){
            scope.operator = operator
          })
          if(operator === "$equals" || operator === "$ne"){
            initiateOperandSelectField()
          }
        }
        function checkOperator(){
          scope.query.fieldData.operator = scope.operator;
          switch (scope.operator) {
            case '$exists':
              scope.operand['exists'] = true;
              break;

            case '$notExists':
              scope.operand['exists'] = false;
              break;

            case '$ne':
              scope.operand['ne'] = '';
              break;

            case '$equals':
              scope.operand['equals'] = '';
              break;
          }
        }
        var getFieldSelectData = function(fieldData){
          return fieldData.currentField.field_metadata.__blt_data.__blt_select
        }

        scope.selectData = getFieldSelectData(scope.query.fieldData)
      
        function initiateOperandSelectField(){
          setTimeout(function(){
            elem.find('.js-operand-select').select2({
              containerCssClass: 'select2-sm',
              minimumResultsForSearch: -1,
              data: scope.selectData
            });
            //Default select2 value
            elem.find('.js-operand-select').off('change').on('change', function() {
              changeOperand(elem.find('.js-operand-select').select2('val'));
            })
            console.log("scope.operand",scope.operand)
            elem.find('.js-operand-select').select2('val', scope.operand[Object.keys(scope.operand)[0]]);
          },10)
        }
        
        function clearValues() {
          scope.operand = {};
          scope.query._value = {};
        }
        function changeOperand(operand) {
          Utils.sa(scope, function() {
            scope.operand = operand;
            checkOperand()

          });
        }
        function checkOperand() {
          switch (scope.operator) {
            case '$exists':
              scope.query._value['$exists'] = scope.operand['exists'];
              break;

            case '$notExists':
              scope.query._value['$exists'] = scope.operand['exists'];
              break;

            case '$ne':
              scope.query._value['$ne'] = scope.operand;
              break;

            case '$equals':
              scope.query._value = scope.operand;
              break;
          }
        }
        //Not need to set default operator as there is no operator for contains only set on load if value is not empty
        function setOperandOnLoad() {
          if (!_.isEmpty(scope.query._value)) {
            if (scope.query._value instanceof Object) {
              scope.operand[scope.operator.replace('$', '')] = scope.query._value[scope.operator];
            } else {
              scope.operand['equals'] = scope.query._value;
            }
          }
          initiateOperandSelectField()
        }
        scope.$watch('operand', function(newVal, oldVal) {
          if (_.isEqual(newVal, oldVal))
            return;

          if (_.isEmpty(scope.operand))
            return;
          //console.log("newVal", newVal);
          checkOperand();
          scope.query._diff = newVal;
        }, true)

        //New rule data for every operator on change
        scope.$watch('operator', function(newVal, oldVal) {
          if (_.isEqual(newVal, oldVal))
            return;

          clearValues();
          checkOperator();
        }, true);

      }
    }
  }
]