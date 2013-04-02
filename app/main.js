dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("esri.arcgis.utils");
dojo.require("esri.map");

/******************************************************
***************** begin config section ****************
*******************************************************/

var TITLE = "This is the title."
var BYLINE = "This is the byline"
var WEBMAP_ID = "3732b8a6d0bc4a09b00247e8daf69af8";
var GEOMETRY_SERVICE_URL = "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer";

/******************************************************
***************** end config section ******************
*******************************************************/

var _map;

var _dojoReady = false;
var _jqueryReady = false;

var _initExtent; // set this in init() if desired; otherwise, it will 
				 // be the default extent of the web map;

var _isMobile = isMobile();

dojo.addOnLoad(function() {_dojoReady = true;init()});
jQuery(document).ready(function() {_jqueryReady = true;init()});

function init() {
	
	if (!_jqueryReady) return;
	if (!_dojoReady) return;
	
	// jQuery event assignment
	
	$(this).resize(handleWindowResize);
	
	$("#zoomIn").click(function(e) {
        _map.setLevel(_map.getLevel()+1);
    });
	$("#zoomOut").click(function(e) {
        _map.setLevel(_map.getLevel()-1);
    });
	$("#zoomExtent").click(function(e) {
        _map.setExtent(_initExtent);
    });
	
	$("#title").append(TITLE);
	$("#subtitle").append(BYLINE);	

	var mapDeferred = esri.arcgis.utils.createMap(WEBMAP_ID, "map", {
		mapOptions: {
			slider: false,
			wrapAround180: true,
			extent:_initExtent
		},
		ignorePopups: false,
		geometryServiceURL: GEOMETRY_SERVICE_URL
	});
	
	mapDeferred.addCallback(function(response) {	  

		_map = response.map;

		if(_map.loaded){
			initMap();
		} else {
			dojo.connect(_map,"onLoad",function(){
				initMap();
			});
		}
				
	});
	
}

function initMap() {
	if (!_initExtent) _initExtent = _map.extent;
	handleWindowResize();	
}

function handleWindowResize() {
	$("#map").height($("body").height() - $("#header").height());
	$("#map").width($("body").width());
	_map.resize();
}
