var html = "";
var clave = 'AIzaSyAvMwJrYgnwyepvkDhCHBXOgi49clWWM7M';

function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}
function onYouTubeApiLoad() {
    gapi.client.setApiKey('AIzaSyAvMwJrYgnwyepvkDhCHBXOgi49clWWM7M');
}
function validar(){
    html ="";
    document.getElementById('errores').innerHTML = html;
    var numResultados = document.getElementById('resultados').value;
    numResultados = Number(numResultados);
    console.log(numResultados);
    if(numResultados <0 || numResultados>50){
        
        html += '<div class="alert alert-danger">Busqueda por default, para la proxima introduce un numero mayor a 0 y menor a 50</div>';
        document.getElementById('errores').innerHTML = html;
        numResultados = 5;
    }
    return numResultados;
}

function search() {
    var query = document.getElementById('query').value;
    var numR = validar();
        var request = gapi.client.youtube.search.list({
            part: 'snippet',
            type: 'video',
            q: query,
            maxResults: numR,
            order: 'videoCount'
        });

        request.execute(onSearchResponse);
 
}


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
            html += '<div class="row"><div class="col-md-6">';
            //contenido del video
            html += '<iframe src=\"//www.youtube.com/embed/' + id_video + '\" allowfullscreen width="600" height="400"></iframe>';
            html += '<h3>Titulo del Video: </h3>' + titulo_video;
            html += '<h4>Fecha de Subida: </h4>' + moment(fecha).format('DD/MM/YYYY');
            html += '<hr class="hr-danger"/><hr></div>';//fin del contenedir del video

            //contenido del mapa
            html += '<div class="col-md-6">';
          //  html += '<h4>Localización</h4>';
            if(item.recordingDetails) {
                try {
                    var latitud = item.recordingDetails.location.latitude;
                    var longitud = item.recordingDetails.location.longitude;
                    if(latitud == undefined || longitud == undefined){
                        html += '<div class="alert alert-danger"><h5>Esta busqueda no tiene latitud y longitud</h5></div>';
                    }else{
                        
                        var ruta = 'https://maps.googleapis.com/maps/api/staticmap?zoom=20&size=600x400&maptype=roadmap&markers=color:green%7Clabel:L%7C'+latitud+','+longitud+'&key='+clave;
                        html +='<img src='+ruta+'>' ;
                        html += '<h5>Latitud: </h5>' + latitud;
                        html += '<h5>Longitud: </h5>' + longitud ; 

                    }
                } catch(err) {
                    
                }
            }else
                html +='<div class="alert alert-danger"><h5>Esta busqueda no tiene latitud y longitud</h5></div>';
            html +='</div></div>';//fin de bloque de una busqued
            
            
        }
        document.getElementById('info').innerHTML = html;
    });
}