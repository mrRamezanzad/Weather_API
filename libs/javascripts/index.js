let data,
    list = $("#countries"),
    countryName = $("#country-name"),
    nativeName = $("#native-name"),
    capital = $("#capital"),
    region = $("#region"),
    population = $("#population"),
    language = $("#language"),
    timeZone = $("#time-zone"),
    flag = $("#flag"),
    callingCode = $("#calling-code"),
    countryMap = $("#map"),
    weatherIcon = $("#weather-icon"),
    weatherStatus = $("#weather-status"),
    wind = $("#wind"),
    temperature = $("#temperature"),
    humidity = $("#humidity"),
    visibility = $("#visibility"),
    accuweatherApi = "JAiG7cGRZ0CYEb5PYu9hsuoV1pafoyoL",
    openweatherApi = "c5110473efad96cff8ac4351d93a7d84"
mapboxgl.accessToken = 'pk.eyJ1Ijoia2V5c3RhciIsImEiOiJja2p0ejAyZWMxZ2F3MnpqeG85OXp4ZjlkIn0.IjKxMPO9emlxDrvZiqgZEQ';

$.ajax({
    type: "get",
    url: "https://restcountries.eu/rest/v2/all",
    data: "data",
    dataType: "json",
    success: function (response) {
        data = response
        loadCountries(response)

    }
})

function loadCountries(countries) {
    for (const country of countries) {
        // console.log(country);
        list.append(`
               <option value="${country.name}">${country.name}</option>
               ${country.name}`)
    }
}
$("#countries").change(function (e) {
    let selected = $("#countries").val()
    let country = data.find(el => el.name === selected)
    $.ajax({
        type: "get",
        url: `http://api.openweathermap.org/data/2.5/weather?q=${country.capital},${country.alpha2Code}&units=metric&appid=${openweatherApi}`,
        data: "data",
        dataType: "json",
        success: function (response) {
            console.log(country.capital)
            console.log(response);
            loadWeather(response)
        }
    });
    loadInfo(country)
})

function loadInfo(country) {
    console.log(country);
    countryName.text(country.name)
    nativeName.text(country.nativeName)
    capital.text(country.capital)
    region.text(country.region)
    population.text(`${country.population/1000000} million`)
    language.text("")
    for (const lan of country.languages) {
        language.append(`${lan.name}(${lan.nativeName})  `)
    }
    timeZone.text(country.timezones)
    flag.css({
        "background-image": `url("${country.flag}")`

    });
    callingCode.text(`+${country.callingCodes}`)
    console.log(country.latlng);

    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [country.latlng[1], country.latlng[0]], // starting position [lng, lat]
        zoom: 3, // starting zoom
       
    });
    new mapboxgl.Marker().setLngLat([country.latlng[1], country.latlng[0]]).addTo(map);


}

function loadWeather(weather) {
    console.log(weather.weather[0].icon);
    weatherStatus.text(`${weather.weather[0].description}`)
    wind.text(`${weather.wind.speed} m/s`)
    temperature.text(`${weather.main.temp}`).append("&deg;")
    humidity.text(`${weather.main.humidity}\%`)
    visibility.text(`${weather.visibility/1000} km`)
    weatherIcon.css({
        "background-image": `url( http://openweathermap.org/img/wn/${weather.weather[0].icon}.png)`
    })

}