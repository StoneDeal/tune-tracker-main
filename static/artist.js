var model = {
    artistInfo: []
}

var api = {
    root: "http://ws.audioscrobbler.com/2.0/",
    token: "eeac2a521ed64a26c3d6d1217bdc4aa2"
}

function viewArtist(callback) {

      $.ajax({
        url: api.root,
        data: {
          limit: 20,
          method: "artist.getinfo",
          artist: getParameterByName('tag'),

        //  artist: getParameterByName('tag'),
          api_key: api.token,
        //  mbid: getParameterByName('artist'),
          format: "json"


        },


        success: function(response) {
          model.artistInfo = response;
          callback(response);
          console.log(model.artistInfo);
        }
      });
    }
console.log(model.artistInfo);
//console.log(model.artistInfo);
function render() {
    //if (model.artistInfo.length == 0) {
  //      model.
   // }
    if (model.artistInfo.error == 6) {
        $("#artist").empty();
        var errorP = "<h3>Sorry! We could not find that artist.</h3>"
        $('#artist').append(errorP);
    }
    else {
        $("#artist").empty();

        var href = "/profile?artist=" + model.artistInfo.artist.name;
        var title = "<h3><span id='pgheader'>" + model.artistInfo.artist.name + "</span></h3>";
        var image = "<img id='band-img' class='artist-img' src='static/media/cassetesingle.jpg'>";
                                                //model.artistInfo.artist.image[3]["#text"]
        var url = "<h4><a href='" + model.artistInfo.artist.url + "' target='_blank'><span id='pgheader'>Listen</span></a></h4>";
        var like = "<h4><a href='" + href + "'><span id='pgheader'>I Like This!</span></a></h4>";
        var artistSpan = $("<span></span>")
        .attr("class", "tag")
        .append(image)
        .append(title)
        .append(url)
        .append(like);

        $('#artist').append(artistSpan);
    }
}



function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


$(document).ready(function() {
    viewArtist(render);
  });