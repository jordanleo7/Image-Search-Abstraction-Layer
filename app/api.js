module.exports = function(app, searchModel, request, fetch) {

  // Example query usage:
  // https://img-search-abstractionlayer.glitch.me/lolcats%20funny?offset=2
  // https://img-search-abstractionlayer.glitch.me/latest
  // [ { "snippet": "", "url": "", "context": "", "thumbnail": "" } ]
  // latest: [ { "term": "", "when": "" } ] 
  
  // Get URL query parameter
  app.get('/*', function(req, res) {
    
    // parameter variable contains everything in URL after .me/
    var parameter = req.params[0];
    // Get time
    var date = new Date();
    
    // Create new document based on model
    var newSearch = new searchModel({ search: parameter, time: date });
    // Search parameter
    var searchQuery = 'cats';
    // Google custom search url 
    var url = 'https://www.googleapis.com/customsearch/v1?key=' + process.env.G_KEY + '&' + 'cx=' + process.env.CX + '&num=10&q=' + searchQuery;
    // Filtered results will be pushed to here
    var results = [];
    // Use node-fetch to get search results
    fetch(url)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        for (var i = 0; i < json.items.length; i++) {
          results.push({snippet: json.items[i].snippet, link: json.items[i].link, displayLink: json.items[i].displayLink });
        }
        res.send(results);
      }).catch(function(error) {
        console.log(error);
      });
    
  });
  
}