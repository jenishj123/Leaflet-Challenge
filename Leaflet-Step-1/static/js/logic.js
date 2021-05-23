// Creating map object
var myMap = L.map("mapid", {
    center: [36.77, -119.41],
    zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Use this link to get jeojason data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
function getColor(i) {
    return i > 90 ? "#EA2C2C" :
        i > 70 ? "#EA822C" :
            i > 50 ? "#EE9C00" :
                i > 30 ? "#EECC00" :
                    i > 10 ? "#D4EE00" :
                        "#98EE00";
}

// Grabbing our GeoJSON data..
d3.json(link, function (data) {
    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return new L.CircleMarker(latlng, {
                radius: feature.properties.mag * 4,
                color: 'grey',
                fillColor: getColor(feature.geometry.coordinates[2]),
                fillOpacity: 1
            });
        },

        // Called on each feature
        onEachFeature: function (feature, layer) {

            // Giving each feature a pop-up with information pertinent to it
            layer.bindPopup("<h1>" + feature.properties.mag + "</h1> <hr> <h2>" + feature.properties.place + "</h2>");

        }
    }).addTo(myMap);
    
    // Adding legends
    
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90]

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);

});
