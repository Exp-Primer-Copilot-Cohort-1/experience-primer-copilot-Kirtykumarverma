//Create web server with express
const express = require('express');
const app = express();
//Connect to mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/comments', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Mongo connection open");
    })
    .catch(err => {
        console.log("Mongo connection error");
        console.log(err);
    })
//import the comment model
const Comment = require('./models/comment');
//import the method override
const methodOverride = require('method-override');
//import the path
const path = require('path');
//import the ejs mate
const ejsMate = require('ejs-mate');
//import the catchAsync
const catchAsync = require('./utils/catchAsync');
//import the ExpressError
const ExpressError = require('./utils/ExpressError');
//import the joi schema
const { commentSchema } = require('./schemas');
//import the joi schema
const { validateComment } = require('./middleware');
//use the method override
app.use(methodOverride('_method'));
//use the ejs mate
app.engine('ejs', ejsMate);
//set the view engine
app.set('view engine', 'ejs');
//set the views path
app.set('views', path.join(__dirname, 'views'));
//use the express.urlencoded
app.use(express.urlencoded({ extended: true }));
//use the express.json
app.use(express.json());
//set the home route
app.get('/', (req, res) => {
    res.send("Home");
})
//set the comment index route
app.get('/comments', catchAsync(async (req, res) => {
    const comments = await Comment.find({});
    res.render('comments/index', { comments });
}))
//set the new comment route
app.get('/comments/new', (req, res) => {
    res.render('comments/new');
})
//set the post comment route
app.post('/comments', validateComment, catchAsync(async (req, res, next) => {
    const newComment = new Comment(req.body.comment);
    await newComment.save();
    res.redirect(`/comments/${newComment._id}`);
}))
//set the comment show route
app.get('/comments/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    res.render




