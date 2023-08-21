import {useParams} from "react-router-dom"; //allows for param in the path to the page
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import {AuthContext} from "../helpers/AuthContext"
import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


export const Post = () => {

    const {authState} = useContext(AuthContext);

    let {id} = useParams(); //id is a parameter for the url. It indicates which post will be opened
    const [postObject, setPostObject] = useState({}); //creating an empty object state to store the post in
    const [comments, setComments] = useState([]); //creating empty list state to store comments in
    const [newComment, setNewComment] = useState(""); //this is the state that will store what is inputted into the text field

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://blogsphere-app-c9203590a7d2.herokuapp.com/posts/info/${id}`).then((response) => {
            setPostObject(response.data);
        }); //fetching selected post's information
  
        axios.get(`https://blogsphere-app-c9203590a7d2.herokuapp.com/comments/${id}`).then((response) => {
            setComments(response.data);
        }); //fetching selected post's comments
    }, []);

    
    const addComment = () => {
        axios.post("https://blogsphere-app-c9203590a7d2.herokuapp.com/comments", {commentBody: newComment, PostId: id},
        {
            //storing accessToken in headers to pass to middleware
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        }
        ).then((response) => {
            //making sure there's no error in the access token before adding comment.
            if(response.data.error) {
                console.log(response.data.error);
            } else {
                console.log(response.data);
                const commentToAdd = {commentBody: newComment, username: response.data.username, id: response.data.id};
                setComments([...comments, commentToAdd]); //updating list of comments to include recently added one
                setNewComment("");
            }
        })
    };

    const deleteComment = (id) => {
        console.log(id);
        axios.delete(`https://blogsphere-app-c9203590a7d2.herokuapp.com/comments/${id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then(() => {
            //deleting selected comment from list of comments with the filter function
            setComments(comments.filter((value) => {
                return value.id != id; //if value.id != id, we're gonna keep that comment. If it is, we delete it
            }))
        })
    }

    //delete post function
    const deletePost = (id) => {
        axios.delete(`https://blogsphere-app-c9203590a7d2.herokuapp.com/posts/${id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then(() => {
            navigate("/");
        })
    }

    const editPost = (option) => {
        if(option === "title") {
            const newTitle = prompt("Enter New Title:");
            if(newTitle) {      //If newTitle is empty, it means the user cancelled the title change
                axios.put("https://blogsphere-app-c9203590a7d2.herokuapp.com/posts/title", {newTitle: newTitle, id: id}, {
                headers: {accessToken: localStorage.getItem("accessToken")},
                }).then((res) => {
                    setPostObject({...postObject, title: res.data});
                })
            } else {
                alert("Title update cancelled.");
            }
        } else {
            const newPostText = prompt("Enter New Text:");
            if(newPostText) {
                axios.put("https://blogsphere-app-c9203590a7d2.herokuapp.com/posts/postText", {newText: newPostText, id: id}, {
                headers: {accessToken: localStorage.getItem("accessToken")},
                }).then((res) => {
                    setPostObject({...postObject, postText: res.data});
                })
            } else {
                alert("Text update cancelled.");
            }
        }
    }

    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post" id="individual">
                    <div className="title" onClick={() => {
                        if(authState.username === postObject.username) {        //making sure people can only edit their own posts
                            editPost("title")
                        }
                    }}>{postObject.title}</div>
                    <div className="body" onClick={() => {
                        if(authState.username === postObject.username) {
                            editPost("body");
                        }
                    }}>{postObject.postText}</div>
                    <div className="footer">
                        <div className="username">
                            {postObject.username}
                        </div>
                        <div className="buttons2">
                            
                            {postObject.username === authState.username && (
                                <>
                                    <DeleteOutlineIcon style={{ fontSize: '30px' }} onClick={() => {deletePost(postObject.id)}}/>
                                </>
                            )}
                        </div>
                        
                    </div>
                </div>   
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input type="text" placeholder="Comment..." onChange={(event) => {setNewComment(event.target.value)}} value={newComment}/>
                    <button onClick={addComment}>Add Comment</button>
                </div>
                
                <div className="listOfComments">
                    {comments.slice().reverse().map((comment, key) => {
                        return (
                            <div className="comment">
                                {comment.commentBody}
                                <label className="username"> - {comment.username}</label>
                               {authState.username === comment.username && (     
                                    <button className="delete" onClick={() => {deleteComment(comment.id)}}>X</button>
                               )} 
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}