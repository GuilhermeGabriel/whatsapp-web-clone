import React from 'react';
import './Login.css';
import logo from '../assets/logo.png';
import googlelogo from '../assets/google-logo.png';

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../services/firebase';
import { useAuth } from '../providers/auth';

import { doc, getFirestore, setDoc } from 'firebase/firestore';

function Login() {
  const { user, setUser } = useAuth();
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      user.uid=result.user.uid;
      user.name=result.user.displayName;
      user.email=result.user.email;      
      user.photoUrl=result.user.photoURL;
      localStorage.setItem('user',JSON.stringify(user));
      setUser(user);

      const db = getFirestore();
      const userRef = doc(db,`users/${user.uid}`);
      await setDoc(userRef, user);
      
      //history.push('/aaa');
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="left_side">
        <div className="left_top">
          <img src={logo} width={30} alt="" />
          <h2>WhatsGui</h2> 
        </div>
    
        <div className="left_inside">
          <h2>Faça login em sua conta!</h2>
          <button className="google_login"
            onClick={()=>signIn()}>
            <img src={googlelogo} width={50} alt="" />
            Google login
          </button>
        </div>

      </div>
      <div className="right_side">
        <h1>
         Uma nova maneira de se comunicar com seus amigos e familiares!
        </h1>
        <br />
        <span>"Com grandes poderes vêm grandes responsabilidades" também conhecido como princípio de Peter Parker, é um provérbio popularizado pelos quadrinhos do Homem-Aranha escritos por Stan Lee.</span>
      </div>
    </div>
  );
}

export default Login;
