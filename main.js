import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import {fromExtent} from 'ol/geom/Polygon';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {getArea, getLength} from 'ol/sphere';
import {Fill, Stroke, Style} from 'ol/style';
import {
  defaults as defaultInteractions,
} from 'ol/interaction';


const map = new Map({
  target: 'map',
  interactions: defaultInteractions({zoomDuration: 0}), // IMPORTANT
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    projection: 'EPSG:4326',
    constrainResolution: true, // IMPORTANT
    center: [30.113394587231483, -26.067982448753753],
    zoom: 15
  })
});

/* FUNCTION IMPORTANT */
function getCenterOfExtent(Extent){
  var X = Extent[0] + (Extent[2]-Extent[0])/2;
  var Y = Extent[1] + (Extent[3]-Extent[1])/2;
  return [X, Y];
}

/* FUNCTION IMPORTANT */
function resizeLayer(vlayer){
  let curZoomlvl = map.getView().getZoom();
  let originGeom = vlayer.getSource().getFeatures()[0].getGeometry().clone();
  let geom_current = vlayer.getSource().getFeatures()[0].getGeometry();
  let geom_extent = geom_current.getExtent();
  let geom_center = getCenterOfExtent(geom_extent);
  let extent_ration;
  if(geom_current.getType()==='LineString'){
    extent_ration = fromExtent(geom_extent).getArea() / fromExtent(map.getView().calculateExtent()).getArea();
  } else if(geom_current.getType()==='Polygon'){
    extent_ration = geom_current.getArea() / fromExtent(map.getView().calculateExtent()).getArea();
  } else {
    return 'No need to resize';
  };
  if(extent_ration < 0.0001 ){
    vlayer.getSource().getFeatures()[0].getGeometry().scale(4, undefined, geom_center);
  } 
  map.on('moveend', function(e) {
    var zoomLevel = map.getView().getZoom();
    console.log(zoomLevel);
    let sdownLimitCondition;
    if(geom_current.getType()==='LineString'){
      sdownLimitCondition = getLength(originGeom) < getLength(geom_current);
      extent_ration = fromExtent(geom_extent).getArea() / fromExtent(map.getView().calculateExtent()).getArea();
    } else if(geom_current.getType()==='Polygon'){
      sdownLimitCondition = getArea(originGeom) < getArea(geom_current);
      extent_ration = geom_current.getArea() / fromExtent(map.getView().calculateExtent()).getArea();
    };
    if(zoomLevel <= curZoomlvl && extent_ration < 0.0001 ){
      vlayer.getSource().getFeatures()[0].getGeometry().scale(2, undefined, geom_center);
      curZoomlvl = zoomLevel
    } else if(zoomLevel > curZoomlvl && sdownLimitCondition ) {
      vlayer.getSource().getFeatures()[0].getGeometry().scale(0.5, undefined, geom_center);
      curZoomlvl = zoomLevel
    }
  });
  map.getView().setCenter(map.getView().getCenter());
}



// Layers for example

var poly = new Feature({
  geometry: new Polygon(
    [
      [
        [
          30.113394587231483,
          -26.067982448753753
        ],
        [
          30.112618133309553,
          -26.069261132758385
        ],
        [
          30.114015750368168,
          -26.070051584977747
        ],
        [
          30.114714558898186,
          -26.068982148347736
        ],
        [
          30.113394587231483,
          -26.067982448753753
        ]
      ]
    ]
  ),    
  name: 'hello'
}); 

var vectorSource = new VectorSource({
  features: [poly]
});

var vectorLayer = new VectorLayer({
  source: vectorSource,
  style: new Style({
    stroke: new Stroke({
      color: 'red',
      width: 0.5,
    }),
    fill: new Fill({
      color: '#ff000078',
    }),
  }),
});

var poly2 = new Feature({
  geometry: new Polygon(
    [
      [
        [
          30.26357040149813,
          -25.94239222096691
        ],
        [
          30.26362974499304,
          -25.94249894833527
        ],
        [
          30.263451714509927,
          -25.942845811613466
        ],
        [
          30.26317725085113,
          -25.943266048448777
        ],
        [
          30.263503640068336,
          -25.943686283783265
        ],
        [
          30.264248047000677,
          -25.94299947854236
        ],
        [
          30.26418128556935,
          -25.94253921803292
        ],
        [
          30.263634406238083,
          -25.942099364210094
        ],
        [
          30.263137404475827,
          -25.942192750894066
        ],
        [
          30.262818433195093,
          -25.942419546821213
        ],
        [
          30.26357040149813,
          -25.94239222096691
        ]
      ]
    ]
  )
}); 

var vectorSource2 = new VectorSource({
  features: [poly2]
});

var vectorLayer2 = new VectorLayer({
  source: vectorSource2,
  style: new Style({
    stroke: new Stroke({
      color: 'red',
      width: 0.5,
    }),
    fill: new Fill({
      color: '#ff000078',
    }),
  }),
});


var poly3 = new Feature({
  geometry: new Polygon(
    [
      [
        [
          29.88731448043501,
          -26.118628074405116
        ],
        [
          29.88731448043501,
          -26.143083314215474
        ],
        [
          29.907833369092685,
          -26.143083314215474
        ],
        [
          29.907833369092685,
          -26.118628074405116
        ],
        [
          29.88731448043501,
          -26.118628074405116
        ]
      ]
    ]
  )
}); 

