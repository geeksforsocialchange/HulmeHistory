// attempted Timeline interface

function select_point(scroll_px){
  var container = $("#tl-content");
  var scroll_height = container.prop('scrollHeight');
  var view_height = container.height();
  var e_height = $(".event").outerHeight(true);

  // range of scrolling motion
  var scroll_range = scroll_height - view_height;

  // selection point:
  var select_pt = e_height/2 + scroll_px * (scroll_height - e_height) / (scroll_range);
  return select_pt
}

// inverter fn, finds necessary scrollTop to select event e by its .offsetTop
// FIXME: Very marginally not quite right. Good enough for now.
function s_p_inv(e_offs_top) {
  var container = $("#tl-content");
  var scr_h = container.prop('scrollHeight');
  var v_h = container.height();
  var e_h = $(".event").outerHeight();
  return e_offs_top * (scr_h - v_h) / (scr_h - e_h);
}

function selecta() {
  var scroll_px = $("#tl-content").scrollTop();
  var events = $("li.event.item");
  var i = 0;
  var selection;

  var scroll_point = select_point(scroll_px);

  // Smooth mode crossbar. See "event.activate()" in index.html for "clicky"
  $("#crossbar").css({'top':scroll_point});

  // walk through list while next event is before selection point.
  do {
    selection = events[i];
    i++;
  }
  while (events[i] && events[i].offsetTop < scroll_point);

  // if next event closer, make the jump
  if(events[i] &&
      Math.abs((selection.offsetTop + selection.offsetHeight) - scroll_point) >
      Math.abs(events[i].offsetTop - scroll_point)) {
    selection = events[i];
  }
  $(".event.active").not(selection).each(function(){
    console.log(this);
    // clean up formerly selected events
    this.deactivate();
  });
  $(selection).not(".active").each(function(){
    // important not to activate already activated events
    this.activate()
    map.update();
  })
  return selection;
}

function timeline_mousedown(e){
  var ey = e.pageY;
  var scr_top_init = $("#tl-content").scrollTop();
    function handle_dragging(e){
      var dy = scr_top_init + e.pageY - ey;
      $("#tl-content").scrollTop(dy);
    }
    function handle_mouseup(e){
        $('body')
        .off('mousemove', handle_dragging)
        .off('mouseup', handle_mouseup);
    }
    $('body')
    .on('mouseup', handle_mouseup)
    .on('mousemove', handle_dragging);
}

function timeline_scroll(e) {
  var selected = selecta();
}
