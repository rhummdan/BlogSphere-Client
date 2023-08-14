import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export const Registration = () => {

    const initialValues = {
        username: "",
        password: "",
    };

    //creating schema for the fields of the form
    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(4).max(20).required(),
    });

    //formik will already pass the user inputted data
    const onSubmit = (data) => {
        axios.post("http://localhost:3001/auth", data).then(() => {
            console.log(data);;
        })
    };

    return (
        <div className='createPostPage'>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
         <Form className='formContainer'>
            
             <label>Username: </label>
             <ErrorMessage name='username' component="span"/>
             <Field id="inputCreatePost" name="username" placeholder="(Ex. John...)"/>

             <label>Password: </label>
             <ErrorMessage name='passoword' component="span"/>
             <Field id="inputCreatePost" type="password" name="password" placeholder="(Your Password...)"/>


             <button type='submit'>Register</button>
         </Form>
        </Formik>
     </div>
    );
}