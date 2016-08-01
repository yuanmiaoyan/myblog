var express = require('express');
var util=require('../util');
var auth=require('../middle');
var router = express.Router();


//reg
router.get('/reg',auth.checkNotLogin, function(req, res) {
  res.render('user/reg',{title:"注册"});
});
router.post('/reg',auth.checkNotLogin, function(req, res) {
  var user=req.body;
  if(user.password != user.repassword){
    req.flash("error","密码和重复密码不一致")
    return res.redirect("back");
  }
  user.password=util.md5(user.password);
  /*user.avatar="https://secure.gravatar.com/avatar/"+util.md5(user.email)+"?s=25";*/
  user.avatar="https://s.gravatar.com/avatar/4b3e0151671b0a425a9e7989b07f1e99?s=40"

  Model('User').create(user,function(err,doc){
    if(err){
      req.flash("error","注册失败")
      return res.redirect("back");
    }else{
      req.session.user=doc;
      req.flash("success","注册成功")
      return res.redirect("/");
    }
  })
});
//login
router.get('/login', auth.checkNotLogin,function(req, res) {
  res.render('user/login',{title:"登录"});
});
router.post('/login',auth.checkNotLogin, function(req, res) {
  var user=req.body;
  user.password=util.md5(user.password)
  Model('User').findOne(user,function(err,doc){
    if(err){
      req.flash("error","登录失败")
      return res.redirect("back");
    }else{
      if(doc){
        req.session.user=doc;
        req.flash("success","登录成功")
        return res.redirect("/");
      }else{
        req.flash("error","登录失败")
        return res.redirect("/user/reg");
      }
    }
  })
});

//logout
router.get('/logout',auth.checkLogin, function(req, res) {
  req.session.user=null;
  req.flash("success","退出成功")
  return res.redirect('/user/login');
});

module.exports = router;
