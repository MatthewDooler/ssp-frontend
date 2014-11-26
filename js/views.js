var ServerTableRow = Backbone.View.extend({

  tagName: "tr",
  template: _.template( $('#tpl-server-row').html()),

  events: {
    "click .icon":          "open",
    "click .button.edit":   "openEditDialog",
    "click .button.delete": "destroy"
  },

  initialize: function() {
    this.listenTo(this.model, "change", this.render);
  },

  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

var ServerTable = Backbone.View.extend({

  tagName: "tbody",
  el: "#server-table > tbody",

  render: function(){
      this.collection.each(function(server){
          var row = new ServerTableRow({ model: server });
          this.$el.append(row.render().el);
      }, this);
      return this;
  }

});