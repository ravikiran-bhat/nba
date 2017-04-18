'use strict';
var formFieldIsodateTemplate = require('../../partials/form-field-isodate.html');

module.exports = [
  '$cacheFactory',
  '$timeout',
  function($cacheFactory, $timeout) {
    // var dateCache = $cacheFactory('dateCache');
    return {
      template: formFieldIsodateTemplate,
      restrict: 'A',
      replace: true,
      scope: {
        field : '=field',
        obj   : '=obj',
        ctx   : '=ctx',
        prop  : '=prop'
      },
      link: function(scope, elem, attrs) {
        var datePicker          = elem.find(".date-picker");
        var timePicker          = elem.find(".time-picker");
        var timeZoneSelector    = elem.find(".timeZoneSelector");
        scope.timeZone          = getTimeZones()
        scope.dateValue         = scope.ctx[scope.prop] ? scope.ctx[scope.prop] : ""

        scope.faked = {
          date : "",
          time : "",
          zone : ""
        };

        var timeZoneExists = isTimeZonePresent(scope.dateValue)
        var timeExists     = isTimePresent(scope.dateValue)
        scope.datetime     = scope.dateValue.substring(0, setDateIndex(scope.dateValue))
        scope.faked.date   = getMomentDateTime(scope.datetime, "MMM Do YYYY")
        scope.faked.time   = timeExists ? getMomentDateTime(scope.datetime, "h:mm:ss a") : ""
        
        scope.faked.zone = scope.zone
        
        var defaultDate  = scope.datetime || "";

        function isTimeZonePresent(isodate){
          var re = /z|Z/ ;
          scope.zone             = setDateIndex(isodate) ? isodate.substring(setDateIndex(isodate), isodate.length).replace(':', '') : undefined
          scope.isDiffZoneFormat = re.test(scope.zone) ? true : false;
          scope.extendedTime     = scope.isDiffZoneFormat ? scope.zone : ""
          scope.zone             = !scope.isDiffZoneFormat ?  scope.zone : ""
          return !!scope.zone
        }
        
        function isTimePresent(isodate){
          var timeExists = isodate.indexOf('T') < 0 ? false : true
          return timeExists
        }

        function getMomentDateTime(date, format) {
          var datetime = moment(date).format(format);
          datetime = datetime === "Invalid date" ? "" : datetime;
          return datetime;
        }

        var datePickerOptions = {
            widgetParent : $("#js-isodatepicker-wrap"),
            defaultDate : defaultDate,
            format:'MMM Do YYYY',
            icons: {
              time: "fa fa-clock-o",
              date: "fa fa-calendar",
              up: "fa fa-arrow-up",
              down: "fa fa-arrow-down",
              previous: "fa fa-chevron-left",
              next: "fa fa-chevron-right"
            },
            widgetPositioning:{
              horizontal: 'auto',
              vertical: 'bottom'
            }
        };
        var timePickerOptions = {
          widgetParent : $("#js-isodatepicker-wrap"),
          defaultDate : defaultDate,
          format:'h:mm:ss a',
          icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down",
            previous: "fa fa-chevron-left",
            next: "fa fa-chevron-right"
          },
          widgetPositioning:{
            horizontal: 'auto',
            vertical: 'bottom'
          }
        };
        
        function initiateDatePicker(){
          setTimeout(function(){
            try{
              datePicker.datetimepicker(datePickerOptions);
              datePicker.on("dp.change", function(e) {
                scope.faked.date = getMomentDateTime(e.date, "MMM Do YYYY")
                checkSelectedDateTime(e)
              });
            }catch(e){
              delete datePickerOptions.defaultDate;
              datePicker
              .datetimepicker(datePickerOptions)
              // Date picker event on date change 
              .on("dp.change", function(e) {
                checkSelectedDateTime(e);
              });
            }
          },10)
        }

        function initiateTimePicker(){
          setTimeout(function() {
            try{
              timePicker.datetimepicker(timePickerOptions);
              timePicker.on("dp.change", function(e) {
                scope.faked.time = getMomentDateTime(e.date, "h:mm:ss a")
                checkSelectedDateTime(e)
              });
            }catch(e){
              delete timePickerOptions.defaultDate;
              timePicker
              .datetimepicker(timePickerOptions)
              // Time picker event on date change 
              .on("dp.change", function(e) {
                checkSelectedDateTime(e);
              });
            }
          },10)
        }
    
        // Time picker Initialization
        initiateDatePicker()
        // Date picker Initialization
        initiateTimePicker()
        // Zone Selector Initialization
        scope.$watch('faked.zone', function(newVal, oldVal) {
          if(newVal !== oldVal){
            scope.faked.zone = newVal === null ? "" : newVal 
            setScope()
          }
        })

        scope.onDateTimePickerBlur = function(e) {
          checkSelectedDateTime(e);
        }

        scope.onDPKeyup = function(e){
          /*if (isSelectedDateEmpty(e))
            scope.ctx[scope.prop] = null;*/
            setScope()
        };

        function isSelectedDateEmpty(e) {
          return _.isEmpty($(e.currentTarget).val());
        }

        function isInvalidDate(date){
          if(date === "Invalid date") {
            return moment().format('MMM Do YYYY');
          }
          return date;
        }

        function isInvalidZone(zone){
          if(new Date(zone)== 'Invalid Date')
            return getlocalTimeZone(); 

          return zone;
        }

        function checkSelectedDateTime(e) {
         /* console.log("checkSelectedDateTime",isSelectedDateEmpty(e), e)
          if (isSelectedDateEmpty(e))
            scope.ctx[scope.prop] = null;
          else*/
            setScope();
        }

        function setScope() {
          var setDate = datePicker.val().trim() ? getMomentDateTime(datePicker.data("DateTimePicker").date(), "YYYY-MM-DD") : "";
          var setTime = timePicker.val().trim() ? getMomentDateTime(timePicker.data("DateTimePicker").date(), "THH:mm:ss") : "";
          var zone = scope.faked.zone;
          var date = setDate + setTime
          date = !zone && scope.extendedTime ? date + scope.extendedTime : zone ? date + zone : date + ""
          scope.ctx[scope.prop] = date; 
        }

        function getDateIndex(isoDate) {
          if (isoDate.lastIndexOf('.') !== -1)
            return isoDate.lastIndexOf('.');
          else if (isoDate.lastIndexOf('+') !== -1)
            return isoDate.lastIndexOf('+');
          else if (isoDate.lastIndexOf('-') !== -1)
            return isoDate.lastIndexOf('-');
        }

        function setDateIndex(isoDate){
          var dateIndex = getDateIndex(isoDate);
          if(dateIndex > 15)
            return dateIndex;
          else
            isoDate.length;
        }

        function getlocalTimeZone() {
          var date = moment().format();
          return date.substring(setDateIndex(date), date.length).split(':').join('');
        }

        function getTimeZones() {

          return [
            '-1200', '-1100',
            '-1000', '-0930',
            '-0900', '-0800',
            '-0700', '-0600',
            '-0500', '-0430',
            '-0400', '-0330',
            '-0300', '-0200',
            '-0100', '+0000',
            '+0100', '+0200',
            '+0300', '+0330',
            '+0400', '+0430',
            '+0500', '+0530',
            '+0545', '+0600',
            '+0630', '+0700',
            '+0800', '+0845',
            '+0900', '+0930',
            '+1000', '+1030',
            '+1100', '+1130',
            '+1200', '+1245',
            '+1300', '+1400'
          ];
        }
        scope.$watch('ctx[prop]', function(newVal, oldVal){
          //if time is not defined set zone to blank
          if(newVal !== oldVal && scope.ctx[scope.prop] && scope.ctx[scope.prop].indexOf("T") === -1){
            scope.faked.zone = ""
            setScope();
          }
          console.log("ctx[prop]", scope.ctx[scope.prop])
        })

      }
    }
  }
]