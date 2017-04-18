'use strict';
var select2      = require('third-party-modules/select2');
var uniqueSelect = require('../partials/unique-select.html');

module.exports = ['$compile',
  function($compile) {
    return {
      template: uniqueSelect,
      restrict: 'A',
      scope: {
        originaluniquefield: '=originaluniquefield',
        dataitem: '=dataitem',
        action: '=action',
        clssdata: '=clssdata',
        isEdit: '=isEdit',
        clss:'=clss',
        parentUid:'=parentUid',
        isGroupMultiple : '=isGroupMultiple'        
      },
      link: function(scope, elem, attrs) {
        var classSchema = typeof scope.clssdata === 'object' ? scope.clssdata.schema : scope.clssdata;
        var clssSchema  = scope.clss.schema.map(function(objs) {
          return objs;
        })
        var resultArray = [];
        var parentPath  = "";
        var owner       = {
          system:"app_user_object_uid"
        }

        resultArray.push({id:owner.system,text:'Owner'})
        function findThePath(allObjects, resultArray, parentPath) {
          allObjects.forEach(function(field) {
            if(!field)
              return

            if(field.multiple)
              return

            var calculatedPath = field.uid
            var currentPath    = scope.dataitem.uid

            if(scope.parentUid)
              currentPath = scope.parentUid + "." + currentPath

            if(parentPath)
              calculatedPath = parentPath + "." +calculatedPath

            if(calculatedPath == currentPath)
              return

            if(field.data_type === "group"){
              return findThePath(field.schema || [], resultArray, calculatedPath);
            }
            
            resultArray.push({ id: calculatedPath, text: calculatedPath });
          });
        }

        findThePath(clssSchema, resultArray, parentPath);

        var extractedData = resultArray.map(function(obj) {
          return obj
        })

        //Initializing Select2
          elem.select2({
            placeholder: "Unique values",
            data: extractedData,
            tags: true,
            tokenSeparators: [",", " "]
          });

        //includes only object's uniqueField if present
        if (scope.action !== "add" && scope.originaluniquefield !== null && scope.originaluniquefield !== undefined) {
          if(scope.isGroupMultiple)
           elem.select2('disable',true)
        }

        //On Load of modal set Unique field Value
        if (scope.dataitem.unique) {
          elem.select2('val', scope.dataitem.uniquePath);
        } else {
          elem.select2('val', null);
        }

        //changing value on change event
        elem.on('change', function(e) {
          scope.dataitem.uniquePath = e.val
          scope.dataitem.uniquePath = e.val == "" ? [] : e.val;
        });
      }
    }
  }
]
