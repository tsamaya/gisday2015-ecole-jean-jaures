// These variables are declared in the global scope,
// to let you play with them from the console.

var map, snowLayer, tracksLayer, liftsLayer, sceneView, defaultSnowRenderer,
objectSymbolRenderer, defaultPointRenderer;

require([
    "esri/config",
    "esri/Map",
    "esri/views/SceneView",
    "esri/Camera",

    "esri/layers/FeatureLayer",
    "esri/layers/SceneLayer",
    "esri/Basemap",

    "dojo/_base/Color",
    "esri/renderers/SimpleRenderer",

    "esri/symbols/PolygonSymbol3D",
    "esri/symbols/ExtrudeSymbol3DLayer",
    "esri/symbols/PointSymbol3D",
    "esri/symbols/MeshSymbol3D",

    "esri/symbols/IconSymbol3DLayer",
    "esri/symbols/ObjectSymbol3DLayer",
    "esri/symbols/FillSymbol3DLayer",

    "dojo/domReady!"
],
function(esriConfig, Map, SceneView, Camera,
         FeatureLayer, SceneLayer, Basemap,
         Color, SimpleRenderer,
         PolygonSymbol3D, ExtrudeSymbol3DLayer, PointSymbol3D, MeshSymbol3D,
         IconSymbol3DLayer, ObjectSymbol3DLayer, FillSymbol3DLayer) {

             esriConfig.request.corsEnabledServers.push('http://vectormaps.esri.com');
             esriConfig.request.corsEnabledServers.push('http://coolmaps.esri.com');
             esriConfig.request.corsEnabledServers.push('http://basemapsbeta.arcgis.com');

             //////////////////////
             //
             // Map and view
             //
             //////////////////////
             map = new Map({
                 basemap: "hybrid"
             });

             snowLayer = new FeatureLayer({
                 url: "http://services.arcgis.com/d3voDfTFbHOCRwVR/arcgis/rest/services/pistesski/FeatureServer/2",
                 opacity: 0.6
             });

             liftsLayer = new FeatureLayer({
                 url: "http://services.arcgis.com/d3voDfTFbHOCRwVR/arcgis/rest/services/pistesski/FeatureServer/0"
             });

             tracksLayer = new FeatureLayer({
                 url: "http://services.arcgis.com/d3voDfTFbHOCRwVR/arcgis/rest/services/pistesski/FeatureServer/1"
             });

             map.add([snowLayer, liftsLayer, tracksLayer]);

             sceneView = new SceneView({
                 container: "mapViewDiv",
                 map: map,
                  center: [2, 46]
             });

             //////////////////////
             //
             // Moving the camera around
             //
             //////////////////////


             // Using jQuery here for UI handlers, can also use dojoBootstrap (http://xsokev.github.io/Dojo-Bootstrap/index.html)
             //
             // Going to Chamrousse : only camera movement
             //
             $("#goChamrousse").on("click", function(evt) {
                 // jshint unused:false

                 var chamrousseCamera = Camera.fromJSON({
                     "position": {
                         "x": 641437.6110656856,
                         "y": 5641777.451070604,
                         "z": 4026.7193905217573,
                         "spatialReference": {
                             "wkid": 102100
                         }
                     },
                     "heading": 98.14635195686014,
                     "tilt": 76.32825263878885
                 });

                 sceneView.animateTo(chamrousseCamera);
             });


             //////////////////////
             //
             // 3D Symbology
             //
             //////////////////////
             $("#extrudeSnow").on("click", function(evt) {
                 // beta : on the fly modifications on the class break renderer don't seem to work yet
                 $(this).toggleClass("btn-success");

                 if (defaultSnowRenderer) {
                     snowLayer.renderer = defaultSnowRenderer;
                     defaultSnowRenderer = null;
                 } else {
                     defaultSnowRenderer = snowLayer.renderer;
                     var snow3DRenderer = new SimpleRenderer({
                         symbol: new PolygonSymbol3D({
                             symbolLayers: [new ExtrudeSymbol3DLayer()]
                         }),
                         visualVariables: [{
                             type: "sizeInfo",
                             field: "height",
                             minDataValue: 0,
                             maxDataValue: 300,
                             minSize: 0,
                             maxSize: 400
                         }, {
                             type: "colorInfo",
                             field: "height",
                             minDataValue: 0,
                             maxDataValue: 300,
                             colors: [new Color("white"), new Color("10DDF0")]
                         }]
                     });

                     snowLayer.renderer = snow3DRenderer;
                 }
             });

         });
