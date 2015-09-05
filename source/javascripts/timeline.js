// attempted Timeline interface

// // crossbar offset
// function cb_offs() {
//   var button_height = $("li.event.item")[0].offsetHeight;
//   var tl_top = $("#tl-content").offset()['top'];
//   var tl_scr_top = $("#tl-content").scrollTop();
//   var tl_height = $("#tl-content").innerHeight();
//   var tl_scr_rng = $("#tl-content")[0].scrollHeight - tl_height
//   return tl_top + button_height/2 + (tl_height - button_height) * tl_scr_top / tl_scr_rng;
// }

function selecta() {
  var events = $("li.event.item");
  var i = 0;
  var selection;
  var container = $("#tl-content");
  var scroll_height = container.prop('scrollHeight');
  var scroll_px = container.scrollTop();
  var view_height = container.height();
  var e_height = $(".event").outerHeight(true);

  // range of scrolling motion
  var scroll_range = scroll_height - view_height;

  // selection point:
  var scroll_point = e_height/2 + scroll_px * (scroll_height - e_height) / (scroll_range);

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
