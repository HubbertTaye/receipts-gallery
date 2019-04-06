module.exports = function(app, passport, multer, db, ObjectId) {

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb){
    cb(null, `${file.fieldname}-${Date.now()}.png`)
  }
})
var upload = multer({storage: storage})

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('receipts').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            receipts: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/receipts', upload.single('image'), (req, res, next) => {
      insertDocuments(db, req, `uploads/${req.file.filename}`, () =>{
          db.collection('receipts').insertOne({date: req.body.date, img: req.file.filename, desc:      req.body.desc, star: false}, (err, result) => {
          if (err) return console.log(err)
          console.log('saved to database')
          res.redirect('/profile')
        })
      })
    })

    const insertDocuments = function(db, req, filePath, callback){
      var collection = db.collection('users');
      var uId = ObjectId(req.session.passport.user)
      collection.findOneAndUpdate({"_id": uId}, {
        $set: {
          profileImg: filePath
        }
      }, {
       sort: {_id: -1},
       upsert: false
      }, (err, result) => {
       if (err) return res.send(err)
       callback(result)
    })
  }

    app.put('/important', (req, res) => {
      db.collection('receipts')
      .findOneAndUpdate({date: req.body.date, img: req.body.img, desc: req.body.desc}, {
        $set: {
          star: true
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.put('/unImportant', (req, res) => {
      db.collection('receipts')
      .findOneAndUpdate({date: req.body.date, img: req.body.img, desc: req.body.desc}, {
        $set: {
          star: false
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.delete('/receipts', (req, res) => {
      db.collection('receipts').findOneAndDelete({date: req.body.date, img: req.body.img, desc: req.body.desc}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Receipt deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
