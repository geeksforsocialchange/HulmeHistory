// attempted Timeline interface
function timeline_mousedown(e){
    window.crossbar = {};
    crossbar.pageY0 = e.pageY;
    crossbar.elem = $("#crossbar")[0];
    crossbar.offset0 = $("#crossbar").offset();
    var tl_height = $("#timeline").innerHeight();
    var tl_padding = parseInt($("#timeline").css('padding-top'));
    var tl_top = $("#timeline").offset().top;
    var button_height = $("#listholder li").outerHeight();
    var scroll_range = $("#listholder")[0].scrollHeight - tl_height +
      2 * button_height;
    function handle_dragging(e){
        var top = crossbar.offset0.top + (e.pageY - crossbar.pageY0);
        $(crossbar.elem)
        .offset({top: top});
        var ol_offs = tl_top + tl_padding + button_height - top * scroll_range / tl_height;
        console.log(tl_top);
        $("#listholder").offset({top:ol_offs});
    }
    function handle_mouseup(e){
        $('body')
        .off('mousemove', handle_dragging)
        .off('mouseup', handle_mouseup);
        snap_to_row(e)
    }
    function snap_to_row(e){
      $("#listholder li").each(function(){
        cb = $("#crossbar");
        var top = $(this).offset().top;

        // CASE: crossbar is over li
        if (cb.offset().top > top &&
          cb.offset().top < (top + $(this).outerHeight())) {
            var midline = top + ($(this).height() - cb.height())/2;
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
      elem.addClass("active");
      // var latlng = elem.children()[0].getAttribute('data-latlng');
      // TODO: TRIGGER Visualisation POPUP? MARKER? WHATNOT?
    }
    function deactivate(elem) {
      elem.removeClass("active");
      // TODO: TRIGGER Visualisation hide.
    }
    $('body')
    .on('mouseup', handle_mouseup)
    .on('mousemove', handle_dragging);
}
