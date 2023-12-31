import axios from "axios";
import {useEffect, useState, useContext} from 'react';
import {useNavigate, Link} from "react-router-dom";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import {AuthContext} from "../helpers/AuthContext"
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';



export const Home = () => {

    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const  navigate = useNavigate(); 

    //setting initial values for fields of form
    const initialValues = {
        title: "",
        postText: "",
    };

    const fillUpStates = () => {
        //if user isn't logged in, they cant view posts in home page
        if(!localStorage.getItem("accessToken")) {
            navigate("/login");
        } else {
            axios.get("https://blogsphere-app-c9203590a7d2.herokuapp.com/posts", {
                headers: {accessToken: localStorage.getItem("accessToken")},
            }).then((response) => {                                                                       
                setListOfPosts(response.data.listOfPosts);
                //as of now, the liked post array contains objects. We're mapping through it and replacing each object with just
                //the postId val
                setLikedPosts(response.data.likedPosts.map((like) => {
                    return like.PostId;
                }));
        })
        }
    }

    useEffect(() => {
        fillUpStates();
    }, []);

    //creating schema for the fields of the form
    const validationSchema = Yup.object().shape({
        title: Yup.string().required("A post requires a title."),
        postText: Yup.string().required("A post requires text."),
    });

    //on submit we will post data to database. "data" contains user input in form of object
    const onSubmit = (data, props) => {
        axios.post("https://blogsphere-app-c9203590a7d2.herokuapp.com/posts", data, {
            headers: {accessToken: localStorage.getItem("accessToken")},
        }).then(() => {  
            fillUpStates();
        })
        props.resetForm(); //resetting form values after user submits
    };


    const likeAPost = (postId) => {
        axios.post("https://blogsphere-app-c9203590a7d2.herokuapp.com/likes", 
        {PostId: postId}, 
        {headers: {accessToken: localStorage.getItem("accessToken")}}
        ).then((res) => {
            //updating likes array so that the like count changes. Remember every post has a likes array
            setListOfPosts(listOfPosts.map((post) => {
                if(post.id === postId) {
                    if(res.data.liked) {
                        return {...post, Likes: [...post.Likes, 0]} //keeping the post the same except the likes array, and for the likes array, keep everything same but add element
                    } else {
                        const likesArray = post.Likes;
                        likesArray.pop();
                        return {...post, Likes: likesArray}
                    }
                } else {
                    return post;
                }
            }))
            if(likedPosts.includes(postId)) {
                setLikedPosts(likedPosts.filter((id) => {
                    return id != postId;        //filter through likedPOsts array and remove the one where id == postId
                }))
            } else {
                setLikedPosts([...likedPosts, postId])
            }
        });
    };

    return (
        
        <>
            <div className='createPostPage'>
                <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                    <Form className='formContainer'>
                        <label>Title: </label>
                        <ErrorMessage name='title' component="span"/>
                        <Field id="inputCreatePost" name="title" autoComplete="off"/>
                        
                        <label>Post: </label>
                        <ErrorMessage name='postText' component="span"/>
                        <Field id="inputCreatePost" name="postText" autoComplete="off"/>

                        <button className="center" type='submit'>Add Post</button>
                    </Form>
                </Formik>
            </div>

            <div className="App">
            {
                
                listOfPosts.slice().reverse().map((value, key) => {
                return <div className='post'> 
                    <div className='title'> {value.title}</div>
                    <div className='body' onClick={() => {navigate(`/post/${value.id}`)}}>{value.postText}</div>
                    <div className='footer'>
                        <div className="username"><Link to={`/profile/${value.UserId}`} >{value.username}</Link></div>
                            <div className="buttons">
                                {/* checking if post were looking at exists in  likedPOsts */}
                                <ThumbUpAltIcon className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"} onClick={() => {likeAPost(value.id)}}/>
                            
                                <label>{value.Likes.length}</label>
                            </div>
                        
                        
                    </div>
                </div>
                })
            }
            </div>
        </>
        
    );
}