var vectorSource3 = new VectorSource({
  features: [poly3]
});

var vectorLayer3 = new VectorLayer({
  source: vectorSource3,
  style: new Style({
    stroke: new Stroke({
      color: 'red',
      width: 0.5,
    }),
    fill: new Fill({
      color: '#ff000078',
    }),
  }),
});


var poly4 = new Feature({
  geometry: new Polygon(
    [
      [
        [
          30.11926338799185,
          -26.020236901642356
        ],
        [
          30.1175007287668,
          -26.021952883248694
        ],
        [
          30.120511938277303,
          -26.029872473208243
        ],
        [
          30.129912787481345,
          -26.032116259846283
        ],
        [
          30.125530820135594,
          -26.02045919105904
        ],
        [
          30.123400940238042,
          -26.0232311436259
        ],
        [
          30.11926338799185,
          -26.020236901642356
        ]
      ]
    ]
  )
}); 

var vectorSource4 = new VectorSource({
  features: [poly4]
});

var vectorLayer4 = new VectorLayer({
  source: vectorSource4,
  style: new Style({
    stroke: new Stroke({
      color: 'red',
      width: 0.5,
    }),
    fill: new Fill({
      color: '#ff000078',
    }),
  }),
});


var poly5 = new Feature({
  geometry: new Polygon(
    [
      [
        [
          29.98861271332069,
          -26.30024224821136
        ],
        [
          29.988644809469122,
          -26.300292889914104
        ],
        [
          29.98872697560813,
          -26.30026296527444
        ],
        [
          29.988705150226707,
          -26.30020771976526
        ],
        [
          29.98861271332069,
          -26.30024224821136
        ]
      ]
    ]
  )
}); 

var vectorSource5 = new VectorSource({
  features: [poly5]
});

var vectorLayer5 = new VectorLayer({
  source: vectorSource5,
  style: new Style({
    stroke: new Stroke({
      color: 'red',
      width: 0.5,
    }),
    fill: new Fill({
      color: '#ff000078',
    }),
  }),
});


var line6 = new Feature({
  geometry: new LineString(
    [
      [
        30.034374958212396,
        -26.469869268431815
      ],
      [
        30.037463708766694,
        -26.466182604860826
      ],
      [
        30.04072405657294,
        -26.462034967176322
      ],
      [
        30.045013987898415,
        -26.454507391136246
      ],
      [
        30.047759543946256,
        -26.446518404837825
      ],
      [
        30.0505051005363,
        -26.438221563039278
      ]
    ]
  )
}); 

var vectorSource6 = new VectorSource({
  features: [line6]
});

var vectorLayer6 = new VectorLayer({
  source: vectorSource6,
  style: new Style({
    stroke: new Stroke({
      color: 'red',
      width: 1,
    })
  }),
});


var line7 = new Feature({
  geometry: new LineString(
    [
      [
        30.000580431461145,
        -26.302140264748488
      ],
      [
        30.009345302285794,
        -26.309124447821326
      ],
      [
        30.005449804141307,
        -26.315235262737666
      ],
      [
        29.99571105878087,
        -26.316108209986986
      ],
      [
        29.98694618795622,
        -26.310870427825158
      ]
    ]
  )
}); 

var vectorSource7 = new VectorSource({
  features: [line7]
});

var vectorLayer7 = new VectorLayer({
  source: vectorSource7,
  style: new Style({
    stroke: new Stroke({
      color: 'red',
      width: 1,
    })
  }),
});

var line8 = new Feature({
  geometry: new LineString(
    [
      [
        30.15127792525314,
        -26.318487856884765
      ],
      [
        30.150995798331678,
        -26.31873230981543
      ]
    ]
  )
}); 

var vectorSource8 = new VectorSource({
  features: [line8]
});

var vectorLayer8 = new VectorLayer({
  source: vectorSource8,
  style: new Style({
    stroke: new Stroke({
      color: 'red',
      width: 1,
    })
  }),
});


var line9 = new Feature({
  geometry: new LineString(
    [
      [
        30.179878072335868,
        -26.365450889641387
      ],
      [
        30.181476338099714,
        -26.367097693661968
      ],
      [
        30.18123659823587,
        -26.364878082743815
      ],
      [
        30.182914777288033,
        -26.366166894272098
      ]
    ]
  )
}); 

var vectorSource9 = new VectorSource({
  features: [line9]
});

var vectorLayer9 = new VectorLayer({
  source: vectorSource9,
  style: new Style({
    stroke: new Stroke({
      color: 'red',
      width: 1,
    })
  }),
});



let all_layers = [
  vectorLayer, vectorLayer2, vectorLayer3, vectorLayer4,
  vectorLayer5, vectorLayer6, vectorLayer7, vectorLayer8,
  vectorLayer9
]

all_layers.forEach(function(vlayer){
  map.addLayer(vlayer);
})

map.getAllLayers().forEach(function(vlayer, idx){
  if(idx>0){
    resizeLayer(vlayer)
  }
})