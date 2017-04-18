/*
  CAN service:
  - This service calculates user accessibility on modules like classes, collaborators and system roles.
  - Accessibilities consist of create, edit, update, delete, invite, show.
  - CAN service needs to be initialized every time the current application changes.
  
  - User permissions are set in this service after the permissions call is made.

*/

module.exports = [
  'appCacheService',
  function(appCacheService) {
    
    var self               = this;
    
    /*
      Setting default class rights true.
    */
    var DEF_CLASS_RIGHTS   = {read: true, update: true, delete: true};
    
    /*
      Initialize all the variables required for storing system ACL related
      data for the active application.
    */
    var userRoles               = [];
    var currentApp              = null;
    var currentUser             = null;
    var currentAccount          = null;
    var permissions             = {};
    var isDevManager            = false;
    var isContentManager        = false;
    var isOwner                 = false;
    var isDevManagerInSysRoles  = false;
    var isLatestApp             = {};
    var hasDefaultSysRoles      = true;
    /*
      Initially exposing init function
    */
    this.init              = init;

    /*
      Initializes CAN service with required data.
    */
    function init(roles) {
      _reset();

      currentUser             = appCacheService.get('currentUser');
      currentApp              = appCacheService.get('currentApp');
      //currentAccount          = appCacheService.get('currentAccount')[0];
      isLatestApp             = checkAppVersion(currentApp);
      userRoles               = findRoles(currentUser.roles, currentApp.api_key);
      isDevManager            = findDevManager(userRoles);
      isContentManager        = findContentManager(userRoles);
      isOwner                 = checkIfOwner(currentUser, currentApp);
      systemRolesStatus       = !!roles.length;
      isDevManagerInSysRoles  = findDevManager(roles);
      hasDefaultSysRoles      =  isOwner ? isDevManagerInSysRoles && findContentManager(roles) : true;
      _init(roles);
    }

    function checkAppVersion(currentApp){
      return currentApp.discrete_variables.version >= 2;
    }

    function detectSystemRoles(){
      // console.log("isDevManagerInSysRoles", isDevManagerInSysRoles);
      // console.log("isDevManager in user", isDevManager);
      // console.log("isLatestApp", isLatestApp);

      if(isOwner)
        return true;
      
      //for old apps
      if(isDevManagerInSysRoles){
        if(!isDevManager)
          return false;
        else
          return true;
      }

      //for new app
      if(isLatestApp)
        return false;

      return true;
    }



    /*
      Exposes CAN service methods.
    */
    function _init() {
      self.setPermissions         = setPermissions;
      self.needPermissions        = !isOwnerOrDevManager();
      self.isDevManager           = isDevManager;
      self.isContentManager       = isContentManager;
      self.isOwner                = isOwner;
      

      self.collaborators     = {
        invite : detectSystemRoles(),
        edit   : detectSystemRoles()
      };

      self.systemRoles       = {
        show  : detectSystemRoles(),
        defaults:{
          exist : hasDefaultSysRoles
        }
      }

      self.classes           = {
        create         : detectSystemRoles(),
        getPermissions : function(uid) {
          return getClassPermissions(uid);
        }
      }
    }

    function _reset() {
      userRoles          = [];
      currentApp         = null;
      currentUser        = null;
      currentAccount     = null;
      permissions        = {};
      isDevManager       = false;
      isContentManager   = false;
      isOwner            = false;
    }

    function setPermissions(obj) {
      permissions = obj[0];
    }


    function needPermissions() {
      if(isOwnerOrDevManager() || isContentManager) 
        return false;
       else 
        return true;
    }

    function findRoles(roles, apiKey) {
      return roles.filter(function(role) {
        return (role.application.api_key === apiKey)
      })
    }

    function findDevManager(roles) {
      return !_.isUndefined(_.find(roles, {name: "Dev manager"}));
    }

    function findContentManager(roles) {
      return !_.isUndefined(_.find(roles, {name: "Content manager"}));
    }

    function checkIfOwner(currentUser, currentApp) {
      return currentUser.uid === currentApp.owner_uid;
    }

    function isOwnerOrDevManager() {
      if(isOwner || isDevManager)
          return true;
        else
          return false;
      
    }

    /*
      Finds class permissions for the given class UID. If permissions are not found,
      returns default class permissions.
    */
    function getClassPermissions(uid) {
      if(isOwnerOrDevManager()){
        return DEF_CLASS_RIGHTS;
      }

      //console.log("permissions['classes']", permissions['classes']);
        
      return (permissions['classes'] && permissions['classes'][uid] || DEF_CLASS_RIGHTS)
    }

  }
]