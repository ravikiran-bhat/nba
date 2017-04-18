'use strict';
module.exports = [
  'utilsService',
  function(Utils) {
    var self = this;

    this.getCell = function(gridItem, column) {
      var columnData = Utils.getPath(gridItem, column.key);      
      return isDate(column.key) ? formatDate(columnData) : columnData;
    }

    this.addResponsiveAttrs = function(columns, attrs) {
      _.map(columns, function(column) {
        column['dataHide'] = attrs;
      });
      columns[0]['dataHide']   = '';
      columns[0]['dataToggle'] = true;
    }
    this.initFootable = function(el,size) {
      var windowWidth = $(window).width();
        el.footable({
          calculateWidthOverride: function() {
           return {width: $(window).width()}; 
          },
          breakpoints: {
            tablet:size
          }
        });
        setTimeout(function() {
          el.trigger('footable_redraw');
        }, 1000);
      if(windowWidth > 1300) {
        /*Hot fix to fix the initialization of footable over 1300pxs viewport*/
        window.footable.options.breakpoints = {};
      }
    }
    this.checkFilter = function(filterBy, previousFilter, currentPage, skip){
      // HOT fix as filter by is null at the first time. We set it to undefined.
      if (_.isEmpty(filterBy))
        filterBy = undefined;

      // HOT FIX to reset current page to 1 and skip to 0 when filterBy changes.
      // Also trNgGrid triggers this function when mycurrentPage is changed.
      // So we just change my current page and return. After that, this function is called again.
      // This time the filterBy and the previous filter are equal so the below condition is skipped and 
      // the function works normally.
      if (filterBy != previousFilter) {
        previousFilter = filterBy;
        if (currentPage != 0) {
          skip = 0;
          currentPage = 0;
          return true;
        }
      }
    }

    this.selectRow = function(gridItem, selectedRows) {
      selectedRows.indexOf(gridItem)>=0 ? selectedRows.splice(selectedRows.indexOf(gridItem), 1)  : selectedRows.push(gridItem)
    }

    this.selectAllRows = function(selectedRows, listRows) {
      if(selectedRows.length!==listRows.length){
        selectedRows.splice(0, selectedRows.length)
        selectedRows.push.apply(selectedRows, listRows)
      }else{
        selectedRows.splice(0, selectedRows.length)
      }
    }

    this.resetRows = function(areAllSelected, selectedRows){
      areAllSelected      = false;
      selectedRows.length = 0;
    }

    function formatDate(date) {
      // return moment(new Date(date)).format('ddd MMM Do, YYYY, h:mm:ss a');
      return moment(new Date(date)).calendar(null, {
        sameElse: 'MMM Do YYYY, h:mm:ss a'
      });
    }

    function isDate(key) {
      var dateKeys = ['created_at', 'updated_at', 'timestamp']; // add your date field keys here.
      return dateKeys.indexOf(key) >= 0;
    }
  }
]