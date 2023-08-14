import './App.css';
import axios from "axios";
import {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, Link, useNavigate} from 'react-router-dom'
import { Home } from './pages/Home';
import { CreatePost } from './pages/CreatePost';
import { Post } from './pages/Post';
import { Login } from './pages/Login';
import { Registration } from './pages/Registration';
import {AuthContext} from './helpers/AuthContext'
import { PageNotFound } from './pages/PageNotFound';
import { Profile } from './pages/Profile';
import { ChangePassword } from './pages/ChangePassword';

function App() {

  //authState will be accessible in multiple files due to context api
  //auth state is an object with multiple mariables
  const [authState, setAuthState] = useState({
    username: "", 
    id: 0, 
    status: false //tells us if user is logged in or not
  });

  

  //checking if an accessToken exists within local storage. Tells us if user is logged in
  useEffect(() => {
    axios.get("http://localhost:3001/auth/auth", {headers: {
      accessToken: localStorage.getItem('accessToken'),
    },
  }).then((response) => {               //response is an object with multiple varibles
      if(response.data.error) { 
        setAuthState({...authState, status: false});   //everything about authState will remain the same except status
      } else {
        setAuthState({                      //if user is logged in, we need keep track of their info to display
          username: response.data.username, 
          id: response.data.id, 
          status: true
        });
      }
    });
  }, []); 

  const logout = () => {
    localStorage.removeItem("accessToken"); //removing accessToken from localStorage
    setAuthState({
      username: "",
      id: "", 
      status: false}
      ); //making authstate false will change the login button on top

  }

  return (
    <div className="App">
      <AuthContext.Provider value={{authState, setAuthState}}>
        <Router>
          <div className='navbar'>
            
            {!authState.status ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/registration">Register</Link>
              </>  
            ) : (
              <>
                <Link to="/createpost">Create A Post</Link>
                <Link to="/">Home Page</Link>
              </>
            )}
            <div className='loggedInContainer'>
              <h1>{authState.username}</h1>
              {authState.status && <button onClick={logout}>Logout</button>}
            </div>
            
          </div>
          
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/createpost" element={<CreatePost />}></Route>
            <Route path="/post/:id" element={<Post />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route path="/registration" element={<Registration />}></Route>
            <Route path="/profile/:id" element={<Profile />}></Route>
            <Route path="changepassword" element={<ChangePassword />}></Route>
            <Route path="*" element={<PageNotFound />}></Route>
            
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
