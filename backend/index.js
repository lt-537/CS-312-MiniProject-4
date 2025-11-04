import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import session from "express-session"

const app = express();
const port = 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))

// integrate sessions to manage session data 
app.use(session({
    secret: "apples_and_bananas_12345", // unique secret key for signing the session ID cookie
    resave: false, // do not save session if unmodified
    saveUninitialized: false, // save uninitialized session
    cookie: { 
        httpOnly: true,
        path: '/',
        secure: false, // set to true if using HTTPS
        sameSite: 'lax'
    } 
})
)

// database structure
const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'BlogDB',
    password: '8097531*rH12',
    port: 5432,
});

db.connect();

// body parsers
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.post('/api/sign-up', async (req, res) => {
    // gather user input from the sign up form
    const { userName, userPassword, userId } = req.body;
    // get the userid from the 'users' table based on users id input
    try{
        const check_userid = await db.query("SELECT * FROM users WHERE user_id = $1", [userId]);
        // verify if the userid already exists in the 'users' table
        if(check_userid.rows.length > 0){
            // if the userid exists, display an error message and render the signup page
            //res.render("signup_page.ejs", { error: "User ID already exists. Please choose a different User ID." });
            return res.status(400).json({error: "User ID already exists. Please choose a different User ID."});
        };
        // if userid does not exist, insert the new user into the 'users' table
        try{
            await db.query("INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3)", [userId, userPassword, userName]);
            // render the sign in page
            //res.render('sign_in_page.ejs');
            return res.status(200).json({ message: "User registered successfully" });

        } catch (err) {
            return res.status(500).json({error: "Internal Server Error"});
        }

    } catch (err) {
        return res.status(500).json({error: "Internal Server Error"});
    }
});


app.post('/api/login', async (req, res) => {
    // get the user input from the sign-in form
    const {userId, userPassword} = req.body;

    // get the user with the users inputted user id and password from the 'users' table
    try{
        const verify_user = await db.query("SELECT * FROM users WHERE user_id = $1 AND password = $2", [userId, userPassword]);
        
        // verify if the userid exists in the 'users' table
        if(verify_user.rows.length <= 0){
            // if the userid does not exist, display an error message and render the sign-in page
            return res.status(400).json({error: "User ID or Password is incorrect. Please try again."})
        }
        else{
            // if the userid exists, redirect to the display blogs route
            const userData = verify_user.rows[0];  // this is where we assign the current user signed in to the session
            req.session.userId = userData.user_id;
            return res.status(200).json({message: "Login successful", user: req.session.userId});
        }
    } catch (err) {
        return res.status(500).json({error: "Internal Server Error"});
    }
});

// route to get current user data based on id
app.get('/api/user', async (req, res) => {
    if(req.session.userId){
        try{
        // obtain the user data from 'user' table using users ID
        const response = await db.query("SELECT * FROM users WHERE user_id = $1", [req.session.userId]);
        const userData = response.rows[0];
        // send userid and username to frontend
        return res.status(200).json({userId: userData.user_id, userName: userData.name})

        } catch(err) {
            res.status(500).json({error: "Internal Server Error"})
        }
    }
    else{
        res.status(401).send("Unauthorized");
    }
});

// route to display the list of blogs
app.get('/api/displayBlogs', async (req, res) => {
    if(req.session.userId){
        // select all the blogs within the 'blogs' table
        const get_blogs = await db.query("SELECT * FROM blogs");
        const blog = get_blogs.rows;
        // render the blogs page with all the blogs in the table
        return res.status(200).json({blogPost: blog});
    }
    else{
        res.status(401).send("Unauthorized");
    }

});

// this route is in charge for BOTH creating and updating the blogs
app.post('/api/createBlogs', async (req, res) => {
    if(req.session.userId){
        // gather user blog data (either to create a new blog or update with new inputs)
        const {blogTitle, blogContent, blogUserName} = req.body || {};
        // get current time the user creates/updates blog
        const now = new Date();
        const dateCreated = now.toISOString();
        // insert the new blog into the 'blogs' table
        await db.query("INSERT INTO blogs (creator_name, creator_user_id, title, body, date_created) VALUES ($1, $2, $3, $4, $5)", [blogUserName, req.session.userId, blogTitle, blogContent, dateCreated]);
        // return back to the blogs webpage
        return res.status(200).json({message: "Successfully created blog post!", user: req.session.userId});
    }
    else{
        return res.status(401).send("Unauthorized")
    };
});

app.post('/api/createBlogs/:id', async (req, res) => {
        if(req.session.userId){
            const { id } = req.params;
            // gather user blog data (either to create a new blog or update with new inputs)
            const {blogId, blogTitle, blogContent, blogUserId, blogUserName} = req.body || {};
            // get current time the user creates/updates blog
            const now = new Date();
            const dateCreated = now.toISOString();
            
            // if the blog_id exists, update the existing blog entry    
            await db.query("UPDATE blogs SET creator_name = $1, creator_user_id = $2, title = $3, body = $4, date_created = $5 WHERE blog_id = $6", [blogUserName, blogUserId, blogTitle, blogContent, dateCreated, id]);
            // return back to the blogs webpage
            return res.status(200).json({message: "Successfully updated blog post!", user: req.session.userId});
        } else{
        return res.status(401).send("Unauthorized")
    };
});

// route to display current users blogs
app.get('/api/userBlogs', async (req, res) => {
    if(req.session.userId){
        // fetch blogs created by the logged-in user by comparing the blogs 'creator_user_id' and user's 'user_id'
        const user_blogs = await db.query("SELECT * FROM blogs WHERE creator_user_id = $1", [req.session.userId]);
        const blog = user_blogs.rows;
        // render the user blogs page with the logged-in users existing blogs
        return res.status(200).json({ blogPost: blog });
    } else {
        return res.status(401).send("Unauthorized");
    };
});



app.delete("/deleteBlog/:id", async (req, res) => {
    // get the blog id to be deleted
    const { id } = req.params;
    try{
        // delete the blog from the 'blogs' table using the blog it
        await db.query("DELETE FROM blogs WHERE blog_id = $1", [id]);
        res.status(200).json({message: "Successfully deleted blog!"})
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    };

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
