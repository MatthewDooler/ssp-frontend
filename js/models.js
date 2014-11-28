var Server = Backbone.Model.extend({

});

var Servers = Backbone.Collection.extend({
  model: Server,
  url: settings.apiEndpoint + '/servers',

  initialize: function() {
    this.listenTo(this, "error", this.error);
  },

  error: function(collection, resp, options) {
    setTimeout(function() {
        collection.fetch();
    }, 10000);
  }

});