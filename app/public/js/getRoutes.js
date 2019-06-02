var url = "/allRoutes";
id = {id: "testUser"} // Adaptar a cognito.

$.post(url, id, function (data, status) {
    data.Items.forEach(route => {
        $("#routeRow").append("<div class='col-sm-3'><div class='card'><div class='card-body'>" +
            "<h5 class='card-title'>" + route.name + "</h5>" +
            "<div class='btn-group btn-group' role='group' aria-label=" + route.name + ">"+
            "<a href='/see/"+ route._id+"' class='btn btn-primary'>See</a>" +
            "<a href='/routes/delete/" +route._id+"' class='btn btn-danger'>Delete</a>" +
            "</div>"+
            "</div></div></div>");
    });
});



