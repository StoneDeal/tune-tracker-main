var artistMbids = [];
$('li').each(function() {
    artistMbids.push( $(this).text() );
  });;
console.log(artistMbids);
if (artistMbids.length == 0) {
    $('#no-artists').append("<span id='pgheader'>Go like some artists!</span>");
}

artistMbids.forEach(function(artistMbid) {


    var model = {
        artistInfo: []
    }

    var api = {
        root: "http://ws.audioscrobbler.com/2.0/",
        token: "eeac2a521ed64a26c3d6d1217bdc4aa2"
    }

function likedArtists(callback) {

    $.ajax({
    url: api.root,
    data: {
        limit: 20,
        method: "artist.getinfo",
        artist: artistMbid,
        api_key: api.token,
        format: "json"


    },
    success: function(response) {
        model.artistInfo = response
        callback(response);
        console.log(model.artistInfo);
    }
    });
}

function render() {

    var title = "<h4><span id='pgheader'>" + model.artistInfo.artist.name + "</span></h4>";
    var image = "<img id='band-img' class='home-img' src='static/media/cassetesingle.jpg'>";
                                                        //" + model.artistInfo.artist.image[2]["#text"] + "
    var listen = "<a href='" + model.artistInfo.artist.url + "'><h5><span id='pgheader'>Listen</span></h5></a>";
    var remove = "<form method='POST' action='/unlike-artist'><input type='hidden' name='artist-id' value='" + artistMbid +"' /><button type='submit' class='btn'>Remove</button></form>";

    var artistSpan = $("<span></span>")
    .attr("class", "tag")
    .append(image)
    .append(title)
    .append(listen)
    .append(remove);

    $('#artist').append(artistSpan);
}

$(document).ready(function() {
    likedArtists(render);
  });

});