import { useNavigate } from "react-router-dom";

function EditButton(props){

    const navigate = useNavigate();

    function handleEdit(){
        navigate("/blogPostForm", {state: {blog: props.blogs, user: props.blogs.creator_name, headerMessage: "Update Your Blog!"}});
    }

    return(
        <button
            type="button"
            className="editButton"
            onClick={() => handleEdit(props.blogs)}
            >Edit
        </button>
    )
}

export default EditButton;