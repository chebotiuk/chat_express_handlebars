var User = require('models/user').User;
var HttpError = require('error').HttpError;
var AuthError = require('models/user').AuthError;
var ObjectId = require('mongodb').ObjectId;

module.exports = function(app) {
  app.get('/', function(req, res, next) {
    res.render('home', {
      userId: req.session.user,
      title: '<u>Hello, It is a first page on Node.js app</u>',
      condition: true,
      listArr: ['Test task from array 1', 'Test task from array 2', 'Test task from array 3']
    });
  });

  app.get('/login', function(req, res, next) {
    res.render('login');
  });
  app.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.authorize(username, password)
      .then(user => {
        req.session.user = user._id;
        res.send({});
      })
      .catch(err => {
        if (err) {
          if (err instanceof AuthError) {
            next(new HttpError(403, err.message));
            return
          } else {
            next(err)
            return
          }
        }
      })
  });

  app.get('/users', function(req, res, next) {
    User.find({}, function(err, users) {
      if (err) return next(err);
      res.json(users);
    });
  });

  app.get('/user/:id', function(req, res, next) {
    try {
      var id = new ObjectId(req.params.id);
    } catch (err) {
      next(new HttpError(404, 'User not found'));
      return;
    }

    User.findById(id, function(err, user) {
      if (err) {
        next(err);
        return;
      }

      if (!user) {
        next(new HttpError(404, 'User not found'));
        return
      }

      res.json(user);
    });
  });
};
