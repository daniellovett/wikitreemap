const batchGeocode = async () => {

    const wikiTreeUrl = "https://api.wikitree.com/api.php?action=getAncestors&depth=10&key=Hougey-4"
    // $.get(wikiTreeUrl)
    // const wikiTreeUrl = "https://api.wikitree.com/api.php?action=getProfile&key=Hougey-4"
    const wtResponse = await fetch(wikiTreeUrl, {
        'referrer': '*',
        'method': 'GET',
        'mode': 'cors',
        // headers: {'origin': 'https://api.wikitree.com/'}
        // headers: {
        //     'Access-Control-Expose-Headers': true
        // },
        // 'mode': 'no-cors',
        // headers: {
        //   'method': 'GET'
        // }
        // credentials: 'include'
        // referrerPolicy: 'no-referrer-when-downgrade'
    });
    console.log(wtResponse.headers)
    const wtJson = await wtResponse.json();
    console.log(wtJson)

    const key = 'api_key';
    const locations = ['St. Louis, MO', 'San Francisco, CA']
    const locationStr = locations.join('&location=')

    const url = `http://www.mapquestapi.com/geocoding/v1/batch?key=${key}&location=${locationStr}`
    const response = await fetch(url);
    const responseJson = await response.json();
    // fetch(url).then(response => response.json().then(json => console.log(json)))
    return responseJson.results;
}

function init() {
    const map = L.map('leafletMap', {
        center: [45.52, -122.67],
        zoom: 1
    });

    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: "api_key"
    }).addTo(map);

    batchGeocode().then(results => {
        results.forEach(result => {
            let latLng = result.locations[0].latLng
            let location = [latLng.lat, latLng.lng]
            L.marker(location)
                .bindPopup(result.providedLocation.location)
                .addTo(map)
        })
        // console.log(results)
        // for (var i = 0; i < cities.length; i++) {
        //     var city = cities[i];
        //     L.marker(city.location)
        //         .bindPopup("<h1>" + city.name + "</h1> <hr> <h3>Population " + city.population + "</h3>")
        //         .addTo(myMap);
        // }
    })
}

window.addEventListener('DOMContentLoaded', init);


// userAction().then(results => console.log(results));

