import { useNavigate } from "react-router-dom";
import axios from "axios";

function DeleteButton(props){

    const navigate = useNavigate();

    function handleDelete(){
        try{
            axios.delete(`http://localhost:5000/deleteBlog/${props.blogs.blog_id}`)
            navigate('/home');
        }
        catch (err){
            console.log(err);
        }
    }
    return(
        <button
            type="button"
            className="deleteButton"
            onClick={() => handleDelete(props.blogs)}>
            Delete
        </button>
    )
}

export default DeleteButton;