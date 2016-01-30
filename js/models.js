var Server = Backbone.Model.extend({
  initialize: function() {
        this.updateDerivedAttributes();
        this.on('change:uptime', this.updateDerivedAttributes, this);
        this.on('change:downtime', this.updateDerivedAttributes, this);
        this.on('change:latency', this.updateDerivedAttributes, this);
  },
  updateDerivedAttributes: function() {
    this.set({
      uptime_percentage: Math.round(this.get("uptime") / (this.get("uptime")+this.get("downtime"))*100),
      latency_signal: this.latencyToSignal(this.get("latency"))
    }, {silent:true});
  },
  latencyToSignal: function(latency) {
    if(latency == 0) {
      return 1
    } else if(latency <= 50) {
      return 5
    } else if(latency <= 100) {
      return 4
    } else if(latency <= 200) {
      return 3
    } else if(latency <= 250) {
      return 2
    } else {
      return 1
    }
  }
});

var Servers = Backbone.PageableCollection.extend({
  model: Server,
  url: settings.apiEndpoint + '/servers?client=106&sort=-uptime,-votes',

  initialize: function() {
    this.listenTo(this, "error", this.error);
  },

  error: function(collection, resp, options) {
    setTimeout(function() {
        collection.fetch();
    }, 10000);
  }

});