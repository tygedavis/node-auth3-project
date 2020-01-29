const bcrypt = require('bcryptjs');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const restrictedMiddleware = require('../api/restricted-middleware');

const { jwtSecret } = require('../config/secrets.js');

const Users = require('../users/users-model.js');


router.post('/register', (req, res) => { //✔
  let user = req.body;

  const hash = bcrypt.hashSync(req.body.password, 8);

  user.password = hash;
  
  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err);
    });
});

router.post('/login', (req,res) => { //✔
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(password, user.password)) {

        const token = signToken(user)

        console.log(user)
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    })
    .catch(err => {
      console.log("Login error", err)
      res.status(500).json(err);
    });
});

router.get('/users', restrictedMiddleware, (req, res, next) => {
  console.log('GET success')
  Users.find()
    .then(users => { 
      res.status(200).json(users)
    })
    .catch(err => {
      res.status(401).json({ error: "Error with GET" })
    })
});

function signToken(user) {
  const payload = {
    userId: user.id,
    username: user.name,
    department: user.department
  };

  const options = {
    expiresIn: "1 minute"
  };

  return jwt.sign(payload, jwtSecret, options)
}


module.exports = router;