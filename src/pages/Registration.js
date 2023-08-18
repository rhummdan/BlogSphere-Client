import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Registration = () => {

    const initialValues = {
        username: "",
        password: "",
    };

    const navigate = useNavigate();

    const [userAddition, setUserAddition] = useState(false);

    //creating schema for the fields of the form
    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(4, 'Username must be at least 4 characters')
            .max(15, "Username can't exceed 15 characters")
            .required("Username is a required field."),
        password: Yup.string()
            .min(4, 'Password must be at least 4 characters')
            .max(20, "Password can't exceed 15 characters")
            .required("Password is a required field."),
    });

    //formik will already pass the user inputted data
    const onSubmit = async (data) => {
        
        axios.post("http://localhost:3001/auth/repeat", data).then((response) => {
            if(!response.data.found) {
                axios.post("http://localhost:3001/auth", data).then(() => {
                    console.log(data);
                })
                navigate("/login");
            } else {
                alert("User Already Exists.")
            }
        })
    };


    return (
        <div className='createPostPage'>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
         <Form className='formContainer'>
            
             <label>Username: </label>
             <ErrorMessage name='username' component="span"/>
             <Field id="inputCreatePost" name="username"/>

             <label>Password: </label>
             <ErrorMessage name='password' component="span"/>
             <Field id="inputCreatePost" type="password" name="password" />


             <button className='center' type='submit'>Register</button>
         </Form>
        </Formik>
     </div>
    );
}