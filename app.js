

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require ("mongoose");

var _ = require("lodash");

mongoose.connect("mongodb://127.0.0.1:27017/dailyJournalDB",{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
  console.log("Connected to MongoDB successfully");
}).catch((err)=>{
  console.log(err);
})

const postsSchema = new mongoose.Schema({
  name:String,
  content:String
});

const Post = mongoose.model("Post",postsSchema);


const homeStartingContent = 'Welcome to Daily Journal - Your Personalized Daily Writing Companion \n' +
'Unlock the power of daily reflection, self-expression, and personal growth with Daily Journal. Our website is designed to be your trusted companion on the journey of self-discovery and improvement. Whether you are an experienced writer or just starting out, our platform provides you with the tools and inspiration you need to make journaling a daily habit.'
                            
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

//const posts = [];


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/posts/:postName", (req,res)=>{

  
  const requestedTitle=req.params.postName;

  console.log(requestedTitle);
  async function getData(){
    const foundPosts = await Post.find();
    console.log(foundPosts);
    foundPosts.forEach(function(foundPost)
    {
      if(_.lowerCase(requestedTitle)=== _.lowerCase(foundPost.name))
      {
        const storedTitle = foundPost.name;
        const Content=foundPost.content;
       
       
          
          res.render("post",{Title:storedTitle ,content:Content})
        
      }
     
    })
    };

    getData();

 // ----------------------------------------------------------"/"-------------------------------   
    
  
});

app.get("/" , function(req,res)
{

  async function getData(){
    const foundPosts = await Post.find();
   // console.log(foundPosts);
   
      console.log("2");
    res.render("home" , {Title:"Home",posts:foundPosts});
  
}
 getData();
});

app.get("/about" , function(req,res)
{
  //console.log(__dirname+"\views\home.ejs");
  res.render("about" , {Title:"About",content:aboutContent});
});

app.get("/contact" , function(req,res)
{
  res.render("contact" , {Title:"Contact",content:aboutContent});
});

app.get("/compose" , function(req,res)
{
  res.render("compose");
});

app.post("/compose" ,function(req,res)
{

  title = req.body.postTitle;
  body = req.body.postBody;


  const post = new Post({
    name:title,
    content:body
   });
   post.save();
  //posts.push(post);
  res.redirect("/");
  
});











app.listen(3000, function() {
  console.log("Server started on port 3000");
});

