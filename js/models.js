var Server = Backbone.Model.extend({

});

var Servers = Backbone.Collection.extend({
  model: Server,
  url: settings.apiEndpoint+'/servers.json'
});