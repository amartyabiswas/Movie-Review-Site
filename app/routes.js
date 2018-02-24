module.exports = function(app, passport) {

    var path = require('path');
    var mongoose = require('mongoose');
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost/moviebase";
    mongoose.connect('mongodb://localhost/moviebase');
    console.log('DB connected...');

    var bookSchema = mongoose.Schema({
        id: String,
        title: String,
        description: String,
        cover: String,
        rating: String
    });

    var user = mongoose.model('Movies', bookSchema);

    app.get('/', function (req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    app.get('/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/profile', // redirect to the secure profile section
            failureRedirect: '/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }),
        function (req, res) {

            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        });

    app.get('/signup', function (req, res) {
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });

    app.get('/profile', function (req, res) {

        // Creating a guest session...
        var request = require("request");
        var options = { method: 'GET',
            url: 'https://api.themoviedb.org/3/authentication/guest_session/new',
            qs: { api_key: '8e3dd169bad902aaf9361c58f5e38996' },
            body: '{}'
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
        });

        //Get the now playing movies...
        var option = { method: 'GET',
            url: 'https://api.themoviedb.org/3/movie/now_playing',
            qs:
                { page: '1',
                    language: 'en-US',
                    api_key: '8e3dd169bad902aaf9361c58f5e38996'
                },
            body: '{}'
        };

        request(option, function (error, response, body) {
            if (error) throw new Error(error);
            var movieData=JSON.parse(body);
            res.render('profile.ejs', {movieData: movieData});
        });
    });

    app.get('/browse', function (req, res) {
        //Sending the information of now playing movies....
        var request = require("request");

        var options = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/movie/now_playing',
            qs: {page: '1', language: 'en-US', api_key: '8e3dd169bad902aaf9361c58f5e38996'},
            body: '{}'
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            // console.log(body);
            var movieData = JSON.parse(body);
            res.render('browse.ejs', {movieData: movieData});
        });

    });

    app.post('/search', function (req, res) {
        var query = JSON.stringify(req.body.searchBox);

        var request = require("request");
        var options = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/search/movie',
            qs:
                {
                    include_adult: 'false',
                    page: '1',
                    query: query,
                    language: 'en-US',
                    api_key: '8e3dd169bad902aaf9361c58f5e38996'
                },
            body: '{}'
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var movieData = JSON.parse(body);
            res.render('search.ejs', {movieData: movieData});
        });
    });

    app.post('/discover', function (req, res) {
        var correct = JSON.stringify(req.body.genre);
        var query = correct.substring(1, correct.length - 1);
        //console.log(correct);
        var genreId = 0;

        if (query === "Action") {
            genreId = 28;
        } else if (query === "Adventure") {
            genreId = 12;
        } else if (query === "Animation") {
            genreId = 16;
        } else if (query === "Comedy") {
            genreId = 35;
        } else if (query === "Crime") {
            genreId = 80;
        } else if (query === "Documentary") {
            genreId = 99;
        } else if (query === "Drama") {
            genreId = 18;
        } else if (query === "Family") {
            genreId = 10751;
        } else if (query === "Fantasy") {
            genreId = 14;
        } else if (query === "Horror") {
            genreId = 27;
        } else if (query === "History") {
            genreId = 36;
        } else if (query === "Musical") {
            genreId = 10402;
        } else if (query === "Mystery") {
            genreId = 9648;
        } else if (query === "War") {
            genreId = 10752;
        } else if (query === "Sci-Fi") {
            genreId = 878;
        } else if (query === "Romance") {
            genreId = 10749;
        } else if (query === "Western") {
            genreId = 37;
        }
        console.log(genreId);
        var request = require("request");

        var options = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/genre/' + genreId + '/movies',
            qs:
                {
                    sort_by: 'created_at.desc',
                    include_adult: 'false',
                    page: '1',
                    language: 'en-US',
                    api_key: '8e3dd169bad902aaf9361c58f5e38996'
                },
            body: '{}'
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var movieData = JSON.parse(body);
            //console.log(movieData);
            res.render('discover.ejs', {movieData: movieData});
        });
    });

    app.get('/latest', function (req, res) {
        var request = require("request");

        var options = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/discover/movie',
            qs:
                {
                    page: '4',
                    include_video: 'true',
                    include_adult: 'false',
                    sort_by: 'release_date.desc',
                    language: 'en-US',
                    api_key: '8e3dd169bad902aaf9361c58f5e38996'
                },
            body: '{}'
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var movieData = JSON.parse(body);
            res.render('commonPage.ejs', {movieData: movieData});
        });
    });

    app.get('/oldest', function (req, res) {
        var request = require("request");

        var options = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/discover/movie',
            qs:
                {
                    page: '3',
                    include_video: 'true',
                    include_adult: 'false',
                    sort_by: 'release_date.asc',
                    language: 'en-US',
                    api_key: '8e3dd169bad902aaf9361c58f5e38996'
                },
            body: '{}'
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var movieData = JSON.parse(body);
            res.render('commonPage.ejs', {movieData: movieData});
        });
    });

    app.get('/popular', function (req, res) {
        var request = require("request");

        var options = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/discover/movie',
            qs:
                {
                    page: '1',
                    include_video: 'true',
                    include_adult: 'false',
                    sort_by: 'popularity.desc',
                    language: 'en-US',
                    api_key: '8e3dd169bad902aaf9361c58f5e38996'
                },
            body: '{}'
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var movieData = JSON.parse(body);
            res.render('commonPage.ejs', {movieData: movieData});
        });
    });

    app.get('/money', function (req, res) {
        var request = require("request");

        var options = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/discover/movie',
            qs:
                {
                    page: '1',
                    include_video: 'true',
                    include_adult: 'false',
                    sort_by: 'revenue.desc',
                    language: 'en-US',
                    api_key: '8e3dd169bad902aaf9361c58f5e38996'
                },
            body: '{}'
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var movieData = JSON.parse(body);
            res.render('commonPage.ejs', {movieData: movieData});
        });
    });

    app.get('/rating', function (req, res) {
        var request = require("request");

        var options = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/discover/movie',
            qs:
                {
                    page: '1',
                    include_video: 'true',
                    include_adult: 'false',
                    sort_by: 'vote_count.desc',
                    language: 'en-US',
                    api_key: '8e3dd169bad902aaf9361c58f5e38996'
                },
            body: '{}'
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var movieData = JSON.parse(body);
            res.render('commonPage.ejs', {movieData: movieData});
        });
    });

    app.get('/details/:id', function (req, res) {
        var id = req.params.id;

        // A number of get Requests to find the details

        var request = require("request");
        var options = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/movie/' + id,
            qs:
                {
                    language: 'en-US',
                    api_key: '8e3dd169bad902aaf9361c58f5e38996'
                },
            body: '{}'
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var info = JSON.parse(body);

            var option = {
                method: 'GET',
                url: 'https://api.themoviedb.org/3/movie/' + id + '/videos',
                qs:
                    {
                        language: 'en-US',
                        api_key: '8e3dd169bad902aaf9361c58f5e38996'
                    },
                body: '{}'
            };

            request(option, function (error, response, body) {
                if (error) throw new Error(error);
                var video = JSON.parse(body);

                var crediting = {
                    method: 'GET',
                    url: 'https://api.themoviedb.org/3/movie/' + id + '/credits',
                    qs: {
                        api_key: '8e3dd169bad902aaf9361c58f5e38996'
                    },
                    body: '{}'
                };

                request(crediting, function (error, response, body) {
                    if (error) throw new Error(error);
                    var credit = JSON.parse(body);

                    var final = {
                        method: 'GET',
                        url: 'https://api.themoviedb.org/3/movie/' + id + '/recommendations',
                        qs:
                            {
                                page: '1',
                                language: 'en-US',
                                api_key: '8e3dd169bad902aaf9361c58f5e38996'
                            },
                        body: '{}'
                    };

                    request(final, function (error, response, body) {
                        if (error) throw new Error(error);
                        var recommend = JSON.parse(body);
                        res.render("details.ejs", {
                            Movie: info,
                            Video: video,
                            Credit: credit,
                            Recommend: recommend,
                            layout: false,
                            session: req.session
                        });
                    });
                });
            });
        });
    });
    
    app.get('/remove/:id', function (req, res) {
        var id=req.params.id;

        var request = require("request");

        var options = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/movie/' + id,
            qs:
                {
                    language: 'en-US',
                    api_key: '8e3dd169bad902aaf9361c58f5e38996'
                },
            body: '{}'
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var movieData = JSON.parse(body);

            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var myquery = { id: movieData.id };

                db.collection("movies").deleteOne(myquery, function(err, obj) {
                    if (err) throw err;
                    console.log("Document Deleted");
                    db.close();
                    secondCallback();
                });
            });
        });

        function secondCallback() {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                db.collection("movies").find({}).toArray(function(err, result) {
                    if (err) throw err;
                    res.render('favourites.ejs', {print: result});
                    db.close();
                });
            });
        }
    });

    app.get('/fav/:id', function (req, res) {
        var id = req.params.id;

        var request = require("request");

        var options = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/movie/' + id,
            qs:
                {
                    language: 'en-US',
                    api_key: '8e3dd169bad902aaf9361c58f5e38996'
                },
            body: '{}'
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var movieData = JSON.parse(body);

            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var myobj = {
                    id: movieData.id,
                    title: movieData.title,
                    description: movieData.overview,
                    cover: movieData.poster_path,
                    rating: movieData.vote_average
                };

                db.collection("movies").insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    console.log('Document Inserted');
                    db.close();
                    firstCallback();
                });
            });
        });
        
        function firstCallback() {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                db.collection("movies").find({}).toArray(function(err, result) {
                    if (err) throw err;
                    res.render('favourites.ejs', {print: result});
                    db.close();
                });
            });
        }
    });


    app.get('/favourites', function (req, res) {
        user.find({}, function (err, data) {
            if (err) {
                console.log(err);
            }
            res.render('favourites.ejs', {print: data});
        });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/login', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};


// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
