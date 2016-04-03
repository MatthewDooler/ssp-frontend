var Server = Backbone.Model.extend({
  urlRoot: settings.apiEndpoint + '/servers',
  initialize: function() {
        this.updateDerivedAttributes();
        this.on('change:uptime', this.updateDerivedAttributes, this);
        this.on('change:downtime', this.updateDerivedAttributes, this);
        this.on('change:latency', this.updateDerivedAttributes, this);
  },
  updateDerivedAttributes: function() {
    this.set({
      uptime_percentage: Math.round(this.get("uptime") / (this.get("uptime")+this.get("downtime"))*100),
      latency_signal: this.latencyToSignal(this.get("latency")),
      description_formatted: this.formatDescription(this.get("description"))
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
  },
  formatDescription: function(description) {
    if(description) {
      return XBBCODE.process({
        text: description,
        removeMisalignedTags: false,
        addInLineBreaks: true
      }).html;
    } else {
      return undefined;
    }
  }
});

var Servers = Backbone.PageableCollection.extend({
  model: Server,
  /*url: settings.apiEndpoint + '/servers?client=106&sort=-sponsored,-uptime,-votes',*/
  /*url: settings.apiEndpoint + '/servers?client=106&sort=rank',*/

  url: settings.apiEndpoint + '/servers?client=106',

  queryParams: {
    sortKey: "sort"
  },

  initialize: function() {
    this.listenTo(this, "error", this.error);
  },

  error: function(collection, resp, options) {
    setTimeout(function() {
        collection.fetch();
    }, 10000);
  },

});

var User = Backbone.Model.extend({
  urlRoot: settings.apiEndpoint + '/user',
  toJSON: function() {
    return { user: _.clone( this.attributes ) }
  }
});