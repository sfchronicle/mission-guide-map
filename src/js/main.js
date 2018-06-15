require("./lib/social"); //Do not delete

// setting parameters for the center of the map and initial zoom level
if (screen.width <= 480) {
  var mobiledevice = 1;
  var sf_lat = 37.761260;
  var sf_long = -122.414787;
  var zoom_deg = 14;

  var top_of_map_scroll = 37;

} else {
  var mobiledevice = 0;
  var sf_lat = 37.7528682;
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
  scrollWheelZoom: false
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
  iconUrl: './assets/graphics/marker-icon-blue.png', iconSize: [20, 32], iconAnchor: [12, 32], popupAnchor: [-2, -30],
});

var darkgreenIcon = new L.Icon({
  iconUrl: './assets/graphics/marker-icon-darkgreen.png', iconSize: [20, 32], iconAnchor: [12, 32], popupAnchor: [-2, -30],
});

var goldIcon = new L.Icon({
  iconUrl: './assets/graphics/marker-icon-gold.png', iconSize: [20, 32], iconAnchor: [12, 32], popupAnchor: [-2, -30],
});

var lightgreenIcon = new L.Icon({
  iconUrl: './assets/graphics/marker-icon-lightgreen.png', iconSize: [20, 32], iconAnchor: [12, 32], popupAnchor: [-2, -30],
});

var orangeIcon = new L.Icon({
  iconUrl: './assets/graphics/marker-icon-orange.png', iconSize: [20, 32], iconAnchor: [12, 32], popupAnchor: [-2, -30],
});

var pinkIcon = new L.Icon({
  iconUrl: './assets/graphics/marker-icon-pink.png', iconSize: [20, 32], iconAnchor: [12, 32], popupAnchor: [-2, -30],
});

var purpleIcon = new L.Icon({
  iconUrl: './assets/graphics/marker-icon-purple.png', iconSize: [20, 32], iconAnchor: [12, 32], popupAnchor: [-2, -30],
});

var redIcon = new L.Icon({
  iconUrl: './assets/graphics/marker-icon-red.png', iconSize: [20, 32], iconAnchor: [12, 32], popupAnchor: [-2, -30],
});

var imgHeight = document.getElementById("top-img").getBoundingClientRect().height;

// if (!mobiledevice){
//   window.onscroll = function(){
//     console.log("trying to scroll");
//     console.log($(window).scrollTop());
//     if ($(window).scrollTop() > 100){
//       document.getElementById("map-wrapper").classList.add("fullsize");
//       document.getElementById("mission-map").classList.add("fullsize");
//       document.getElementById("sidebar-top").classList.add("fullsize");
//       if (imgHeight != 0){
//         // $("#top-img").animate({"height":"0px"},1000);
//         $("#top-img").slideUp(500);
//         $("#sidebar-top").animate({"padding-top": document.getElementById("map-banner").getBoundingClientRect().height-imgHeight+"px"},500);
//         $("#map-wrapper").animate({"padding-top": document.getElementById("map-banner").getBoundingClientRect().height-imgHeight+"px"},500);
//         imgHeight = 0;
//       }
//     } else {
//       $("#top-img").slideDown(500);
//       $("#sidebar-top").animate({"padding-top": document.getElementById("map-banner").getBoundingClientRect().height-imgHeight+"px"},500);
//       $("#map-wrapper").animate({"padding-top": document.getElementById("map-banner").getBoundingClientRect().height-imgHeight+"px"},500);
//       document.getElementById("map-wrapper").classList.remove("fullsize");
//       document.getElementById("mission-map").classList.remove("fullsize");
//       document.getElementById("sidebar-top").classList.remove("fullsize");
//       imgHeight = document.getElementById("top-img").getBoundingClientRect().height;
//     }
//   }
// }

