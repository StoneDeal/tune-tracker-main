var model = {
    popularArtists: []
}

var api = {
    root: "http://ws.audioscrobbler.com/2.0/",
    token: "eeac2a521ed64a26c3d6d1217bdc4aa2"
}

var searchMethod = "chart.getTopArtists"

function popularArtists(callback) {

      $.ajax({
        url: api.root,
        data: {
          limit: 28,
          method: searchMethod,
          api_key: api.token,
          format: "json"


        },
        success: function(response) {
          model.popularArtists = response
          callback(response);
          console.log(model.popularArtists.artists.artist);
        }
      });
    }

//popularArtists()

function render() {

      $("#popular-artists").empty();

      //var artists = JSON.parse(model.popularArtists.artists.artist);
      /*
      for (var artist in model.popularArtists.artists.artist) {
        var title = "<li>" + model.popularArtists.artists.artist + "</li>"
        $('#popular-artists').append(title)
      }
      */
      //var x = 0;

      model.popularArtists.artists.artist.forEach(function(artist) {
        //x++;
        //var xString = x.toString();
        //var artistSpan = "<span id='artist" + xString + "></span>";

        //var artistUrl = artist.url
        /*
        $("<a id='artist-link'></a>")
        .attr("href", artistUrl);
        $('#popular-artists').append(artistUrl);
        */
        //if (artist.mbid == "") {
        var artistHref = "/artist?tag=" + artist.name;
        //}
        //else {
        //  var artistHref = "/artist?artist=" + artist.mbid;
        //}

        var title = "<br/><h6><a id='artist-name' href='" + artistHref + "'><span id='pgheader'>" + artist["name"] + "</span></a></h6>";
        //var image = "<img src='" + artist.image[0].text + "' />"
        var image = "<a href='" + artistHref + "'>" + "<img id='band-img' class='home-img' src='static/media/cassetesingle.jpg'>" + "</a>"; //artist.image[2]["#text"]
                                                                        //+ artist.image[2]["#text"] +

        var artistSpan = $("<span></span>")
        .attr("class", "tag")
        .append(image)
        .append(title);

        //$('band-img').attr("href", artistUrl);

        $('#popular-artists').append(artistSpan);
        //$('#band-img').attr("href", artistHref);

        //var artistId = "artist" + xString;
        //$('#popular-artists').append(image);
        //$('#popular-artists').append(title);
        //$('#band-img').attr("src", "https://lastfm-img2.akamaized.net/i/u/174s/81d5e41b894042efb6798ea312878612.png")
      });
    }


    $(document).ready(function() {
      popularArtists(render);
    });
