import express from "express";
import bodyParser from "body-parser"; // we use ejs instead of sendFile because sendFile is for static File
import pg from "pg";



const app=express();
const port=3000;

const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"book",
  password:"postgres",
  port:5432

});
db.connect();



let book=[
    {id:1,bookName:"The Title",review:"British influence in India began with the East India Company",author:"AK",isbn:"9789652299116"} //As Example at early  stage when database is not setup
];

const API_URL="https://covers.openlibrary.org/b";//Book cover API to get book cover

app.use(express.static("public")); //
app.use(bodyParser.urlencoded({extended:true})); //to 

let id,bookName,isbn,review,author,url;



//get route to home page
app.get("/",async(req,res)=>{
try{
const result=await db.query("SELECT * FROM books");
console.log(result.rows);
book=result.rows;
console.log(API_URL+book[0].isbn+"-M.jpg");
res.render("index.ejs",{content:book,url:API_URL});
}
catch(error){
  console.log(error);
}
});


//getroute of newpost present in navbar
app.get("/newpost",(req,res)=>{
res.render("newpost.ejs");
});

//post route  of /delete button
app.post("/delete",async(req,res)=>{
  const deleteItem=req.body.button; //contain id of the post which is to be deleted
  console.log(deleteItem);
  try{
    await db.query("DELETE FROM books WHERE id=$1",[deleteItem]);
    res.redirect("/");
  }catch(error){
    console.log(error);
  }

});



//post route of /submit button of newpost
app.post("/submit",async(req,res)=>{
console.log("POST /submit route hit!");
try{
bookName=req.body["book-name"];
console.log(bookName);
isbn=req.body["isbn"];
review=req.body["body-review"];
console.log(review);
author=req.body["author-name"];
const result=await db.query("INSERT INTO books (book_name,url_code,review_body,author,date_time) VALUES ($1,$2,$3,$4,$5) RETURNING *",[bookName,isbn,review,author,Date()]);
const book=result.rows;
res.redirect("/");
}
catch(error){
  console.log(error);
}

});


//post route of /edit button
app.post("/edit",async(req,res)=>{
  const editItem=req.body.button;//contain id for the post to edited
  try{
  const result=await db.query("SELECT * FROM books WHERE id=$1",[editItem]);
  console.log(result.rows[0]);
  book=result.rows[0];
  res.render("updatepost.ejs",{content:book});
  }catch(error){
    console,log(error);
  }
  
});



//post route of /edit-post i.e Save button
app.post("/edit-post",async(req,res)=>{
const editItem=req.body.SUBMIT;
console.log(editItem);
bookName=req.body["book-name"];
console.log(bookName);
isbn=req.body["isbn"];
review=req.body["body-review"];
console.log(review);
author=req.body["author-name"];
try{
await db.query("UPDATE books SET book_name=$1,url_code=$2,review_body=$3,author=$4,date_time=$5 WHERE id=$6",[bookName,isbn,review,author,Date(),editItem]);
res.redirect("/");
}catch(error){
  console.log(error);
}
});

app.get("/about",(req,res)=>{
res.render("about.ejs");
});



app.listen(port,()=>{
    console.log(`Server running on ${port} `)
})