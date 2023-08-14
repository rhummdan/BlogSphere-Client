import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ChangePassword = () => {

    const[oldPassword, setOldPassword] = useState("");
    const[newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const changePassword = () => {
        axios.put("http://localhost:3001/auth/changepassword", {oldPassword: oldPassword, newPassword: newPassword}, {
            headers: {accessToken: localStorage.getItem("accessToken")},
        }).then((response) => {
            if(response.data.error) {
                alert("response.data.error");
            }
        })
        navigate("/")
    }

    return (
        <div>
            <h1>Change Your Password: </h1>
            <input type="text" placeholder="Old Password..." onChange={(event) => {setOldPassword(event.target.value)}}/>
            <input type="text" placeholder="New Password..." onChange={(event) => {setNewPassword(event.target.value)}}/>
            <button onClick={changePassword}>Save Changes</button>
        </div>
    );
}