//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

//connect to mongodb
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

//create a schema
const articleSchema = {
  title: String,
  content: String
}

//create a model
const Article = mongoose.model("Article", articleSchema);

/////////////////////////////////////Requests targeting all articles//////////////
app.route("/articles")

  //get all articles
  .get(function(req, res){
    Article.find(function(err, foundArticles){
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  //post a new article
  .post(function(req, res){
    console.log();
    console.log();

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err){
      if (!err) {
        res.send("Successfully added new articles");
      } else {
        res.send(err);
      }
    });
  })

  //delete all articles
  .delete(function(req, res){
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
});

/////////////////////////////////////Requests targeting specific article//////////
app.route("/articles/:articleTitle")

  //get a specific article
  .get(function(req, res){

    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if (foundArticle) {
        res.send(foundArticle)
      } else {
        res.send("No article matching that article was found.");
      }
    });
  })

  //put in a specific article (whole new replacement)
  .put(function(req, res){

    Article.updateOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if (!err) {
          res.send("Successfully updated an article.");
        } else {
          res.send(err);
        }
      }
    );
  })

  //patch a specific field in a specific article (replacing only the broken parts)
  .patch(function(req, res){

    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err) {
        if(!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })

  //delete a specific article
  .delete(function(req, res){

    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err) {
        if(!err) {
          res.send("Successfully deleted the corresponding article.");
        } else {
          res.send(err);
        }
      }
    );
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
