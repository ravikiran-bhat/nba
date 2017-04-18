'use strict';
module.exports = [
  '$q',
  'fbBuiltDataService',
  'constants',
  function($q, builtApi, constants) {
    var referenceCache = [];

    var construct = this.construct = function(uid, title) {
      console.log('in construct of ref obj',uid)
      return {
        id: uid,
        text: title
      }
    }

    var setCache = this.setCache = function(data){
      referenceCache.push(data);
      return;
    }

    this.getCache = function(){
      return _.flattenDeep(referenceCache);
    }

    function buildQuery(uids, title) {
      var uid = {
        query: JSON.stringify({
          uid: {
            '$in': uids
          }
        })
          //include_unpublished : true
      }

      var titleSearch = {};
      titleSearch[title] = {
        '$regex': uids,
        '$options': 'i'
      };

      var type = {
        query: JSON.stringify({
          '$or': [{
              uid: {
                '$regex': uids,
                '$options': 'i'
              }
            },
            titleSearch
          ]
        })
        //include_unpublished : true
      };

      // type["only"] = JSON.stringify({
      //       "BASE": [title, 'uid']
      //     });

      return angular.isArray(uids) ? uid : type
    }

    this.get = function(apiKey, classUid, queryOptions, cls) {
      console.log('in get of ref obj',apiKey)
      var query = queryOptions.term;
      
      var title = ((cls.options && cls.options.title) || 'uid');

      var params = {};

      // If no title is set for the class, we do not make a call. Instead, we return the same uids
      // again which came from query in the form of select2 data by wrapping it into a promise.
      // i.e. {id: uid, title: uid}
      if (_.isArray(query) && title == 'uid') {
        return $q.when({
          objects : query.map(function(q) {
          return construct(q, q);
        })
        });
      }

      params = {
        options: {
          classUid: classUid,
          query: buildQuery(query, title)
        }
      }

      console.log("queryOptions.page", params);
      if(queryOptions.page){
        params.options.query.limit = constants.queryLimit;
        params.options.query.skip = 0;
        if(queryOptions.page > 1){
          params.options.query.skip = queryOptions.page * constants.queryLimit;
        }
        params.options.query.include_count = true;
      }

      //Using base notation
      params.options.query.only = {
        "BASE": [title]
      };
      var promise = builtApi.Objects.postGetAll({
        options : params.options,
        body    : params.options.query
      })
      .then(function(objs) {
        var objectList = objs.objects.map(function(obj) {
          return construct(obj.uid, obj[title] || obj.uid);
        });
        setCache(objectList);
        objs.objects = objectList;
        return objs;
      })

      // Returning promise to wrap
      return $q.when(promise)
    }


  }
]