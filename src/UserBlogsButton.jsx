import { useNavigate } from "react-router-dom";

function UserBlogsButton(){

    const navigation = useNavigate();

    function handleChange(){
        navigation('/home')
    }

    return(
        <button
            type="button"
            className="userBlogButton"
            onClick={handleChange}>
            Back to My Blogs
        </button>
    )
}

export default UserBlogsButton;