import React from "react"
import { useNavigate } from "react-router-dom";

function NavBar(props){

    const navigate = useNavigate();

    
    function handleCreateBlog(){
        navigate('/blogPostForm', {state: {user: props.username}});
    }

    function handleModifyBlogs(){                                            
        navigate('/userBlogs')
    }

    function handleHome(){
        navigate('/home');
    }


    return(
        <header className='homepageHeader'>
            <h2 className="headerTitle">BlogIt</h2>
            <div className="headerContainer">

                <button
                    type="button"
                    className="homeButton"
                    onClick={() => handleHome()}>
                    Back to Homepage
                </button>

                <button
                    type="button"
                    className="createButton"
                    onClick={handleCreateBlog}>
                    Create Blog
                </button>

                <button 
                    type="button"
                    className="modifyButton"
                    onClick={handleModifyBlogs}>
                    Modify My Blogs
                </button>
            </div>
        </header>
    )
}

export default NavBar;