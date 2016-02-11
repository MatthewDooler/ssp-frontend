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

    var slug = this.model.get("slug");
    this.$el.click(function() {
        // TODO: make sure we don't re-attach handlers to old elements when we're doing fancy re-rendering
        console.log("handling view-server click for " + slug);
        app.navigate("servers/"+slug, {trigger: true});
    });

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
  el: "#server-list-panel table.server-list > tbody",

  initialize: function() {
    this.listenTo(this.collection, "sync", this.render);
    // TODO: add is disabled since it gets called for every new server on sync
    // TODO: on add, find adjacent server and append/prepend the row
    // TODO: on delete, find by id and delete the row
    //this.listenTo(this.collection, "add", this.render);
    //this.listenTo(this.collection, "remove", this.render);
    this.listenTo(this.collection, "reset", this.render);
    this.listenTo(this.collection, "sort", this.render);
    this.listenTo(this.collection, "error", this.error);
  },

  error: function(collection, resp, options) {
    flashSiteError("Network error");
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

var ServerView = Backbone.View.extend({

  tagName: "div",
  template: _.template( $('#tpl-view-server').html()),
  el: "#view-server-panel > #view-server-panel-content",

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
    setupScrollableTabContents(); // make sure our new scrolly div has the correct height
    return this;
  }
});

function flashSiteError(e) {
  $("#site-error").show().animate({'top': '5px'}, 1000).html(e);
  setTimeout(function() {
    $("#site-error").fadeOut(function() {
      $(this).css('top', '-100px')
    });
  }, 5000);
}

