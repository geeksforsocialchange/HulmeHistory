// attempted Timeline interface
function timeline_mousedown(e){
    var tl_height = $("#tl-content").innerHeight();
    var tl_top = $("#tl-content").offset().top;
    var button_height = $("li.event.item")[0].offsetHeight;
    var scroll_range = $("ol.decades")[0].scrollHeight - tl_height + button_height;

    window.crossbar = {};
    crossbar.pageY0 = e.pageY;
    crossbar.elem = $("#crossbar")[0];
    crossbar.offset0 = $("#crossbar").offset();
    function handle_dragging(e){
        var top = crossbar.offset0.top + (e.pageY - crossbar.pageY0);
        if (0 < top && top < tl_height - button_height/2){
          $(crossbar.elem)
          .offset({top: top});
          var tl_offs = (top - button_height/2) * scroll_range / tl_height - tl_top;
          $("#tl-content").scrollTop(tl_offs);
        }
    }
    function handle_mouseup(e){
        $('body')
        .off('mousemove', handle_dragging)
        .off('mouseup', handle_mouseup);
        snap_to_row(e)
    }
    function snap_to_row(e){
      $("li.event.item").each(function(){
        cb = $("#crossbar");
        var top = $(this).offset().top;

        // CASE: crossbar is over li
        if (cb.offset().top > top &&
          cb.offset().top < (top + $(this).outerHeight())) {
            var midline = top + ($(this).height())/2;
            cb.animate({top: midline});
            if(!$(this).hasClass("active")){
            activate($(this));
            }
        } else if($(this).hasClass("active")){
          // CASE: Crossbar is not over li. Deactivate
          deactivate($(this));
        }
      });
    }
    function activate(elem) {
      elem[0].activate();
    }
    function deactivate(elem) {
      elem[0].deactivate();
    }
    $('body')
    .on('mouseup', handle_mouseup)
    .on('mousemove', handle_dragging);
}
