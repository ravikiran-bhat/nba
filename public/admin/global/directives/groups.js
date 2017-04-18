'use strict';
var groupsTemplate = require('./partials/groups.html')

module.exports = [
  'utilsService',
  'alertService',
  '$timeout',
  'tip',
  function(Utils, Alert, $timeout, TIP) {
    return {
      template: groupsTemplate,
      restrict: 'A',
      replace: true,
      scope: {
        onSelectGroup: '=',
        onSaveGroup: "=",
        onDeleteGroup: "=",
        onUpdateGroup: "=",
        groups: "="
      },
      link: function(scope, elem, attrs) {        
        scope.showGroupTag = true;
        scope.inputgroup = "";
        scope.selectedGroup = null;
        scope.loading = false;
        var tipOptions     = {
          content: {
            text: function(api) {
              return 'Please enter name';
            },
          },
          hide: {
            event: 'click'
          },
          events: {
            hide: function(event, api) {
              $(this).qtip("destroy");
            }
          },
          position: {
            adjust: {
              x: -1
            }
          },
          style: {
            classes: "qtip-red"
          }
        };

        // Show group input
        scope.showGroupInput = function() {
          scope.showGroupTag = false;
          $timeout(function() {
            $(elem).find('.js-group-input').focus();
          },0);
        }

        scope.checkKey = function(e){
          if(e.keyCode === 13)
            scope.saveGroup();
        }

        //hide group input
        scope.hideGroupInput = function() {
          TIP.destroy($('.js-group-input'))
          scope.showGroupTag = true;
          scope.inputgroup = "";
        }

        scope.selectGroup = function(group) {
          //update old group structure to latest structure
          if(group.query && group.query.event_uid){
            updateGroupAndSelect(group);
            return
          }
          scope.onSelectGroup(group);
          scope.selectedGroup = group;
        }

        //Update Groups
        var updateGroupAndSelect = function(group){
          scope.onUpdateGroup(group, function(groupData){
            if(groupData){
              scope.onSelectGroup(groupData.segment);
              scope.selectedGroup = groupData.segment;
              //replacce the old group with the new one
              scope.groups.map(function(group, i){
                if(groupData.segment.uid === group.uid){
                  scope.groups[i] = groupData.segment;
                }
              })
            }
          })
        }

        //Save Groups
        scope.saveGroup = function() {
          if(!scope.inputgroup){
            TIP.show($('.js-group-input'), tipOptions);
            return
          }
          if(scope.loading)
            return;
          scope.loading = true;
          scope.onSaveGroup(scope.inputgroup, function(groupData) {
            scope.groups.push(groupData);
            scope.hideGroupInput();
            scope.loading = false;
          });
        }

        //Update Groups
        var updateGroupAndSelect = function(group){
          scope.onUpdateGroup(group, function(groupData){
            if(groupData){
              scope.onSelectGroup(groupData.segment);
              scope.selectedGroup = groupData.segment;
              //replacce the old group with the new one
              scope.groups.map(function(group, i){
                if(groupData.segment.uid === group.uid){
                  scope.groups[i] = groupData.segment;
                }
              })
            }
          })
        }

        //Remove a Group
        scope.removeGroup = function(group) {
          Alert.confirm({
            title: 'Delete Group',
            content: 'Are you sure you want to delete this group?'
          }).then(function() {
            if(scope.selectedGroup){
              if(scope.selectedGroup.uid === group.uid){
                scope.selectedGroup = null;
              }
            }

            scope.onDeleteGroup(group, $.noop);
          })
        }
      }
    }
  }
]