var AppRouter = Backbone.Router.extend({
    routes: {
        "": "viewServers",
        "add": "addServer",
        "privacy": "privacy",
        "tos": "tos",
        "cookies": "cookies",
        "signup": "signup",
        "servers": "viewServers",
        "servers/page/:page": "viewServersByPage",
        "servers/:slug": "viewServer",
        "*actions": "default"
    }
});

var app = new AppRouter;

app.on('route:privacy', function(slug) {
	$("<div/>").data("target", "#privacy-panel").tab('show');;
});

app.on('route:tos', function(slug) {
	$("<div/>").data("target", "#tos-panel").tab('show');;
});

app.on('route:cookies', function(slug) {
	$("<div/>").data("target", "#cookies-panel").tab('show');;
});

app.on('route:addServer', function() {
	$(".add-server-button").tab('show');
});

app.on('route:signup', function() {
	$(".modal").modal('hide');
	$(".signup-button").tab('show');
});

servers = new Servers;
sortServers("rank");
serverTable = new ServerTable({ collection: servers });

$("form.signup").each(function(i, form) {
	new SignUpForm({el: form});
})

app.on('route:viewServers', function() {
	servers.fetch();
	$(".view-server-list-button").tab('show');
});

app.on('route:viewServersByPage', function(page) {
	servers.getPage(parseInt(page));
	$(".view-server-list-button").tab('show');
});

app.on('route:viewServer', function(slug) {
	var button = $("<div/>").data("target", "#view-server-panel");
	var server = new Server({ id: slug });
	var serverView = new ServerView({ model: server });

	server.fetch({
		success: function(model, response, options) {
		 	$(button).tab('show');
		},
		error: function(model, response, options) {
			$("<div/>").data("target", "#not-found-error-panel").tab('show');
		}
	});
});

app.on('route:default', function(actions) {
	$("<div/>").data("target", "#not-found-error-panel").tab('show');
});

// TODO: pushState would let us use real urls - however the backend has to support it, and it doesn't work locally
Backbone.history.start();
//Backbone.history.start({pushState: true});