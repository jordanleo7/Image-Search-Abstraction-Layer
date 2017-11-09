module.exports = function(app, mongodb, mongoose, searchModel, fetch) {

  // Example query usage:
  // https://img-search-abstractionlayer.glitch.me/search/lolcats%20funny?offset=2
  // https://img-search-abstractionlayer.glitch.me/latest
  
  app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })
  
  //
  // Get 10 latest searches
  //
  app.get('/latest', function(req, res) {
    
    searchModel.find({}).limit(10).sort({time: -1}).select('-_id -__v').exec(function (err, results) {
      if (err) return err //handleError(err);
      console.log(results);
      res.send(results);
    });
        
  });
    
  //
  // Get Google Custom Search
  //
  app.get('/search/*', function(req, res) {
    // Get parameter values for Google custom search
    var searchQuery = req.query.q || req.params[0];
    var searchOffset = req.query.offset || 1;
    // Google custom search url 
    var url = 'https://www.googleapis.com/customsearch/v1?key=' + process.env.G_KEY + '&cx=' + process.env.CX + '&start=' + searchOffset + '&q=' + searchQuery;
    // Filtered search results will be pushed to here
    var results = [];
    // Use node-fetch to get search results
    fetch(url)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        // Google only allows 100 searches per day. If app doesn't start, check for this error in console log.
        console.log(json.error.errors[0].reason)
        for (var i = 0; i < 10; i++) {
          results.push({snippet: json.items[i].snippet, link: json.items[i].link, displayLink: json.items[i].displayLink });
        }
        res.send(results);
      
        //
        // Create search history document
        //
        var date = new Date();
        var newSearch = new searchModel({ search: searchQuery, time: date });
        newSearch.save(function (err) {
          if (err) return err;
        });
      
      }).catch(function(error) {
        console.log(error);
      });
    
  });
  
}