import {useParams} from "react-router-dom"; //allows for param in the path to the page
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import {AuthContext} from "../helpers/AuthContext"
import { useNavigate } from "react-router-dom";


export const Post = () => {

    const {authState} = useContext(AuthContext);

    let {id} = useParams(); //id is a parameter for the url. It indicates which post will be opened
    const [postObject, setPostObject] = useState({}); //creating an empty object state to store the post in
    const [comments, setComments] = useState([]); //creating empty list state to store comments in
    const [newComment, setNewComment] = useState(""); //this is the state that will store what is inputted into the text field

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/posts/info/${id}`).then((response) => {
            setPostObject(response.data);
        });

        
        axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setComments(response.data);
        });
    }, []);

    //function will be called when user clicks button to add comment
    //ofcourse, the parameters also have to be passed
    const addComment = () => {
        axios.post("http://localhost:3001/comments", {commentBody: newComment, PostId: id},
        {
            //storing accessToken in headers to pass to middleware
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        }
        ).then((response) => {
            //making sure there's no error in the access token before adding comment.
            if(response.data.error) {
                //alert();
            } else {
                const commentToAdd = {commentBody: newComment, username: response.data.username};
                setComments([...comments, commentToAdd]); //updating list of comments when user added comment. The first param indicates that we get the prev verison of the list. The second param says what to add
                setNewComment("");
            }
            
        })
    };

    const deleteComment = (id) => {
        axios.delete(`http://localhost:3001/comments/${id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then(() => {
            
            //using javasxript filter function to delete specific comment in the list
            setComments(comments.filter((value) => {
                return value.id != id; //if value.id != id, we're gonna keep that comment. If it is, we delete it
            }))
        })
    }

    //delete post function
    const deletePost = (id) => {
        axios.delete(`http://localhost:3001/posts/${id}`, {
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
            axios.put("http://localhost:3001/posts/title", {newTitle: newTitle, id: id}, {
                headers: {accessToken: localStorage.getItem("accessToken")},
            }).then((res) => {
                setPostObject({...postObject, title: res.data});
            })

        } else {
            const newPostText = prompt("Enter New Text:");
            axios.put("http://localhost:3001/posts/postText", {newText: newPostText, id: id}, {
                headers: {accessToken: localStorage.getItem("accessToken")},
            }).then((res) => {
                setPostObject({...postObject, postText: res.data});
            })
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
                        {postObject.username}
                        {postObject.username === authState.username && (
                            <button onClick={() => {deletePost(postObject.id)}}>Delete Post</button>
                        )}
                    </div>
                </div>   
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input type="text" placeholder="Comment..." onChange={(event) => {setNewComment(event.target.value)}} value={newComment}/>
                    <button onClick={addComment}>Add Comment</button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment, key) => {
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