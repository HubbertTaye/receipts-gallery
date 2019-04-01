module.exports = function(app, passport, db) {
  app.get('/', function(req, res) {
      res.render('index.ejs');
  });

  //profile
  app.get('/profile', isLoggedIn, function(req, res) {
      db.collection('messages').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('profile.ejs', {
          user : req.user,
          messages: result
        })
      })
  });

//logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  //authentication
