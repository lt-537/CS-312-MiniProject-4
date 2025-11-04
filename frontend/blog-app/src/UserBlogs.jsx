import React, {useState, useEffect} from "react";
import axios from "axios";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import NavBar from "./NavBar";

function UserBlogs(){

    const [blogPost, setBlogPost] = useState([]);


    useEffect(() => {
        axios.get("http://localhost:5000/api/userBlogs")
        .then(res => {
            const { blogPost } = res.data;
            console.log("client", blogPost)
            setBlogPost(blogPost);
        })
        .catch(err => console.log(err));
    }, []);

    return(
        <div>
            <NavBar />
            <div className="homepageContent">
                <h1 className="homepageTitle">Your Blogs</h1>
                <div className="blogsContainer">
                    {blogPost.map(blog => (
                        <article key={blog.blog_id} className="blogCard">
                            <div className="displayedBlogContent">
                                <p className="blogTitle">{blog.title}</p>

                                <p className="blogContent">{blog.body}</p>
                                
                                <p className="blogCreator">{blog.creator_name}</p>

                                <p className="blogTimeCreated">{blog.date_created}</p>

                                <div className="blogButtons">
                                    < EditButton blogs={blog}/>

                                    <DeleteButton blogs={blog}/>
                                </div>
                            </div>
    
                        </article>
                    ))}
                </div>
            </div>
        </div>
        
    )
}

export default UserBlogs;