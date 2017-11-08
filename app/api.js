module.exports = function(app, searchModel, request) {
  
  // Example query usage:
  // https://img-search-abstractionlayer.glitch.me/lolcats%20funny?offset=10
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

    request.get('https://www.googleapis.com/customsearch/v1?key=' + process.env.G_KEY + '&' + 'cx=' + process.env.CX + '&q=' + searchQuery, function (error, response, body) {
        if (!error && response.statusCode == 200) {

          var json = JSON.parse(body);
          
          
          
          res.send(body);
        

        }
      })



     
          
    
  });
  
  

  
}