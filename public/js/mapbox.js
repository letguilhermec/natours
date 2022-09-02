const locations = JSON.parse(document.getElementById('map').dataset.locations)

// mapboxgl.accessToken = 'pk.eyJ1IjoibGV0Z3VpbGhlcm1lYyIsImEiOiJjbDdqdG5ybDExMWkzM3ZxdWduZGtzZThwIn0.qRSbsMGhyvkZBhRQtN9-ug';

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/letguilhermec/cl7jtcd8x002y14o6mgpd4npe', // style URL
  accessToken: 'pk.eyJ1IjoibGV0Z3VpbGhlcm1lYyIsImEiOiJjbDdqdG5ybDExMWkzM3ZxdWduZGtzZThwIn0.qRSbsMGhyvkZBhRQtN9-ug',
  scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds()

locations.forEach(location => {
  //  Create a marker
  const el = document.createElement('div')
  el.className = 'marker'

  //  Add the marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  }).setLngLat(location.coordinates).addTo(map)

  //  Add popup
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(location.coordinates)
    .setHTML(`<p>Day ${location.day}: ${location.description}`)
    .addTo(map)

  //  Extends the map bounds to include locations
  bounds.extend(location.coordinates)
})


map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
})
