import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login(){

    // initialize state
    const [form, setForm] = useState({
        userId: "",
        userPassword: ""
    });

    // initialize message
    const [submitted, setSubmitted] = useState("");
    
    const navigate = useNavigate();

    // handle change function
    function handleChange(event){
        const {name, value} = event.target;
        setForm((prevValue) => {
            return{
                ...prevValue,
                [name]: value
            };
        })
    };

    // handle submission
    function handleSubmit(event){
        event.preventDefault();
        axios.post("http://localhost:5000/api/login", form)
        .then(res => {
            setSubmitted("Login successful!");
            console.log(res.data.user)
            navigate("/home")
            setForm({userId: "", userPassword: ""});
        })
        .catch(err => {
            console.error("error submitting data", err);
            setSubmitted("Error submitting form.");
        })
    }



    return(
        <div className="loginContainer">
            <div className="loginForm">
                <h2>Login</h2>
                <form className="formItems" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="userId"
                        value={form.userId}
                        placeholder="User Id"
                        required
                        autoComplete="off"
                    />
                    <input
                        type="password"
                        onChange={handleChange}
                        name="userPassword"
                        value={form.userPassword}
                        placeholder="Password"
                        required
                        autoComplete="password"
                    />
                    <button
                        type="submit"
                        className="loginButton">
                        Submit
                    </button>
                    {submitted && <p className="submissionStatus">{submitted}</p>}
                </form>
            </div>
        </div>
    );
}

export default Login;