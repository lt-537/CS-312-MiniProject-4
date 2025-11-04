import React, {useState} from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function SignUp(){
    const [form, setForm] = useState({
        userName: "",
        userPassword: "",
        userId: ""
    });

    const [submitted, setSubmitted] = useState("");
    const navigate = useNavigate();

    function handleChange(event){
        const {name, value} = event.target;
        setForm((prevValue) => {
            return {
            ...prevValue,
            [name]: value
            };
        });    
    }

    function handleSubmit(event){
        event.preventDefault();
        setSubmitted("Form is submitting!");
        axios.post('http://localhost:5000/api/sign-up', form)
        .then(res => {
            setSubmitted("Form submitted successfully!");
            setForm({userName: "", userPassword: "", userId: ""});
            navigate("/login")
        })
        .catch(err => {
            console.error("Error submitting data", err);
            setSubmitted("Error submitting form.");
        });
    }
    return(
        <div className="signUpContainer">
            <div className="signUpForm">
                <h2>Sign Up</h2>
                <form className="formItems" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        onChange={handleChange} 
                        name="userName" 
                        value={form.userName} 
                        placeholder="Name" 
                        required 
                        autoComplete="username"
                    />
                    <input 
                        type="password" 
                        onChange={handleChange} 
                        name="userPassword" 
                        value={form.userPassword} 
                        placeholder="Password" 
                        required 
                        autoComplete="newPassword"
                    />
                    <input 
                        type="text" 
                        onChange={handleChange} 
                        name="userId" 
                        value={form.userId} 
                        placeholder="User ID" 
                        required 
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="signUpButton">
                        Sign Up
                    </button>
                    {submitted && <p className="submissionStatus">{submitted}</p>}
                </form>
                <p className="loginMessage">Already have an account?{" "}
                    <Link to="/login">
                        Sign in here!
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp;