/**
 * Controller for everything related with points and routes
 */
const router = require('express').Router();

const io = require('../app');

/**
 * Requiered models
 */
const Route = require('../models/Route');
const Point = require('../models/Point');
const Shared = require('../models/SharedRoute')
const User = require('../models/User');

/**
 * Helpers
 */
const { isAuthenticated } = require('../helpers/auth');

/**
 * Vars
 */
let lastRouteId = "";

/**
 * domain/maps , and sends the user id to obtain route name 
 */
router.get('/maps', isAuthenticated, (req, res) => {
    res.render('maps/maps', { user: req.user.id });
});

/**
 * Stores point in data base in real time
 */
io.on('connection', function (socket) {
    socket.on('new point', async function (data) {
        const newPoint = new Point({
            routeId: lastRouteId, lat: data.latitude, lon: data.longitude, userId: data.user
        });
        await newPoint.save();
    });
});

/**
 * Stores route name in data base
 */
io.on('connection', function (socket) {
    socket.on('new route', async function (data) {
        const newRoute = new Route({ userId: data.user, name: data.name });
        await newRoute.save();
        lastRouteId = newRoute.id;
    });
});

/**
 * domain/allRoutes , and sends the routes that the user created to display them 
 */
router.get('/allRoutes', isAuthenticated, async (req, res) => {
    const route = await Route.find({ userId: req.user.id }).sort({ date: 'desc' });
    res.render('maps/allRoutes', { route });
});

/**
 * Delete Route
 */
router.delete('/routes/delete/:id', isAuthenticated, async (req, res) => {
    await Route.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Route Deleted Successfully');
    res.redirect('/allRoutes');
});

/**
 * domain/route , sends points to paint them in route
 */
router.get('/route/:id', isAuthenticated, async (req, res) => {
    var points = await Point.find({ routeId: req.params.id }).sort({ date: 'desc' });
    res.render('maps/route', { pointArray: JSON.stringify(points) });
});

/**
 * Send message when button stop is pressed
 */
router.get('/stop', isAuthenticated, async (req, res) => {
    req.flash('success_msg', 'Route Created Successfully');
    res.redirect('/allRoutes');
});

/**
 * domain/sharedRoutes , sends an array of routes to get points of the route and display them
 */
router.get('/sharedRoutes', isAuthenticated, async (req, res) => {
    var routeArray = []; //Routes shared with me
    const user = await User.findOne({ _id: req.user.id });
    const shared = await Shared.find({ viewers: user.username });
    if (shared.length >= 1) {
        //If someone has shared
        for (var i = 0; i < shared.length; i++) {
            const route = await Route.find({ _id: shared[i].route });
            routeArray.push(route);
        }
    }
    var newArr = []
    //Converts a 2D array into a 1D
    for (var i = 0; i < routeArray.length; i++) {
        newArr = newArr.concat(routeArray[i]);
    }
    res.render('maps/shared', { route: newArr });
});

/**
 * Share route
 */
router.get('/shareRoute/:id', isAuthenticated, async (req, res) => {
    var shared = new Shared();
    const username = req.query.username;
    const user = await User.findOne({ username: username });
    const routeUser = await Route.find({ viewers: username });
    const route = await Shared.find({ route: req.query.route });
    if (!username) {
        req.flash('error_msg', 'Type a username');
        res.redirect('/allRoutes');
    } else if (username == req.user.username) {
        req.flash('error_msg', 'You can not share a route with yourself. ');
        res.redirect('/allRoutes');
    } else if (!user) {
        req.flash('error_msg', 'Username does not exist.');
        res.redirect('/allRoutes');
    } else if (!routeUser) {
        req.flash('error_msg', 'This route has been already shared with that user.');
        res.redirect('/allRoutes');
    } else {
        if (route.length >= 1) {
            //If route was already shared
            Shared.update({ $push: { viewers: username } }); //Store new viewer in data base for the route
            req.flash('success_msg', 'Route shared');
            res.redirect('/allRoutes');
        } else {
            //Add new shared route to database
            shared.route = req.query.route;
            shared.viewers = username;
            shared.save();
            req.flash('success', 'Route shared');
            res.redirect('/allRoutes');
        }
    }
});


module.exports = router;
