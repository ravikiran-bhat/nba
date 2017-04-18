'use strict';
var metricsWidget = require('./partials/metrics-widget.html')

module.exports = [
  'alertService',
  'utilsService',
  'libraryService',
  'constants',
  '$injector',
  '$timeout',
  function(Alert, Utils, LIB, constants, $injector, $timeout) {
    return {
      template: metricsWidget,
      restrict: 'A',
      replace: true,
      scope: {
        apiMetrics: "="
      },
      link: function(scope, elem, attrs) {
        var lineChartData = _.cloneDeep(constants.charts.defaults.line);
        scope.metricsLoader = true;
        scope.modGraphData = [];

        // Customize Chart
        lineChartData.chart.height = 100;
        lineChartData.yAxis.endOnTick = false;
        lineChartData.yAxis.maxPadding = 0.7;
        lineChartData.xAxis.title.text = "";
        lineChartData.yAxis.title.text = "";
        lineChartData.xAxis.labels.enabled = false;
        lineChartData.yAxis.labels.enabled = false;
        lineChartData.tooltip = {
          positioner: function() {
            return {
              x: 0,
              y: -10
            };
          },
          shadow: false,
          borderWidth: 0,
          hideDelay: 0,
          backgroundColor: 'transparent'
        };

        function loadApiMetrics() {
          scope.$watch('apiMetrics', function(newValue, oldValue) {
            if (scope.apiMetrics) {
              scope.metricsLoader = false;
              $timeout(function() {
                showGraph();
              }, 10);
            }
          })
        }
        
        loadApiMetrics();

        // Bifercate my apps and shared apps
        scope.humanizeNumber = function(v) {
          return Utils.humanizeNumber(v);
        }

        scope.getSize = function(mb) {
          if (mb == 0)
            return mb
          return Utils.bytesToSize(mb * 1024 * 1024);
        }


        function prepareGraphData() {
          var rawGraphData = $.extend(true, {}, scope.apiMetrics);
          var metrics = rawGraphData["range"]["stats"];
          scope.modGraphData.length = 0;

          for (var key in metrics) {
            var series = [];
            var stat = metrics[key];

            for (var date in stat) {
              series.push([new Date(date).getTime(), stat[date]])
            }

            scope.modGraphData.push({
              'name': key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '), // transform to uppercase and remove underscore.
              'data': series,
              'el': $("." + key + '-graph')
            });
          }
          scope.modGraphData.sort(function(a, b) {
            return a.name > b.name;
          })
        }

        function renderGraphs() {
          for (var i = 0; i < scope.modGraphData.length; i++) {
            var hcOptions = $.extend(true, {}, lineChartData);
            hcOptions.colors = [constants.charts.colorPalette[i]];
            hcOptions.series = [scope.modGraphData[i]];
            hcOptions.legend = {
              enabled: false
            }
            $injector.invoke(['chartService',
              function(hc) {
                hc.drawChart({
                  el: scope.modGraphData[i].el,
                  options: hcOptions
                })
              }
            ]);
          };
        }

        function showGraph() {
          LIB.get('charts').then(function() {
            prepareGraphData();
            renderGraphs();
          });
        }



        $(elem).find('.w-graph').hover(
          function() {
            $(this).parent().find('.w-stat').addClass('v-hidden');
          },
          function() {
            $(this).parent().find('.w-stat').removeClass('v-hidden');
          }
        );
      }
    }
  }
]