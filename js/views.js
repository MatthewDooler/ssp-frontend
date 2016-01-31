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

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    if(this.model.get("sponsored") == 1) this.$el.addClass("sponsored");
    return this;
  }
});

var EmptyServerTableRow = Backbone.View.extend({
  tagName: "tr",
  template: _.template( $('#tpl-empty-server-row').html()),
  render: function() {
    this.$el.html(this.template());
    return this;
  }
});

var ServerTable = Backbone.View.extend({

  tagName: "tbody",
  el: "#server-list-panel > table > tbody",

  initialize: function() {
    this.listenTo(this.collection, "sync", this.render);
    // TODO: add disabled since it gets called for every new server on sync
    //this.listenTo(this.collection, "add", this.render);
    //this.listenTo(this.collection, "remove", this.render);
    this.listenTo(this.collection, "reset", this.render);
    //this.listenTo(this.collection, "sort", this.render);
    this.listenTo(this.collection, "error", this.error);
  },

  error: function(collection, resp, options) {
    $("#site-error").show().animate({'top': '5px'}, 1000).html("Network error");
    setTimeout(function() {
      $("#site-error").fadeOut(function() {
        $(this).css('top', '-100px')
      });
    }, 5000);
  },

  render: function() {
    console.log("rendering entire server table")
    // TODO: fiddle with rows so we don't get a full refresh
    this.$el.html("");
    if(this.collection.length > 0) {
      this.collection.each(function(server){
          var row = new ServerTableRow({ model: server });
          this.$el.append(row.render().el);
      }, this);
    } else {
      var row = new EmptyServerTableRow({ model: null });
      this.$el.append(row.render().el);
    }

    if(this.collection.hasPreviousPage()) {
      $(".prev-button").toggleClass("disabled", false);
    } else {
      $(".prev-button").toggleClass("disabled", true);
    }

    return this;
  }

});











var ServerMoreInfoView = Backbone.View.extend({

  tagName: "div",
  template: _.template( $('#tpl-server-more-info').html()),

  events: {
    "click .icon":          "open",
    "click .button.edit":   "openEditDialog",
    "click .button.delete": "destroy"
  },

  initialize: function() {
    this.listenTo(this.model, "change", this.render);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

