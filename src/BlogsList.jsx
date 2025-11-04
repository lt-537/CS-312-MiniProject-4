import React, {useState, useEffect} from "react";
import axios from "axios";

function BlogsList(){

    const [blogItems, setBlogItems] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/displayBlogs")
        .then(res => {
            const {blogPost} = res.data;
            setBlogItems(blogPost);
        })
        .catch(err => console.log(err));
    }, []);

    return(
        <div className="blogsContainer">
                {blogItems.map(blogs => (
                    <article key={blogs.blog_id} className="blogCard">
                        <div className="displayedBlogContent">
                            <p className="blogTitle">{blogs.title}</p>

                            <p className="blogContent">{blogs.body}</p>


                            <p className="blogCreator">{blogs.creator_name}</p>


                            <p className="blogTimeCreated">{blogs.date_created}</p>
                        </div>
                    </article>
                ))};
        </div>
    )
};

export default BlogsList;