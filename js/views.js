var AuthControlView = Backbone.View.extend({
  el: ".auth-control",
  template: _.template( $('#tpl-auth-control').html()),

  events: {
    "click .logout": "logout"
  },

  initialize: function() {
    this.listenTo(this.model, "change", this.render);
    this.render();
  },

  render: function() {
    // TODO: what is the model? the user? the session? globally defined or attached to this view?
    console.log(this.model.toJSON())
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  logout: function() {
    // TODO: this only logs out the client. need to do a DELETE request to revoke the token
    Storage.delete("session")
    this.model.set({ id: null, authentication_token: null});
  }
});

var ServerTableRow = Backbone.View.extend({

  tagName: "tr",
  template: _.template( $('#tpl-server-row').html()),

  events: {
    "click": "open",
  },

  initialize: function() {
    this.listenTo(this.model, "change", this.render);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    if(this.model.get("sponsored") == 1) this.$el.addClass("sponsored");
    return this;
  },

  open: function() {
    app.navigate("servers/" + this.model.get("slug"), {trigger: true});
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

// A generic form view we can use around the website
var FormView = Backbone.View.extend({
  events: {
    "submit": "submit",
    "change": "change",
    "keyup": "change"
  },

  change: function(e) {
    setInputErrors($(e.target), [])
  },

  submit: function(e) {
    e.preventDefault();
    var model = this.model;
    var form = this.$el;

    // Update the model with the values from the form
    form.find('input').each(function(i, input) {
      model.set(input.getAttribute("name"), input.value);
    });

    var view = this;
    this.model.save(null, {
      success: function(model, result, xhr) {
        resetForm(form);
        view.success(model, result)
      },
      error: function(model, result, xhr) {
        resetInputErrors(form);
        errors = result.responseJSON;
        for (var field in errors) {
          input = form.find('input[name=\''+field+'\']');
          setInputErrors(input, errors[field]);
        }
      }
    });
  }
});

var SignUpForm = FormView.extend({
  initialize: function() {
    this.model = new User();
  },
  success: function(user, result) {
    // TODO: pass the user model into the user view (this would just be an optimisation, since the user view would usually load that itself)
    login(user);
    this.model = new User();
    // TODO: remove these log lines
    console.log("success");
    console.log(result);
    app.navigate("user", {trigger: true});
  }
});

var LogInForm = FormView.extend({
  initialize: function() {
    this.model = new Session();
  },
  success: function(session, result) {
    login(session);
    this.model = new Session();
    app.navigate("user", {trigger: true});
  }
});

function resetForm(form) {
  form.find("input").each(function(i, input) {
    input.value = "";
  });
  resetInputErrors(form);
}

function resetInputErrors(form) {
  form.find("input").each(function(i, input) {
    setInputErrors($(input), [])
  });
}

function setInputErrors(input, errors) {
  var formGroup = input.parent();
  var helpBlock = formGroup.find(".help-block")
  if(errors.length > 0) {
    formGroup.addClass("has-error");
    helpBlock.text(errors) // TODO: array to csv (and test it!!)
  } else {
    formGroup.removeClass("has-error");
    helpBlock.text("")
  }
}


