import React from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import Home from "./Home";
import BlogsList from "./BlogsList";
import BlogPostForm from "./BlogPostForm";
import UserBlogs from "./UserBlogs";
import NavBar from "./NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

function App(){
  axios.defaults.withCredentials = true;

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blogsList" element={<BlogsList />}/>
        <Route path="/blogPostForm" element={<BlogPostForm />}/>
        <Route path="/userBlogs" element={<UserBlogs />}/>
        <Route path="/navBar" element={<NavBar />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
