// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms
// Called automatically when JavaScript client library is loaded.
var html = "";
var clave = 'AIzaSyAvMwJrYgnwyepvkDhCHBXOgi49clWWM7M';
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
    var numResultados = document.getElementById('resultados').value;
   // console.log(Number(numResultados));
        var request = gapi.client.youtube.search.list({
            part: 'snippet',
            type: 'video',
            q: query,
            maxResults: numResultados,
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
            //var canal = itemd.snippet.channelTitle;
            var fecha = itemd.snippet.publishedAt;
            
            html += '<div><iframe src=\"//www.youtube.com/embed/' + id_video + '\" allowfullscreen width="600" height="400"></iframe>';
            html += '<h3>Titulo del Video: </h3>' + titulo_video;
            html += '<h4>Fecha de Subida: </h4>' + moment(fecha).format('DD/MM/YYYY');
            html += '<h4>Localización</h4>';
            if(item.recordingDetails) {
                try {
                    var latitud = item.recordingDetails.location.latitude;
                    var longitud = item.recordingDetails.location.longitude;
                    if(latitud == undefined || longitud == undefined){
                        html +='<h5>Esta busqueda no tiene latitud y longitud</h5>';
                    }else{
                        html += '<h5>Latitud: </h5>' + latitud;
                        html += '<h5>Longitud: </h5>' + longitud + '</div>'; 
                        var ruta = 'https://maps.googleapis.com/maps/api/staticmap?zoom=20&size=700x600&maptype=roadmap&markers=color:green%7Clabel:L%7C'+latitud+','+longitud+'&key='+clave;
                        html +=  '<div class="mapa">'
                        +'<img src='+ruta+'>'
                        +'</div>';

                    }
                } catch(err) {
                    
                }
            }else
                html +='<h5>Esta busqueda no tiene latitud y longitud</h5>';
                
            
            html +='<hr>';
        }
        document.getElementById('info').innerHTML = html;
    });
}