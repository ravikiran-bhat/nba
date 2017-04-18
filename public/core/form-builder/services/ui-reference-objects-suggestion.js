'use strict';
var traverse = require('traverse');
module.exports = [
  '$q',
  'fbBuiltDataService',
  function($q, builtApi) {
    
    var construct = this.construct = function(obj) {
      console.log('in construct of ui ref',obj)
      var select2InitialData = [];
      if (!_.isEmpty(obj)) {
        
        if(_.isArray(obj)){
          for (var i = 0; i < obj.length; i++) {
            if(obj[i])
              select2InitialData.push({
                id: obj[i],
                text: obj[i]
              })
          }     
        } else {
          select2InitialData.push({
            id: obj,
            text: obj
          })
        }
      }
      return select2InitialData;
    }

    function buildQuery(queryData, title, classFieldUid) {
      console.log('in buildQuery of ui ref',queryData)
      var titleSearch = {};

      titleSearch[title] = {
        '$regex': queryData,
        '$options': 'i'
      };

      var typeObject = {};
      typeObject[classFieldUid] = {
        '$regex': queryData,
        '$options': 'i'
      };

      return {
        query: JSON.stringify({
          '$or': [
            typeObject,
            titleSearch
          ]
        })
      };
    }


    this.get = function(apiKey, field, query, classes) {
      console.log('in get of ui ref',apiKey)
      var title;
      var deferred = $q.defer();
      var classUid = field.refer_class;
      var fieldUid = field.refer_class_field_uid;
      var refer_subtitle = field.refer_subtitle || "";
      var cls = classes.filter(function(Klass) {
        return Klass.uid === classUid
      })

      cls = cls[0];
      title = cls.options && cls.options.title || 'uid';

      var params = {
        options: {
          classUid: classUid,
          query: buildQuery(query, title, fieldUid)
        }
      };

      builtApi.Objects.getAll(params)
        .then(function(res) {
          var setRefObjectArray = [];
          var chkclassFieldArr = fieldUid.split('.');
          for (var i = 0; i < res.objects.length; i++) {
            var field = res.objects[i];

            //Check if referred class field uid is a path or value
            if (fieldUid.indexOf('.') === -1) {

              //if config-referer is value
              if (field[fieldUid]) {
                setRefObjectArray.push({
                  children: construct(field[fieldUid]),
                  text: constructSubtitle(field, refer_subtitle)
                });
              }
            } else {

              //if config-referer is path
              var referenceObjArray = {};
              var setStatus = true;
              var tempQueryDataArr = []
              var tempArray = traverse(field).map(function(x) {
                //Remove number indexes array
                var ourpath = this.path.filter(function(val) {
                  var chkVal = parseInt(val);
                  return isNaN(chkVal);
                });

                //check if referer field uid is equal to formated path array
                if (fieldUid === ourpath.join('.')) {
                  referenceObjArray['text'] = constructSubtitle(field, refer_subtitle);
                  if (!Array.isArray(x)) {
                    tempQueryDataArr.push(x);
                  }
                }
              });
              referenceObjArray['children'] = construct(tempQueryDataArr);
              //check if blank array is not inserted
              if (!_.isEmpty(referenceObjArray['children'])) {
                setRefObjectArray.push(referenceObjArray);
              }
            }
          }

          deferred.resolve(setRefObjectArray);
        }, function(err) {
          deferred.reject(err);
        })
      return deferred.promise;
    }

    function constructSubtitle(obj, refer_subtitle) {
      console.log('in constructSubtitle of ui ref',refer_subtitle)
      refer_subtitle = obj[refer_subtitle] || refer_subtitle; 
      var title = "";
      refer_subtitle = refer_subtitle || "";
      if (obj.title) {
        if (refer_subtitle)
          title = obj.title + "<br/>" + refer_subtitle;
        else
          title = obj.title
      } else {
        if (refer_subtitle)
          title = obj.uid + "<br/>" + '-&nbsp;'+refer_subtitle;
        else
          title = obj.uid
      }
      return title;
    }

  }
]