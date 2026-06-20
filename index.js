import express from "express";
import bodyParser from "body-parser"; // we use ejs instead of sendFile because sendFile is for static File
import pg from "pg";
import env from "dotenv"
import path from "path";

const app=express();
const port=process.env.PORT || 3000;
 env.config();
const db=new pg.Client(process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
} : {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();



let book=[
    {id:1,bookName:"The Title",review:"British influence in India began with the East India Company",author:"AK",isbn:"9789652299116"} //As Example at early  stage when database is not setup
];

const API_URL="https://covers.openlibrary.org/b";//Book cover API to get book cover

app.set("views", path.resolve("public/views"));
app.use(express.static("public")); //
app.use(bodyParser.urlencoded({extended:true})); //to 

let id,bookName,isbn,review,author,url;



//get route to home page
app.get("/",async(req,res)=>{
  const searchQuery = req.query.q || "";
  const sortCriteria = req.query.sort || "newest";

  let queryText = "SELECT * FROM books";
  let queryParams = [];

  if (searchQuery.trim() !== "") {
    queryText += " WHERE book_name ILIKE $1 OR author ILIKE $1";
    queryParams.push(`%${searchQuery}%`);
  }

  // Determine sort order
  switch (sortCriteria) {
    case "rating":
      queryText += " ORDER BY rating DESC, id DESC";
      break;
    case "alpha":
      queryText += " ORDER BY book_name ASC";
      break;
    case "newest":
    default:
      queryText += " ORDER BY id DESC"; // newest submission
      break;
  }

  try {
    const result = await db.query(queryText, queryParams);
    book = result.rows;
    res.render("index.ejs", { 
      content: book, 
      url: API_URL,
      searchQuery: searchQuery,
      currentSort: sortCriteria
    });
  }
  catch(error){
    console.log(error);
    res.status(500).send("Database Error");
  }
});


//getroute of newpost present in navbar
app.get("/newpost",(req,res)=>{
  res.render("newpost.ejs");
});

//post route  of /delete button
app.post("/delete",async(req,res)=>{
  const deleteItem=parseInt(req.body.button); // contain id of the post which is to be deleted (cast to integer to prevent DB coercion errors)
  console.log("Deleting post with ID:", deleteItem);
  try{
    await db.query("DELETE FROM books WHERE id=$1",[deleteItem]);
    res.redirect("/");
  }catch(error){
    console.log(error);
    res.status(500).send("Database Error during deletion");
  }

});



//post route of /submit button of newpost
app.post("/submit",async(req,res)=>{
  console.log("POST /submit route hit!");
  try{
    bookName=req.body["book-name"];
    isbn=req.body["isbn"];
    review=req.body["body-review"];
    author=req.body["author-name"];
    const rating = parseInt(req.body["rating"]) || 5;

    await db.query(
      "INSERT INTO books (book_name,url_code,review_body,author,date_time,rating) VALUES ($1,$2,$3,$4,$5,$6)",
      [bookName,isbn,review,author,new Date().toString(),rating]
    );
    res.redirect("/");
  }
  catch(error){
    console.log(error);
    res.status(500).send("Error saving review");
  }

});


//post route of /edit button
app.post("/edit",async(req,res)=>{
  const editItem=parseInt(req.body.button);// contain id for the post to edited (cast to integer)
  try{
    const result=await db.query("SELECT * FROM books WHERE id=$1",[editItem]);
    book=result.rows[0];
    res.render("updatepost.ejs",{content:book});
  }catch(error){
    console.log(error);
    res.status(500).send("Database Error loading edit form");
  }
  
});



//post route of /edit-post i.e Save button
app.post("/edit-post",async(req,res)=>{
  const editItem=parseInt(req.body.SUBMIT); // parse to integer
  bookName=req.body["book-name"];
  isbn=req.body["isbn"];
  review=req.body["body-review"];
  author=req.body["author-name"];
  const rating = parseInt(req.body["rating"]) || 5;
  try{
    await db.query(
      "UPDATE books SET book_name=$1,url_code=$2,review_body=$3,author=$4,date_time=$5,rating=$6 WHERE id=$7",
      [bookName,isbn,review,author,new Date().toString(),rating,editItem]
    );
    res.redirect("/");
  }catch(error){
    console.log(error);
    res.status(500).send("Error updating review in database");
  }
});

app.get("/about",(req,res)=>{
res.render("about.ejs");
});



app.listen(port,()=>{
    console.log(`Server running on ${port} `)
})