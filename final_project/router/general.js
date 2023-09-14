const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    Object.keys(books).forEach(function(key) {
        if (key==req.params.isbn)
            return res.send(books[key]);
    });
    return res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let resp = []    
    Object.keys(books).forEach(function(key) {
        if (books[key]["author"]===req.params.author)            
            resp.push(books[key])
    });
    if (resp.length>0)
        return res.send(resp);
    return res.status(404).json({message: "Book not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let resp = []    
    Object.keys(books).forEach(function(key) {
        if (books[key]["title"]===req.params.title)            
            resp.push(books[key])
    });
    if (resp.length>0)
        return res.send(resp);
    return res.status(404).json({message: "Book not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    Object.keys(books).forEach(function(key) {
        if (key==req.params.isbn)
            return res.send(books[key]["reviews"]);
    });
    return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
