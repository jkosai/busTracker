mapboxgl.accessToken = 'pk.eyJ1Ijoiamtvc2FpIiwiYSI6ImNsMmtvMTBlMDA1azIzYnBqbmhvMjNhOTIifQ.dAHeuAStdgJoNGAZBoCmZQ';
  
var map;
var markers = [];

function init(){

	var element = document.getElementById('map');
  	map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-71.104081, 42.365554],
        zoom: 10,
      });
  	addMarkers();
}

async function addMarkers(){
	var locations = await getBusLocations();
	locations.forEach(function(bus){
		var marker = getMarker(bus.id);	
		if (marker){
			moveMarker(marker,bus);
		}
		else{
			addMarker(bus);			
		}
	});
	setTimeout(addMarkers,1000);
}

async function getBusLocations(){
	var url = 'https://api-v3.mbta.com/vehicles?api_key=ca34f7b7ac8a445287cab52fb451030a&filter[route]=1&include=trip';	
	var response = await fetch(url);
	var json     = await response.json();
	return json.data;
}

function addMarker(bus){
	var marker = new mapboxgl.Marker().setLngLat({lat: bus.attributes.latitude, 
        lng: bus.attributes.longitude}).addTo(map);
        marker._element.id = bus.id;
    
	markers.push(marker);
    
}


function moveMarker(marker,bus) {
    marker.setLngLat({
        lat: bus.attributes.latitude, 
        lng: bus.attributes.longitude
    })
	
}

function getMarker(id){
    console.log(markers);
	var marker = markers.find(function(item){
		return item._element.id === id;        
	});
	return marker;
}

window.onload = init;
