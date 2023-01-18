const express=require('express');
const mongoose=require('mongoose');
const body_parser=require('body-parser');
const ejs=require('ejs');

const app=express();
app.set('view engine','ejs');
app.use(body_parser.urlencoded({
    extended:true
}));

app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/blodPedia',{useNewUrlParser:true});

const articleSchema={
    title:"String",
    content:"String"
}
const Article=mongoose.model("Article",articleSchema);


//the below code send all the data stored in the database but we need a method that target the specific document based on the title

app.get('/articles',(req,res)=>{
    Article.find((err,datas)=>{
        res.send(datas);
    })
});

//this below code will be the advance version of above code
//we will be using the route version
app.route('/articles/:articleTitle')
.get((req,res)=>{
    Article.findOne({title:req.params.articleTitle},(err,foundArticle)=>{
        if(!err){
            res.send(foundArticle);
        } else{
            res.send("No article matcing that title was found");
        }
    })
    //the below code will  update the data in the database
//     .put((req,res)=>{
//     Article.updateMany(
//         {title: req.params.articleTitle},
//         {title: req.body.title,content:req.body.connect},
//         {overwrite:true},
//         (err)=>{
//             if(!err){
//                 res.send("Successfully updated")

//             }
//         }

//     )

// })

}

)
//the below patch on updates a single content

.patch((req,res)=>{

    Article.update(
        {title:req.params.articleTitle},
        {$set:req.body},
        (Err)=>{
            if(!Err){
                res.send("Success")
            } else{
                res.send(Err)
            }
        }

    )
})

.delete((req,res)=>{
    Article.deleteOne(
        {title:req.params.articleTitle},
        (err)=>{
            if(!err){
                res.send("Delted")
            }
        }
    )
})

app.delete('/articles',(req,res)=>{
Article.deleteMany(err=>{
    if(!err){
        res.send("Deleted succesfully")
    } else{
        res.send(err)
    }
})
});

app.post("/post",(req,res)=>{
console.log(req.body.title);
console.log(req.body.content);
const newArticle=new Article({
    title:req.body.title,
    content:req.body.content
});
newArticle.save(err=>{
    if(err){
        res.send(err);
    }else{
        res.send("The data has been saved succesfully");
    }
});
});

app.listen(3000,(req,res)=>{
    console.log("Server started")
})
