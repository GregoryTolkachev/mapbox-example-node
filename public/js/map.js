mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JlZ2d0MTk5MyIsImEiOiJja250YTBvY3gwMHVoMm9tbWR2NXlreHhpIn0.fZhVNcwLkEPqoc5ML5Q5wQ';
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-75.83239034252583, 45.498142557294706], // starting position [lng, lat]
    zoom: 10 // starting zoom
});




let getHydrants = async () => {
    let req = await fetch("/api/hydrantsx");
    let data = await req.text();
    let parsed = new window.DOMParser().parseFromString(data, 'text/xml');

    let hydrants = parsed.querySelectorAll("GEOM");

    //console.log(hydrants.length);
    hydrants.forEach((el) => {
        let loc = el.innerHTML;
        // POINT (-75.738712 45.500612)
        loc = loc.substring(7, loc.length - 1).split(' ');
        //console.log(loc);

        var marker = new mapboxgl.Marker()
            .setLngLat([loc[0], loc[1]])
            .addTo(map);
    });


    // 
    //     console.log(el.innerHTML);
    // });


}

window.onload = async () => {
    getHydrants();
    let location = false;
    let tracker;
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((p) => {
            console.log(p.coords);
            location = true;
            map.setCenter({ lon: p.coords.longitude, lat: p.coords.latitude });
        });
    }

    if (!location) {
        // geolocation not available
        if ('geolocation' in navigator) {
            let allowGeo = await navigator.permissions.query({ name: 'geolocation' });
            if (allowGeo.state == "prompt") {
                allowGeo.onchange = (e) => {
                    if (e.target.state == "granted") {

                        //console.log(e);
                        navigator.geolocation.getCurrentPosition((p) => {
                            console.log(p.coords);
                            location = true;
                            map.setCenter({ lon: p.coords.longitude, lat: p.coords.latitude });
                        });

                    }
                };
            }
        }
        getServerGeo();
    };
};

let getServerGeo = async function () {
    var loc = await fetch("/api/geo");
    var jData = await loc.json();

    console.log(jData);
    map.setCenter({ lon: jData.longitude, lat: jData.latitude });
}