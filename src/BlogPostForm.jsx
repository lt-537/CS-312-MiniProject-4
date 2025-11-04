import React, {useState} from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

function BlogPostForm(){

    const [submitted, setSubmitted] = useState("");
    const navigate = useNavigate();

    const location = useLocation();
    const state = location.state;
    const blog = state.blog || {};
    const user = state.user;
    const headerMessage = state.headerMessage || "Create New Blog!";


    const [blogForm, setBlogForm] = useState({
        blogId: blog.blog_id || "",
        blogTitle: blog.title || "",
        blogContent: blog.body|| "",
        blogUserId: blog.creator_user_id || "",
        blogUserName: blog.creator_name || "",
    });

    // determine if a blog id exisits (to edit)
    const isExists = Boolean(blogForm.blogId);

    function handleChange(event){
        const {name, value} = event.target;
        setBlogForm((prevValue) => {
            return{
                ...prevValue,
                [name]: value
            };
        })
    };

    async function handleSubmit(event){
        event.preventDefault();

        try{
            // determine if the blog is to be created or edited
            if (isExists){
                await axios.post(`http://localhost:5000/api/createBlogs/${blogForm.blogId}`, blogForm)
                }
            else {
                await axios.post("http://localhost:5000/api/createBlogs", blogForm)
            }
            setSubmitted("Blog form submitted!");
            navigate("/home");
        } catch (err) {
            console.error("Error submitting data", err);
            setSubmitted("Error submitting form");
        }
    }

    return(
        <div>
            <NavBar />
            <div className="blogCreationUpdateForm">
                <h1 className="titleCreation">{headerMessage}</h1>
                <p className="postingTitle">Posting as {user}</p>

                <form onSubmit={handleSubmit}>
                    <div className="blogPostFormContainer">
                        <label>Blog Title:</label>
                        <input
                            type="text"
                            onChange={handleChange} 
                            name="blogTitle" 
                            placeholder="Blog Title" 
                            required 
                            value={blogForm.blogTitle}/>

                        <label>Blog Content:</label>
                        <textarea
                            rows="5" 
                            cols="40" 
                            className="blogFormContent"
                            onChange={handleChange}
                            name="blogContent" 
                            placeholder="Blog Content" 
                            required
                            value={blogForm.blogContent}>
                        </textarea>
                    </div>
                    <div className="blogFormButton">
                        <button className="formButton">Submit</button>
                    </div>
                    {submitted && <p className="submissionStatus">{submitted}</p>}
                </form>
            </div>
        </div>
        
        
    )
}

export default BlogPostForm;