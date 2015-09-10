popup_text = function(uid, location){
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  if(w > 0 && h > 0){
    var max_w = w /2;
    var max_h = h / 2;
  } else {
    var max_w = 400; // Defaults is all else goes wrong
    var max_h = 400; // Allows for scrollable popups.
  }
  var popup = L.popup({maxWidth: max_w, maxHeight: max_h});
  $.ajax({
    type: 'GET',
    url: 'events/'+ uid +'/',
    timeout: 5000,
    success: function(data) {
      if(typeof(location) === "undefined"){
        // Default coordinates
        coords = L.latLng(53.4643,-2.2494);
      } else {
        coords = location;
      }
      popup.setLatLng(coords).setContent(data);
      map.addLayer(popup);

    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {}
  });
  return popup;
}
