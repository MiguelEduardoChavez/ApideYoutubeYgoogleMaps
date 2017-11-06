// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms
// Called automatically when JavaScript client library is loaded.
var html = "";

//var texto = contenido.replace(/<[^>]*>?/g, '');;

function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}
// Called automatically when YouTube API interface is loaded (see line 9).
function onYouTubeApiLoad() {
    gapi.client.setApiKey('AIzaSyAvMwJrYgnwyepvkDhCHBXOgi49clWWM7M');
}

// Called when the search button is clicked in the html code
function search() {
    var query = document.getElementById('query').value;
    //var contenido = document.getElementById('info');
    console.log(query);

        var request = gapi.client.youtube.search.list({
            part: 'snippet',
            type: 'video',
            q: query,
            maxResults: 10,
            order: 'videoCount'
        });

        request.execute(onSearchResponse);
 
}
// Triggered by this line: request.execute(onSearchResponse);


function onSearchResponse(response) {
    //var responseString = JSON.stringify(response, '', 2);
    var contenido = document.getElementById('info');
    console.log(contenido);
    contenido = "";
    document.getElementById('info').innerHTML = contenido;
    html = "";

    for (var i in response.items) {
        var item = response.items[i];
        ubicacion(item);
    }
    //document.getElementById('response').innerHTML = responseString;
}

function ubicacion(itemd) {
    var request = gapi.client.youtube.videos.list({
        part: 'recordingDetails',
        id: itemd.id.videoId
    });

    request.execute(function (response) {
        for (var i in response.items) {
            var item = response.items[i];
            var titulo_video = itemd.snippet.title;
            var id_video = itemd.id.videoId;
            var canal = itemd.snippet.channelTitle;
            var fecha = itemd.snippet.publishedAt;
            html += '<div><p><iframe src=\"//www.youtube.com/embed/' + id_video + '\" allowfullscreen width="200" height="80"></iframe></p>';
            html += '<p><h3>Titulo del Video: </h3>' + titulo_video + '</p>';
            html += '<p><h4>Nombre del Canal: </h4>' + canal + '</p>';
            html += '<p><h4>Fecha de Subida: </h4>' + fecha + '</p>';
            if(item.recordingDetails) {
                try {
                    html += '<p><h4>Localización</h4></p>';
                    var latitud = item.recordingDetails.location.latitude;
                    var longitud = item.recordingDetails.location.longitude;
                    html += '<p><h5>Latitud: </h5>' + latitud + '</p>';
                    html += '<p><h5>Longitud: </h5>' + longitud + '</p></div>';
                } catch(err) {
                    
                }
            }
            html +='<hr>';
        }
        document.getElementById('info').innerHTML = html;
    });
}