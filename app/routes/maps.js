/**
 * Controller for everything related with points and routes
 */
const router = require('express').Router();

/**
 * Requiered models
 */
const Route = require('../models/Route');
const Point = require('../models/Point');
const Shared = require('../models/SharedRoute');
const User = require('../models/User');

const docClient = require('../config/database');
const path = require("path");
const uuid = require("uuid/v4");
/**
 * Helpers
 */
const { isAuthenticated } = require('../helpers/auth');
var userPool = require('../helpers/cognito');
let lastRouteId = uuid();

/**
 * domain/maps , and sends the user id to obtain route name 
 */
router.get('/maps', (req, res) => {
    res.sendFile(path.join(__dirname + "/../public/views/maps/maps.html"));
});

router.get('/see/:id', (req, res) => {
    res.sendFile(path.join(__dirname + "/../public/views/maps/see.html"));
});

/**
 * domain/allRoutes , and sends the routes that the user created to display them 
 */
router.get('/allRoutes', async (req, res) => {
    res.sendFile(path.join(__dirname + "/../public/views/maps/allRoutes.html"));
});

router.post('/allRoutes', async(req, res) => {
    var id = req.body.id;
    console.log("ID ES", id);
    console.log(userPool.getCurrentUser());

    var params = {
        TableName : "Routes",
        IndexName : "userId-index",
        KeyConditionExpression: "#userId = :v_userId",
        ExpressionAttributeNames:{
            "#userId": "userId"
        },
        ExpressionAttributeValues: {
            ":v_userId": id//userPool.getCurrentUser().getUsername()
        }
    };
    
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            req.flash('error_msg', "Can't retrieve the routes");
            res.redirect("/");
        } else {
            res.send(data)
        }
    });
});

/**
 * Stores point in data base in real time
 */
router.post("/maps/guardarPunto", async (req, res) => {
    var params = {
        TableName: 'Points',
        Item: {
            _id: uuid(), lat: req.body.lat,
            lon: req.body.lon, routeId: req.body.routeId
        }
    }
    docClient.put(params, function (err, data) {
        if (err) console.log(err);
        else console.log(data);
    });
    res.redirect("/maps");
});

/**
 * Stores route name in data base
 */
router.post("/maps/crearRuta", async (req, res) => {
    var id = uuid();
    var params = {
        TableName: 'Routes',
        Item: {
            _id: id, name: req.body.name, userId: req.body.userId
        }
    }
    docClient.put(params, function (err, data) {
        if (err) console.log(err);
        else console.log(data);
    });
    res.send({_id: id});
});

/**
 * Delete Route
 */
router.delete('/routes/delete/:id'/*, isAuthenticated*/, async (req, res) => {
    await Route.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Route Deleted Successfully');
    res.redirect('/allRoutes');
});

/**
 * domain/route , sends points to paint them in route
 */
router.get('/route/:id'/*, isAuthenticated*/, async (req, res) => {
    console.log(req.params.id)
    /*var id = req.body.id;
    console.log("ID ES", id);
    console.log(userPool.getCurrentUser());*/

    var params = {
        TableName : "Points",
        IndexName : "routeId-index",
        KeyConditionExpression: "#routeId = :v_routeId",
        ExpressionAttributeNames:{
            "#routeId": "routeId"
        },
        ExpressionAttributeValues: {
            ":v_routeId": req.params.id
        }
    };
    console.log(params)
    
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            req.flash('error_msg', "Can't retrieve the points");
            res.redirect("/");
        } else {
            res.send(data)
        }
    });
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
