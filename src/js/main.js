require("./lib/social"); //Do not delete

// setting parameters for the center of the map and initial zoom level
if (screen.width <= 480) {
  var sf_lat = 37.77;
  var sf_long = -122.43;
  var zoom_deg = 11;

  var top_of_map_scroll = 37;

} else {
  var sf_lat = 37.7628682;
  var sf_long = -122.414615;
  var zoom_deg = 14;

  var top_of_map_scroll = 0;
}


// initialize map with center position and zoom levels
var map = L.map("mission-map", {
  minZoom: 6,
  maxZoom: 16,
  zoomControl: false,
  dragging: true,
  // touchZoom: true
  // zoomControl: isMobile ? false : true,
  // scrollWheelZoom: false
}).setView([sf_lat,sf_long], zoom_deg);
// window.map = map;

// tooltip information
function tooltip_function (d) {
  var html_str = "<div class='name bold'>"+d.Name+"<a href="+d.Website+" target='_blank'><i class='fa fa-external-link' aria-hidden='true'></i></a></div><div class='season'>Recommended order: "+d["Thing to order"]+"</div>"
  return html_str;
}

map.dragging.enable();

// add tiles to the map
var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/emro/cjbib4t5e089k2sm7j3xygp50/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA",{attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'})
mapLayer.addTo(map);

L.control.zoom({
     position:'topright'
}).addTo(map);

// initializing the svg layer
L.svg().addTo(map)

var blueIcon = new L.Icon({
  iconUrl: '../assets/graphics/marker-icon-blue.png', iconSize: [20, 32], iconAnchor: [12, 32], popupAnchor: [-2, -30],
});

var darkgreenIcon = new L.Icon({
  iconUrl: '../assets/graphics/marker-icon-darkgreen.png', iconSize: [20, 32], iconAnchor: [12, 32], popupAnchor: [-2, -30],
});

var goldIcon = new L.Icon({
  iconUrl: '../assets/graphics/marker-icon-gold.png', iconSize: [20, 32], iconAnchor: [12, 32], popupAnchor: [-2, -30],
});

var lightgreenIcon = new L.Icon({
  iconUrl: '../assets/graphics/marker-icon-lightgreen.png', iconSize: [20, 32], iconAnchor: [12, 32], popupAnchor: [-2, -30],
});

var orangeIcon = new L.Icon({
  iconUrl: '../assets/graphics/marker-icon-orange.png', iconSize: [20, 32], iconAnchor: [12, 32], popupAnchor: [-2, -30],
});

var pinkIcon = new L.Icon({
  iconUrl: '../assets/graphics/marker-icon-pink.png', iconSize: [20, 32], iconAnchor: [12, 32], popupAnchor: [-2, -30],
});

var purpleIcon = new L.Icon({
  iconUrl: '../assets/graphics/marker-icon-purple.png', iconSize: [20, 32], iconAnchor: [12, 32], popupAnchor: [-2, -30],
});

var redIcon = new L.Icon({
  iconUrl: '../assets/graphics/marker-icon-red.png', iconSize: [20, 32], iconAnchor: [12, 32], popupAnchor: [-2, -30],
});

function clickZoom(e) {
    var currentZoom = map.getZoom();
    map.setView(e.target.getLatLng(),currentZoom);
    $('html, body').animate({
        scrollTop: $("#sidebar-top").offset().top - top_of_map_scroll
    }, 600);
}

// adding markers
var markerArray = {};
var markerNames = [];
var tempicon;
missionData.forEach(function(d,idx) {
		d.LatLng = new L.LatLng(d.Lat,
								d.Lng);
    var html_str = tooltip_function(d);
    if (d.Category == "Best Latin American"){
      tempicon = goldIcon;
    } else if (d.Category == "Best Desserts"){
      tempicon = pinkIcon;
    } else if (d.Category == "Best of the New Mission") {
      tempicon = orangeIcon;
    } else if (d.Category == "Best Vegetarian"){
      tempicon = lightgreenIcon;
    } else if (d.Category == "Best Tasting Menus"){
      tempicon = darkgreenIcon;
    } else if (d.Category == "Hidden Gems"){
      tempicon = purpleIcon;
    } else if (d.Category == "Mission Classics") {
      tempicon = blueIcon;
    } else {
      console.log(d.Category);
    }
    var marker = L.marker([d.Lat, d.Lng], {icon: tempicon}).addTo(map).bindPopup(html_str).on('click', clickZoom);
    var markername = d.Name.toLowerCase().replace(/-/g,'').replace(/ /g,'').replace(/'/g, '').replace(/\./g,'');
    markername = markername+"_cat"+d.Category.toLowerCase().replace(/ /g,'');
    markerArray[markername] = marker;
    markerNames.push(markername);
});

var buttons = document.getElementsByClassName("button");
for (var idx=0; idx<buttons.length; idx++){
  var currentButton = buttons[idx];
  currentButton.addEventListener("click",function(){
    var activeClass = this.classList[1];
    $(".button").removeClass("active");
    this.classList.add("active");
    if (activeClass == "all"){
      $(".category-block").addClass("active");
      $(".mission-group").addClass("active");
    } else {
      $(".category-block").removeClass("active");
      $(".mission-group").removeClass("active");
      $("."+activeClass).addClass("active");
    }
    Object.keys(markerArray).forEach(function(ma,maIDX){
      if (activeClass == "all"){
        markerArray[ma]._icon.classList.remove("hide");
      } else {
        if(ma.split("_cat")[1] == activeClass) {
          markerArray[ma]._icon.classList.remove("hide");
        } else {
          markerArray[ma]._icon.classList.add("hide");
        }
      }
    });
    // markerArray["market"+classes[1]]._icon.classList.add("hide");
    document.getElementById("sidebar-top").scrollTop = 0;
    // $('html, body').animate({ scrollTop: $("#sidebar-top").offset().top - top_of_map_scroll}, 600);

  });
}
