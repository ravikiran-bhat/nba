module.exports = [
  function(){
    this.init = function($, window) {
      $.fn.contextMenu = function (settings) {
        return this.each(function () {
          // Open context menu
          $(this).on("contextmenu", function (e) {

            var self = this;
            this.targetItem = e.currentTarget.dataset.gridItem;
            // return native menu if pressing control
            if (e.ctrlKey) return;
            //open menu
            var leftPosition = e.clientX - $(this).offset().left + 3
            var topPosition = e.clientY - 152;
            var topPosInParent  = $(settings.parent).height()-($(settings.parent).height()-e.pageY)
            var leftPosInParent  = e.clientX - $(settings.parent).offset().left + 3

            var $menu = $(settings.menuSelector)
            .data("invokedOn", $(e.target))
            .show()
            .css({
              position : "absolute",
              left     : getMenuLeftPosition(leftPosition, 'width', 'scrollLeft', leftPosInParent),
              top      : getMenuTopPosition(topPosition, 'height', 'scrollTop', topPosInParent)
            })
            .off('click')
            .on('click', 'a', function (e) {
              $menu.hide();

              var $invokedOn = $menu.data("invokedOn");
              var $selectedMenu = $(e.target); 
              settings.menuSelected.call(this, $invokedOn, $selectedMenu, self.targetItem);
            });
            
            return false;
          });
          //make sure menu closes on any click
          $('body').click(function () {
            $(settings.menuSelector).hide();
          });
        });

        function getMenuTopPosition(mouse, direction, scrollDir, topPosInParentFrame) {
          var win = $(window)[direction](),
          scroll = $(window)[scrollDir](),
          menu = $(settings.menuSelector)[direction](),
          position = mouse + scroll;

          if(topPosInParentFrame > $(settings.parent).height()-$(settings.menuSelector).height()){
            position = position - $(settings.menuSelector).height();
          }
          // opening menu would pass the side of the page
          /*if (mouse + menu > win && menu < mouse) 
            position -= menu;*/
          
          return position;
        }
        function getMenuLeftPosition(mouse, direction, scrollDir, leftPosInParentFrame) {
          var win = $(window)[direction](),
          scroll = $(window)[scrollDir](),
          menu = $(settings.menuSelector)[direction](),
          position = mouse + scroll;

          if(leftPosInParentFrame >= $(settings.parent).width() - $(settings.menuSelector).width() && leftPosInParentFrame <= $(settings.parent).width()){
            position = position - $(settings.menuSelector).width();
          }
          return position;
        }
      };
    }
  }
]