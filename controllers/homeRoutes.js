const router = require('express').Router();
const { User, Post } = require('../models');
const withAuth = require('../utils/auth');

router.get('/content', withAuth, async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']],
    });

    const users = userData.map((project) => project.get({ plain: true }));

    res.render("homepage", {
      users,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('login');

});

//get all posts
router.get("/", (req, res) => {
  Post.findAll({
    include: [{
      model: User,
      attributes: {
        exclude: ["password"]
      }
    }]
  }).then(dbPosts => {
    if (dbPosts.length) {
      const posts = dbPosts.map((project) => project.get({ plain: true }));

      res.render('homepage', {
        posts,
      })
    } else {
      res.status(404).json({ message: "No posts found in db" })
    }
  }).catch(err => {
    console.log(err)
    res.status(500).json({ message: "An error occured getting all posts", err: err })
  });
});

// get all posts by a single user
router.get("/profile", (req, res) => {
  Post.findAll({
    where: {
      user_id: req.session.user_id
    },
  }).then(userPosts => {
    // res.json(userPosts)
    if (userPosts) {
      const posts=userPosts.map((project)=> project.get({plain: true}));
      res.render('homepage', {posts})
    } else {
      res.status(404).json({ message: "No users found in db" })
    }
  }).catch(err => {
    console.log(err)
    res.status(500).json({ message: "An error occured", err: err })
  });
});

module.exports = router;