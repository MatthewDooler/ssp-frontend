function setupScrollableTabContents() {
  var viewportWidth = $(window).width();
  var viewportHeight = $(window).height();
  var topOffset = $(".tab-content-scrollable").get(0).getBoundingClientRect().top;
  var bottomMargin = 0;
  $(".tab-content-scrollable").css("height", viewportHeight - topOffset - bottomMargin);
}

function updateOrderArrows() {
  $("table.server-list > thead > tr > th").each(function(i, el) {
    var order = $(el).data("order")
    if(order == "disabled") {
      $(el).find(".asc, .desc").hide();
      $(el).find(".disabled").show();
    } else if(order == "asc") {
      $(el).find(".asc").show();
      $(el).find(".disabled, .desc").hide();
    } else if(order == "desc") {
      $(el).find(".desc").show();
      $(el).find(".disabled, .asc").hide();
    }
  });
}

function sortServers(field) {
  // make sure sponsored servers always stay at the top
  servers.setSorting("-sponsored,"+field);
}

function orderToPrefix(order) {
  if(order == "asc") {
    return ""
  } else if(order == "desc") {
    return "-"
  }
}

function back(options) {
  if(typeof options !== 'undefined' && "destination" in options) {
    app.navigate(options.destination, {trigger: true});
  } else {
    history.go(-1);
  }
}