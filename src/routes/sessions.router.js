const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcryp.js");
const passport = require("passport");

///Version con Passport: 
router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}), async (req, res) => {
    if(!req.user) return res.status(400).send({status:"error"});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email:req.user.email
    };

    req.session.login = true;

    res.redirect("/profile");
})

router.get("/faillogin", async (req, res) => {
    res.send({error: "Error en el login"});
})

//Logout
router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

//Version de GitHub:

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}) ,async (req, res)=> {})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}) ,async (req, res)=> {
    //La estrategia de GitHub me va a retornar el usuario, entonces lo agregamos a nuestra session. 
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
})

module.exports = router;