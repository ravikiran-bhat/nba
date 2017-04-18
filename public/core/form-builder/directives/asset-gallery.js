'use strict';
var assetGalleryTemplate = require('../partials/asset-gallery.html');

module.exports = [
  '$q',
  'fbBuiltDataService',
  'modalService',
  'utilsService',
  'appCacheService',
  function($q, builtApi, modalService, Utils, appCacheService) {
    return {
      template: assetGalleryTemplate,
      restrict: 'A',
      replace: true,
      link: function(scope, elem, attrs) {
        var perPage = 50;
        var cacheKeyPrefix = 'assetGallery:';
        scope.activeFilter = 'all';
        scope.isRefreshing = false;
        scope.assets = {
          all: {
            total: 0,
            data: []
          },
          images: {
            total: 0,
            data: []
          },
          videos: {
            total: 0,
            data: []
          }
        }

        scope.getMoreAssets = function(filter, e) {
          var button = $(e.currentTarget);
          var cacheData = appCacheService.get(cacheKeyPrefix + filter);

          button.button('loading');
          getAssetData(getAssetParams(cacheData.pageNo + 1, filter))
            .then(function(res) {
              cacheData.pageNo += 1;
              for (var i = 0; i < res.uploads.length; i++) {
                cacheData.assets.push(res.uploads[i]);
              }
              cacheData.total = res.total;
              scope.assets[filter]['total'] = cacheData.total;
            }, function(xhr) {
              console.log('xhr', xhr);

            })
            .finally(function() {
              button.button('reset');
            });
        }

        scope.getAssets = function(filter) {
          scope.activeFilter = filter;
          var cache = appCacheService.get(cacheKeyPrefix + filter);
          var tabPane = $('#ag-' + filter);
          tabPane.addClass('loading');
          if (cache) {
            var cacheData = cache;
            scope.assets[filter]['data'] = cacheData.assets;
            scope.assets[filter]['total'] = cacheData.total;
            tabPane.removeClass('loading');
          } else {
            var cacheData = {
              pageNo: 1,
              skip: 0,
              limit: perPage,
              assets: []
            }
            getAssetData(getAssetParams(1, filter))
              .then(function(res) {
                cacheData.assets = res.uploads;
                cacheData.total = res.total;
                appCacheService.set(cacheKeyPrefix + filter, cacheData);
                scope.assets[filter]['total'] = cacheData.total;
                scope.assets[filter]['data'] = cacheData.assets;
              }, function(xhr) {
                console.log(xhr);
              })
              .finally(function() {
                tabPane.removeClass('loading');
                scope.isRefreshing = false;
              })
          }
        }

        scope.burstGalleryCache = function() {
          scope.isRefreshing = true;
          for (var key in scope.assets) {
            appCacheService.remove(cacheKeyPrefix + key);
            scope.assets[key]['total'] = 0;
            scope.assets[key]['data'].length = 0;
          }
          scope.getAssets(scope.activeFilter);
        }

        function addAuthTokenAndApikey(url) {
          return url += '?AUTHTOKEN=' + scope.data.authtoken + "&application_api_key=" + scope.data.apikey +"&timestamp="+Math.round(+new Date()/1000);
        }

        function getAssetParams(pageNo, filter) {
          return {
            options: {
              uploadType: filter === 'all' ? '' : filter,
              query: {
                skip: (pageNo - 1) * perPage,
                limit: perPage,
                include_count: true
              }
            }
          }
        }

        function getAssetData(params) {
          var deferred = $q.defer();
          builtApi.File.getUpload(params)
            .then(function(res) {
              var uploads = [];
              console.log("resres", res);
              for (var i = 0; i < res.uploads.length; i++) {
                uploads.push({
                  url: addAuthTokenAndApikey(res.uploads[i].url),
                  isImage: Utils.isImage(res.uploads[i].filename),
                  file_size: Utils.bytesToSize(res.uploads[i].file_size),
                  filename: res.uploads[i].filename,
                  uid: res.uploads[i].uid
                });
              }

              deferred.resolve({
                uploads: uploads,
                total: res.count
              });
            }, function(xhr) {
              deferred.reject(xhr);
            })
          return deferred.promise;
        }

        scope.getAssets('all');
      }
    }
  }
]