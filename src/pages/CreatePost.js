import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export const CreatePost = () => {

    //setting initial values for fields of form
    const initialValues = {
        title: "",
        postText: "",
        username: "",
    };

    //creating schema for the fields of the form
    const validationSchema = Yup.object().shape({
        title: Yup.string().required("You must input a title!"),
        postText: Yup.string().required(),
        username: Yup.string().min(3).max(15).required(),
    });

    //on submit we will post data to database. "data" contains user input in form of object
    const onSubmit = (data) => {
        axios.post("http://localhost:3001/posts", data).then((response) => {
            console.log("it worked");
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

                <label>Username: </label>
                <ErrorMessage name='username' component="span"/>
                <Field id="inputCreatePost" name="username" placeholder="(Ex. John...)"/>

                <button type='submit'>Create Post</button>
            </Form>
           </Formik>
        </div>
    );
}