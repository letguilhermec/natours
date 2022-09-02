const locations = JSON.parse(document.getElementById('map').dataset.locations)

mapboxgl.accessToken = 'pk.eyJ1IjoibGV0Z3VpbGhlcm1lYyIsImEiOiJjbDdqdG5ybDExMWkzM3ZxdWduZGtzZThwIn0.qRSbsMGhyvkZBhRQtN9-ug';

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/letguilhermec/cl7jtcd8x002y14o6mgpd4npe', // style URL
  center: [-118.113491, 34.1111745], // starting position [lng, lat]
  zoom: 10
});


