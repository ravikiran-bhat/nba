'use strict';
var daterangepickerTemplate = require('../partials/bootstrap-daterangepicker.html');

require('third-party-modules/bootstrap-daterangepicker');
module.exports = function() {
	return {
		restrict: 'A',
		replace: true,
		scope: {
			drpOptions: '=',
			dateRange: '=',
			onDateRangeChange: '='
		},
		template: daterangepickerTemplate,
		link: function(scope, elem, attrs) {
			var defaultDate = new Date('01/01/2012')
			var startDate   = "";
			var endDate     = "";

			var defaultOptions = {
				startDate: moment(scope.dateRange.startDate).format('MMM D, YYYY'),
				endDate: moment(scope.dateRange.endDate).format('MMM D, YYYY'),
				minDate: moment(defaultDate.toISOString()).format('MMM D, YYYY'),
				maxDate: moment(),
				dateLimit: false,
				showDropdowns: true,
				showWeekNumbers: true,
				timePicker: false,
				timePickerIncrement: 1,
				timePicker12Hour: true,
				ranges: {
					'Today': [moment(), moment()],
					'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
					'Last 7 Days': [moment().subtract(6, 'days'), moment()],
					'Last 30 Days': [moment().subtract(29, 'days'), moment()],
					'This Month': [moment().startOf('month'), moment().endOf('month')],
					'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
				},
				opens: 'left',
				buttonClasses: ['btn btn-default'],
				applyClass: 'btn-small btn-primary',
				cancelClass: 'btn-small',
				format: 'MMM D, YYYY',
				separator: ' to ',
				locale: {
					applyLabel: 'Submit',
					cancelLabel: 'Clear',
					fromLabel: 'From',
					toLabel: 'To',
					customRangeLabel: 'Custom',
					daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
					monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
					firstDay: 1
				}
			};

			var opts = _.extend({}, defaultOptions, scope.dateRange['options'] || {});

			$('#reportrange span').html(moment(scope.dateRange.startDate).format('MMM D, YYYY') + ' - ' + moment(scope.dateRange.endDate).format('MMM D, YYYY'));

			$('#reportrange').daterangepicker(opts, function(start, end, label) {
				elem.find('span').html(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
				scope.dateRange.startDate = start.format('YYYY-MM-DD');
				scope.dateRange.endDate   = end.format('YYYY-MM-DD');
				scope.onDateRangeChange();
			});
		}
	}
}