function clickZoom(e) {
    // $("#sidebar-top").animate({ scrollTop: 0 }, 600);
    if (imgHeight != 0 && !mobiledevice){
      // $("#top-img").animate({"height":"0px"},1000);
      $("#top-img").slideUp(500);
      $("#sidebar-top").animate({"padding-top": document.getElementById("map-banner").getBoundingClientRect().height-imgHeight+"px"},500);
      $("#map-wrapper").animate({"padding-top": document.getElementById("map-banner").getBoundingClientRect().height-imgHeight+"px"},500);
      imgHeight = 0;
    }
    if (mobiledevice){
      $('html, body').animate({ scrollTop: $("#mission-map").offset().top}, 600);
    }
    var currentZoom = map.getZoom();
    map.setView(e.target.getLatLng(),currentZoom);

    var classes = Array.from(e.target._icon.classList);
    var activemarker = classes.filter(function(item){
      if (item.match("MARKER")){
        return item;
      }
    });
    var sidebarScroll = $("#sidebar-top").scrollTop();
    var activemarkerTop = $("#sidebar-"+activemarker[0].split("MARKER")[1]).offset().top - document.getElementById("map-banner").getBoundingClientRect().height;
    $("#sidebar-top").animate({ scrollTop: activemarkerTop + sidebarScroll }, 600);
    $(".mission-group").removeClass("featured");
    $("#sidebar-"+activemarker[0].split("MARKER")[1]).addClass("featured");

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
    }
    var marker = L.marker([d.Lat, d.Lng], {icon: tempicon}).addTo(map).bindPopup(html_str).on('click', clickZoom);
    var markername = d.Name.toLowerCase().replace(/-/g,'').replace(/ /g,'').replace(/'/g, '').replace(/\./g,'').replace(/\+/g,'').replace(/,/g,'').replace(/’/g,'').replace(/&/g,'');
    marker._icon.classList.add("MARKER"+markername);
    var markercatname = markername+"_cat"+d.Category.toLowerCase().replace(/ /g,'');
    markerArray[markercatname] = marker;
    markerNames.push(markercatname);
});

// event listener for each brewery that highlights the brewery on the map and calls the function to fill in the info at the top
var qsa = s => Array.prototype.slice.call(document.querySelectorAll(s));
qsa(".findme").forEach(function(group,index) {
  group.addEventListener("click", function(e) {
    if (imgHeight != 0 && !mobiledevice){
      // $("#top-img").animate({"height":"0px"},1000);
      $("#top-img").slideUp(500);
      $("#sidebar-top").animate({"padding-top": document.getElementById("map-banner").getBoundingClientRect().height-imgHeight+"px"},500);
      $("#map-wrapper").animate({"padding-top": document.getElementById("map-banner").getBoundingClientRect().height-imgHeight+"px"},500);
      imgHeight = 0;
    }
    $(".mission-group").removeClass("featured");
    this.closest(".mission-group").classList.add("featured")
    var mapclassname = e.target.id.split("findme-")[1];
    map.setView(markerArray[mapclassname].getLatLng());
    markerArray[mapclassname].openPopup();
    if (mobiledevice){
      $('html, body').animate({ scrollTop: $("#mission-map").offset().top}, 600);
    }
  });
});

var buttons = document.getElementsByClassName("button");
for (var idx=0; idx<buttons.length; idx++){
  var currentButton = buttons[idx];
  currentButton.addEventListener("click",function(){
    map.closePopup();
    map.setView([sf_lat,sf_long],zoom_deg);
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
      console.log(markerArray[ma]._icon.classList);
      if (activeClass == "all"){
        markerArray[ma]._icon.classList.remove("hide");
      } else {
        console.log(ma);
        if(ma.split("_cat")[1] == activeClass) {
          markerArray[ma]._icon.classList.remove("hide");
        } else {
          markerArray[ma]._icon.classList.add("hide");
        }
      }
    });
    document.getElementById("sidebar-top").scrollTop = 0;
    if (mobiledevice){
      $('html, body').animate({ scrollTop: $("#mission-map").offset().top}, 600);
    }

  });
}

// throttled resize event ----------------------------------------------------
(function() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
             requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle("resize", "throttledResize");
})();

if (!mobiledevice){
  document.getElementById("sidebar-top").style["padding-top"] = document.getElementById("map-banner").getBoundingClientRect().height-10+"px";
  document.getElementById("map-wrapper").style["padding-top"] = document.getElementById("map-banner").getBoundingClientRect().height+"px";
}
// handle event
window.addEventListener("throttledResize", function() {
  if (!mobiledevice){
    document.getElementById("sidebar-top").style["padding-top"] = document.getElementById("map-banner").getBoundingClientRect().height-10+"px";
    document.getElementById("map-wrapper").style["padding-top"] = document.getElementById("map-banner").getBoundingClientRect().height+"px";
  }
});
