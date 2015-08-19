popup_text = function(uid, location){
  var popup = $.ajax({
    type: 'GET',
    url: 'events/'+ uid +'/',
    timeout: 5000,
    success: function(data) {
      if(typeof(coords) === "undefined"){
        // Default coordinates
        coords = L.latLng(53.4643,-2.2494);
      } else {
        coords = L.latLng(location[0],location[1]);
      }
      x = L.popup().setLatLng(coords).setContent(data).openOn(map);

    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {}
  });
  return popup;
}
