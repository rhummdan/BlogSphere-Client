import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useEffect, useContext} from "react";
import {AuthContext} from "../helpers/AuthContext"

export const CreatePost = () => {

    const navigate = useNavigate();
    const {authState} = useContext(AuthContext);

    //if user isn't logged in, they cant create a post
    useEffect(() => {
        if(!localStorage.getItem("accessToken")) {
            navigate("/login");
        }
    }, [])

    //setting initial values for fields of form
    const initialValues = {
        title: "",
        postText: "",
    };

    //creating schema for the fields of the form
    const validationSchema = Yup.object().shape({
        title: Yup.string().required("You must input a title!"),
        postText: Yup.string().required(),
    });

    //on submit we will post data to database. "data" contains user input in form of object
    const onSubmit = (data) => {
        axios.post("http://localhost:3001/posts", data, {
            headers: {accessToken: localStorage.getItem("accessToken")},
        }).then((response) => {  
            navigate("/");  //when user creates a post, they will be redirected to the home page
        })
    };

    

    return (
        <div className='createPostPage'>
           <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            <Form className='formContainer'>
                <label>Title: </label>
                <ErrorMessage name='title' component="span"/>
                <Field id="inputCreatePost" name="title" placeholder="(Ex. Title...)"/>
                
                <label>Post: </label>
                <ErrorMessage name='postText' component="span"/>
                <Field id="inputCreatePost" name="postText" placeholder="(Ex. Post...)"/>

                <button type='submit'>Create Post</button>
            </Form>
           </Formik>
        </div>
    );
}