import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogsList from "./BlogsList"
import NavBar from './NavBar';

function Home(){
    // create user state
    const [user, setUser] = useState({
        currentUserId: "",
        currentUserName: ""
    });

    useEffect(() => {
        // request user data from server-side using users ID
         axios.get("http://localhost:5000/api/user")
         .then(res => {
            // destructure objects
            const {userId, userName} = res.data;
            // assign data values to the users initial state values
            setUser((prevValue) => ({
                ...prevValue,
                currentUserId: userId,
                currentUserName: userName
            }))
         })
         .catch(err => console.log(err));
     })

    return(
        <div> 
            <NavBar username={user.currentUserName}/>
            <div className="homepageContent">
                <h1 className="homepageTitle">Welcome {user.currentUserName}</h1>
                <div className="blogsListContainer">
                    <BlogsList />
                </div>
            </div>
        </div>
    );
}

export default Home;