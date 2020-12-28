const searchForm = $(`#searchForm`);
const searchBtn = $(`#searchBtn`);
const searchVal = $(`#searchLocation`)

var cityList = [];
var weatherAPIKey = `e1e7a51f8e49f8c421e774a281377b83`;



searchBtn.click(function() {
    searchForm.submit(function(event) {
        event.preventDefault();
        var city = searchVal.val();
        $(`#city`).text(`City Name: ${city}`)
        var weatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherAPIKey}`;
        
        getResponse()

        function getResponse() {
            $.ajax({
                url: weatherURL,
                method: `GET`
            })
            .then(function(response) {

            })
        }
    })
})

