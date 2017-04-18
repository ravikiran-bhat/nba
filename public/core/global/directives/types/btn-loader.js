'use strict';
module.exports = function() {
    return {
      restrict: 'A',
      replace: false,
      scope: {
        btnLoader : "=",
        loadingText : "@",
        loadingImage:"@"
      },
      link: function(scope, elem, attrs) {
        var textSelect    = elem.find('.js-btn-text');
        var btnText       = textSelect.text();
        var iconSelector  = elem.find('i');
        var faClass       = iconSelector.attr('class');
        var imgElem       = scope.loadingImage ? "<img src='"+scope.loadingImage+"' />" : "";
        scope.$watch('btnLoader', function(){
          if(scope.btnLoader){
            if(imgElem){
              iconSelector.attr('class', "");
              iconSelector.html(imgElem);
            }
            elem.attr('disabled', 'disabled');
            textSelect.text(scope.loadingText);  
          }
          else{
            elem.removeAttr('disabled', 'disabled');
            iconSelector.attr('class', faClass);
            iconSelector.html("");
            textSelect.text(btnText);
          }
        })
      }
    }
}