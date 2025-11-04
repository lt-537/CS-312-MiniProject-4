import { useNavigate } from "react-router-dom";

function HomeButton(){

    const navigate = useNavigate();

    function handleHome(){
        navigate('/home');
    }

    return(
        <button
            type="button"
            className="homeButton"
            onClick={() => handleHome()}>
            Back to Homepage
        </button>
    )

}

export default HomeButton;