import './style.css';
import {Map,View,Feature} from 'ol';
import {OSM,Vector as VectorSource} from 'ol/source';
import $ from 'jquery';
import {Tile as TileLayer,Vector as VectorLayer} from 'ol/layer';
import {fromLonLat,toLonLat} from 'ol/proj';
import {Polygon,Point} from 'ol/geom';
import {Fill,Stroke,Style} from 'ol/style';
import {Translate,defaults as defaultInteractions} from 'ol/interaction';

//Position of our map center

var pos = fromLonLat([76.87403794962249, 8.569385045000772]);

//Position for our Triangle Polygon

var pos1 = fromLonLat([76.85860825505787, 8.575525035547585]);

//The below line is to check the Longitude and Latitude

var pos2 = fromLonLat([76.85286067404068, 8.56925661298456]);

var pos3 = fromLonLat([76.86300346314657, 8.56917303421666]);

//Position for arrow Polygon

var arrowOne = fromLonLat([76.86219331461274, 8.565926475435887]);

var arrowTwo = fromLonLat([76.86584111887299, 8.566053785302557]);

var arrowThree = fromLonLat([76.86566945749604, 8.56758150037902]);

var arrowFour = fromLonLat([76.87034723001801, 8.56456850087342]);

var arrowFive = fromLonLat([76.86635610300385, 8.562064722566959]);

var arrowSix = fromLonLat([76.86627027231538, 8.5638470749155]);

var arrowSeven = fromLonLat([76.86163541513764, 8.564016822322785]);

//OSM() Tile layer for our Map

var tileLayer = new TileLayer({
    source: new OSM()
});

//Setting View for our Map
var tempCord = [8175188.806634023, 914499.0604405673];
var viewOne = new View({
    center: pos,
    zoom: 10
});
var resOne = viewOne.getResolution();

//Coordinates for our Polygons
var cordTriangle = [pos1, pos2, pos3, pos1];
var cordArrow = [arrowOne, arrowTwo, arrowThree, arrowFour, arrowFive, arrowSix, arrowSeven, arrowOne];

var polyTriangle = new Polygon([cordTriangle]);

//To get varying coordinates
var cordArray = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
];

//The below function will multiply the cordinates with resolution while zooming

var transPosArrow = pos.slice();
function myFunction() {

    var resol = viewOne.getResolution();
    for (var outer = 0; outer < cordArrow.length; outer++) {
        // for (var inner = 0; inner < cordArrow[outer].length; inner++) {

            cordArray[outer][0] = transPosArrow[0] + (cordArrow[outer][0] - pos[0]) * resol/resOne;

            cordArray[outer][1] = transPosArrow[1] + (cordArrow[outer][1] - pos[1]) * resol/resOne;
        // }
    }

    console.log(cordArray);
    if (featureArrow) {
        featureArrow.setGeometry(new Polygon([cordArray]));
    }
}

myFunction();
var polyArrow = new Polygon([cordArray]);

//Adding the Feature for our Polygons
var featureTriangle = new Feature({
    geometry: polyTriangle,
    labelPoint: new Point(pos),
    name: 'My Polygon',
    id: 'triPoly'
});

var featureArrow = new Feature(polyArrow);

//vectorSource.addFeature(feature);

var vectorSource = new VectorSource({
    projection: 'EPSG:4326',
    features: [featureTriangle, featureArrow]
});

// The below Select is needed if we have to select a feature before move
//var select = new Select();

//The below will select all the Features and add it for Translate
var translate = new Translate();
var transStartArrow = [];
translate.on('translatestart', function(evt) {
    for (i=0; i<evt.features.getArray().length; i++) {
        if (evt.features.getArray()[i] === featureArrow) {
            transStartArrow[0] = evt.coordinate[0];
            transStartArrow[1] = evt.coordinate[1];
        }
    }
});
translate.on('translateend', function(evt) {
    for (i=0; i<evt.features.getArray().length; i++) {
        if (evt.features.getArray()[i] === featureArrow) {
            transPosArrow[0] = transPosArrow[0] + evt.coordinate[0] - transStartArrow[0];
            transPosArrow[1] = transPosArrow[1] + evt.coordinate[1] - transStartArrow[1];
        }
    }
});



//Setting custom styles for our Polygons

featureTriangle.setStyle(new Style({
    fill: new Fill({
        color: 'red'
    })
}));

featureArrow.setStyle(new Style({
    stroke: new Stroke({
        color: 'cyan',
        width: 4
    }),
    fill: new Fill({
        color: 'red'
    })
}));

var vectorLayer = new VectorLayer({
    source: vectorSource,
});

// Adding all Layers and creating our Map
var map = new Map({
    interactions: defaultInteractions().extend([ /*select,*/ translate]),
    target: 'map',
    layers: [tileLayer, vectorLayer],
    view: viewOne
});

//To get the Lon and Lat of clicked location over map. This will be displayed in the console.

$(document).ready(function () {
    map.on('click', function (event) {
        let cordClick = toLonLat(event.coordinate);
        console.log(cordClick);
    });
});

/*
$(window).resize(function () {
    $(window).trigger('zoom');
});
$(window).on('zoom', function () {
    console.log('zoom', viewOne.getResolution());
});
*/


//The below  will call myFunction when we zoom

// document.getElementById("map").addEventListener("wheel", myFunction);
viewOne.on("change:resolution",myFunction);     

var featCoord = featureTriangle.getGeometry().getCoordinates();
//featureTriangle.setGeometry('Polygon');
console.log('Geometry Type', featCoord);