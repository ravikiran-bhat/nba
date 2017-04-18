'use strict';

module.exports = [
  'constants',
  'utilsService',
  'builtApi',
  function(constants, Utils,builtApi) {
    var knowledgeBase = {};

    this.clearKB = function() {
      knowledgeBase = {};
    },

    this.addField = function(fldUid,uniquePath) {
      if(fldUid.indexOf('.') > 0) {
       var newFldUid = fldUid.split(".");
       return this.createGroup(knowledgeBase,newFldUid,uniquePath)
      }
      knowledgeBase[fldUid] = uniquePath;
    },
    this.createGroup = function(knowledgeBase,fldUid,uniquePath) {
      if(fldUid.length > 1) {
        var newFldUid            = fldUid.shift();
        knowledgeBase[newFldUid] = knowledgeBase[newFldUid] || {};
        return this.createGroup(knowledgeBase[newFldUid],fldUid,uniquePath)
      }
      else {
        var newFldUid            = fldUid.shift();
        knowledgeBase[newFldUid] = uniquePath;
        return knowledgeBase;
      }
    },
    this.deleteField = function(uid) {
      if(uid.indexOf('.') > 0) {
       var newFldUid = uid.split(".");
       return this.deleteClassFields(knowledgeBase,newFldUid)
      }
      delete knowledgeBase[uid];
    },
    this.deleteClassFields = function(knowledgeBase,fldUid) {
      if(fldUid.length > 1) {
        var newFldUid = fldUid.shift();
        if(_.isPlainObject(knowledgeBase[newFldUid]))
          return this.deleteClassFields(knowledgeBase[newFldUid],fldUid)
        else
          delete knowledgeBase[newFldUid]
      }
      else {
        var newFldUid = fldUid.shift();
        delete knowledgeBase[newFldUid]
        return knowledgeBase;
      }
    },
    this.searchUniquePath =function(knowledgeBase,fUid,parentPath, inUniquePath) {
      for(var key in knowledgeBase){
        var calculatedPath = key
        if(parentPath)
          calculatedPath = parentPath + '.' + calculatedPath
        if(_.isArray(knowledgeBase[key])){
          if(_.includes(knowledgeBase[key],fUid)) {
            inUniquePath.push(calculatedPath)
          }
          else{
            var regex = new RegExp("^" + fUid + ".")
            var arr   = knowledgeBase[key]
            for(var i = 0; i < arr.length; i++){
              if(arr[i].match(regex)){
                inUniquePath.push(calculatedPath);
                break;
              }
            }
          }
        }
        else if(_.isPlainObject(knowledgeBase[key])) {
          inUniquePath.concat(this.searchUniquePath(knowledgeBase[key], fUid, calculatedPath, inUniquePath))
        }
      }
    },
    this.searchField = function(fldUid) {
      var inUniquePath = [];
      this.searchUniquePath(knowledgeBase,fldUid,'', inUniquePath);
      return inUniquePath;
    }
  }
]