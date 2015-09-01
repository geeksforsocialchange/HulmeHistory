// attempted Timeline interface
function cb_offs() {
  // var tl_height = $("#tl-content").innerHeight();
  // var tl_top = $("#tl-content").offset().top;
  var button_height = $("li.event.item")[0].offsetHeight;
  // var scroll_range = $("tl-content")[0].scrollHeight - tl_height + button_height;
  // var top = $("#crossbar")[0].offsetTop;
  var tl_top = $("#tl-content").offset()['top'];
  var tl_scr_top = $("#tl-content").scrollTop();
  var tl_scr_ht = $("#tl-content")[0].scrollHeight
  var tl_height = $("#timeline").innerHeight();
  return tl_top + button_height/2 + tl_scr_top * (tl_scr_ht - tl_height)/ tl_scr_ht;
}

function timeline_mousedown(e){
    function handle_dragging(e){
      var dy = (e.pageY / window.innerHeight) * $("#tl-content")[0].scrollHeight;
      $("#tl-content").scrollTop(dy);
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

function timeline_scroll(e) {
  $("#crossbar").offset({top:cb_offs()});
}
