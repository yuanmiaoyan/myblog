
var express=require("express");
var auth=require('../middle');
var markdown=require('markdown').markdown;
var router=express.Router();
router.get("/list",function(req,res){
    Model("Article").find().populate('user').exec(function(err,docs){
        docs.forEach(function(doc){
            doc.content=markdown.toHTML(doc.content)
            if(doc.content.length>40){
                doc.content=doc.content.substring(0,41)+'...';
            }
        })
        res.render("article/list",{title:"文章列表",articles:docs})
    })
})
router.get("/add",auth.checkLogin,function(req,res){
    res.render("article/add",{title:"添加文章"})
});
router.post("/add",auth.checkLogin,function(req,res){
    var article=req.body;
    article.user=req.session.user._id;
    Model('Article').create(article,function(err,doc){
        if(err){
            req.flash("error","添加文章失败");
            res.redirect("back");
        }else{
            req.flash("success","添加文章成功");
            res.redirect('/')
        }
    })
});
router.get("/detail/:_id",function(req,res){
    Model("Article").findById(req.params._id,function(err,doc){
        doc.content=markdown.toHTML(doc.content)
        res.render("article/detail",{title:"文章详情",article:doc})
    })
});
router.get("/delete/:_id",function(req,res){
    Model("Article").findById(req.params._id,function(err,doc){
        if(doc){
            if(req.session.user._id==doc.user){
                Model("Article").remove({_id:req.params._id},function(err,doc){
                    res.redirect('/')
                })
            }else{
                req.flash("error","不是你发表的文章，不能删除")
                res.redirect('back')
            }
        }else{
            res.redirect('back')
        }
    })
    //

});
module.exports = router;