import { useState, useContext, } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../helpers/AuthContext"


export const Login = () => {

    //states that will contain user and pass inputted by user
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const {setAuthState} = useContext(AuthContext);

    const navigate = useNavigate();

    const login = () => {
        const data = {username: username, password: password};
        axios.post("http://localhost:3001/auth/login", data).then((response) => {
            if(response.data.error) {
                alert(response.data.error);
            } else {
                //we're setting the key of the item to be "accessToken". This way, if we want to access it from session storage, we just look for the key
                localStorage.setItem("accessToken", response.data.token);
                setAuthState({username: response.data.username, id: response.data.id, status: true});
                navigate("/");
            }
        })
    }
    return (
        <div className="loginContainer">
            <label>Username:</label>
            <input type="text" onChange={(event) => {setUserName(event.target.value)}}/>
            <label>Password:</label>
            <input type="password" onChange={(event) => {setPassword(event.target.value)}}/>
            <button onClick={login}>Login</button>
        </div>
    );
}