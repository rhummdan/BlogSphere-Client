import axios from "axios";
import {useEffect, useState} from 'react';

export const Home = () => {

    const [listOfPosts, setListOfPosts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/posts").then((response) => {
        setListOfPosts(response.data);
        })
    }, []);

    return (
        <div className="App">
        {
            listOfPosts.map((value, key) => {
            return <div className='post'>
                <div className='title'> {value.title}</div>
                <div className='body'>{value.postText}</div>
                <div className='footer'>{value.username}</div>
            </div>
            })
        }
        </div>
    );
}