module.exports = function(app, searchModel, request, fetch) {

  // Example query usage:
  // https://img-search-abstractionlayer.glitch.me/lolcats%20funny?offset=2
      // FreeCodeCamp Answer: [ { "snippet": "", "url": "", "context": "", "thumbnail": "" } ]
  
  // https://img-search-abstractionlayer.glitch.me/latest
      // latest: [ { "term": "", "when": "" } ] 
  
  app.get('/latest', function(req, res) {
    res.send('latest');
  });
  
  // Get URL query parameter
  app.get('/*', function(req, res) {
    // Get parameter values for Google custom search
    var searchQuery = req.query.q || req.params[0];
    var searchOffset = req.query.offset || 1;
    console.log('search: ' + searchQuery + ', offset: ' + searchOffset);
    // Google custom search url 
    var url = 'https://www.googleapis.com/customsearch/v1?key=' + process.env.G_KEY + '&cx=' + process.env.CX + '&start=' + searchOffset + '&q=' + searchQuery;
    // Filtered search results will be pushed to here
    var results = [];
    // Use node-fetch to get search results
    fetch(url)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        for (var i = 0; i < 10; i++) {
          results.push({snippet: json.items[i].snippet, link: json.items[i].link, displayLink: json.items[i].displayLink });
        }
        res.send(results);
      }).catch(function(error) {
        console.log(error);
      });
    
    // Create search history document
    var date = new Date();
    var newSearch = new searchModel({ search: searchQuery, time: date });


  });
  
}