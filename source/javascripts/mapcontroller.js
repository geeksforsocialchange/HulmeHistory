popup_text = function(uid){
  var popup = $('#popup-text')
  $.ajax({
    type: 'GET',
    url: 'events/'+ uid +'/',
    timeout: 5000,
    success: function(data) {
      //Prepare ajax data for magnific

      var content_start = data.indexOf('<p>');
      var content_finish = data.lastIndexOf('</p>') + "</p>".length;

      var res = overlay_res['events/'+uid+'/'].resources;
      var moreinfo = "";
      if(res.length > 0){
        var moreinfo = "<p><a class='event-"+ uid + "' href='#" + uid + "'>Click for more info</a></p>"
      }
      var contents = data.substring(content_start, content_finish) + moreinfo;

      popup.html(contents);
      popup.fadeIn();
      var more_info_link = $(".event-"+uid);
      more_info_link.magnificPopup({
        items:res,
        gallery: {
          enabled: true
        },
        type: 'image'
      });
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {}
  });
  return popup;
}
