var loggedIn = true;
console.log(loggedIn);
if (loggedIn) {
    $("#loggedIn").addClass("disable");
    $("#loggedOut").addClass("enable");   
} else {
    $("#loggedIn").addClass("enable");
    $("#loggedOut").addClass("disable");   
}
