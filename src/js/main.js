require("./lib/social"); //Do not delete
var debounce = require("./lib/debounce");

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
  if (d.Website != "n/a"){
    var html_str = "<div class='name bold'>"+d.Name+"<a href="+d.Website+" target='_blank'><i class='fa fa-external-link' aria-hidden='true'></i></a></div><div class='season'><span class='list-hed'>What to order: </span>"+d["Thing to order"]+"</div><div><span class='list-hed'>Address: </span>"+d.Address+"</div>";
  } else {
    var html_str = "<div class='name bold'>"+d.Name+"</div><div class='season'><span class='list-hed'>What to order: </span>"+d["Thing to order"]+"</div><div><span class='list-hed'>Address: </span>"+d.Address+"</div>";
  }
  if (d.Capsules){
    html_str = html_str + "<div class='capsule'>"+d.Capsules+"</div>"
  }
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
L.svg().addTo(map);

var bannerHeight = document.getElementById("map-banner").getBoundingClientRect().height+37;
var imgHeight = document.getElementById("top-img").getBoundingClientRect().height;

function scrollTopImgAway(){
  $("#map-banner").animate({"top": -imgHeight+37+"px"},500);

  $("#sidebar-top").animate({"padding-top": bannerHeight-imgHeight+"px"},500);
  $("#mission-map").animate({"top": bannerHeight-imgHeight+"px"},500);
}

function scrollTopImgDown(){
  $("#map-banner").animate({"top": "37px"},300);
  $("#sidebar-top").animate({"padding-top": bannerHeight+"px"},500);
  $("#mission-map").animate({"top": bannerHeight+"px"},500);
}

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

var scrollDir = "none";
var inSidebar = 0;
if (!mobiledevice){
  $('html').bind('mousewheel DOMMouseScroll', debounce(function (e) {
    var delta = (e.originalEvent.wheelDelta || -e.originalEvent.detail);
    if (delta < 0 && scrollDir != "down") {
        scrollTopImgAway();
        scrollDir = "down";
    } else if (delta > 10 && scrollDir != "up" && inSidebar == 0) {
        scrollTopImgDown();
        scrollDir = "up";
    } else if (delta > 20) {

    }
  },400));
  $("#sidebar-top").mouseenter(function(){
    inSidebar = 1;
  }).mouseleave(function(){
    inSidebar = 0;
  });
}

function clickZoom(e) {
    if (!mobiledevice && scrollDir != "down"){
      scrollTopImgAway();
      scrollDir = "down";
    }
    if (mobiledevice){
      $('html, body').animate({ scrollTop: $("#mission-map").offset().top-37}, 600);
    }
    if (!mobiledevice){
      var currentZoom = map.getZoom();
      map.setView(e.target.getLatLng(),currentZoom);
    }

    var classes = Array.from(e.target._icon.classList);
    var activemarker = classes.filter(function(item){
      if (item.match("MARKER")){
        return item;
      }
    });

    // var sidebarScroll = $("#sidebar-top").scrollTop();
    // var activemarkerTop = $("#sidebar-"+activemarker[0].split("MARKER")[1]).offset().top - document.getElementById("map-banner").getBoundingClientRect().height + 4;
    var sidebarScroll = $("#sidebar-top").scrollTop()-window.scrollY;
    var activemarkerTop = $("#sidebar-"+activemarker[0].split("MARKER")[1]).offset().top - document.getElementById("map-banner").getBoundingClientRect().height + 4;
    $("#sidebar-top").animate({ scrollTop: activemarkerTop + sidebarScroll - 50 }, 500);

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
    } else if (d.Category == "Best High-End"){
      tempicon = darkgreenIcon;
    } else if (d.Category == "Hassle-Free Spots"){
      tempicon = purpleIcon;
    } else if (d.Category == "Mission Classics") {
      tempicon = blueIcon;
    }
    var marker = L.marker([d.Lat, d.Lng], {icon: tempicon}).addTo(map).bindPopup(html_str).on('click', clickZoom);
    var markername = d.Name.toLowerCase().replace(/-/g,'').replace(/ /g,'').replace(/'/g, '').replace(/\./g,'').replace(/\+/g,'').replace(/,/g,'').replace(/’/g,'').replace(/&/g,'');
    marker._icon.classList.add("MARKER"+markername);
    var markercatname = markername+"_cat"+d.Category.toLowerCase().replace(/ /g,'').replace(/-/g,'');
    markerArray[markercatname] = marker;
    markerNames.push(markercatname);
});

// event listener for each brewery that highlights the brewery on the map and calls the function to fill in the info at the top
var qsa = s => Array.prototype.slice.call(document.querySelectorAll(s));
qsa(".findme").forEach(function(group,index) {
  group.addEventListener("click", function(e) {
    if (!mobiledevice && scrollDir != "down"){
      scrollTopImgAway();
      scrollDir = "down";
    }
    $(".mission-group").removeClass("featured");
    this.closest(".mission-group").classList.add("featured")
    var mapclassname = e.target.id.split("findme-")[1];
    markerArray[mapclassname].openPopup();
    if (mobiledevice){
      $('html, body').animate({ scrollTop: $("#mission-map").offset().top}, 500);
    } else {
      map.setView(markerArray[mapclassname].getLatLng());
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
    $(".mission-group").removeClass("featured");
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
    document.getElementById("sidebar-top").scrollTop = 0;
    if (mobiledevice){
      $('html, body').animate({ scrollTop: $("#mission-map").offset().top}, 500);
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
  document.getElementById("sidebar-top").style["padding-top"] = document.getElementById("map-banner").getBoundingClientRect().height-10+37+"px";
  document.getElementById("mission-map").style["top"] = document.getElementById("map-banner").getBoundingClientRect().height+37+"px";
}
// handle event
window.addEventListener("throttledResize", function() {
  if (!mobiledevice){
    var bannerHeight = document.getElementById("map-banner").getBoundingClientRect().height;
    var imgHeight = document.getElementById("top-img").getBoundingClientRect().height;
    document.getElementById("sidebar-top").style["padding-top"] = document.getElementById("map-banner").getBoundingClientRect().height-10+"px";
    document.getElementById("mission-map").style["top"] = document.getElementById("map-banner").getBoundingClientRect().height+"px";
  }
});

// make sticky nav do smooth scrolling
$(document).on('click', 'a[href^="#"]', function(e) {
    // target element id
    var id = $(this).attr('href');
    // target element
    var $id = $(id);
    if ($id.length === 0) {
        return;
    }
    // prevent standard hash navigation (avoid blinking in IE)
    e.preventDefault();
    // top position relative to the document
    var pos = $(id).offset().top-37;
    // animated top scrolling
    $('body, html').animate({scrollTop: pos},1000);
});
