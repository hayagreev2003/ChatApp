import './App.css';
import React,{useRef,useState} from 'react'

import firebase from 'firebase/compat/app'

import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/analytics'

//Importing inbuilt firebase hook that will be used for getting user authentication
import {useAuthState} from 'react-firebase-hooks/auth'

import {useCollectionData} from 'react-firebase-hooks/firestore'

firebase.initializeApp({

  apiKey: "AIzaSyA_b1Xpyl074vnyCPVjM0sZJT8XSg1A3b4",
  authDomain: "react-chat-app-898e4.firebaseapp.com",
  projectId: "react-chat-app-898e4",
  databaseURL: "https:/react-chat-app-898e4.firebaseio.com",
  storageBucket: "react-chat-app-898e4.appspot.com",
  messagingSenderId: "1012746727632",
  appId: "1:1012746727632:web:5caadd093779d86fc5aed5",
  measurementId: "G-TX4E5L0PTL"

})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const[user] = useAuthState(auth);
  
  
  return (
    <div className="App">

      <header>
        <h1>
          Welcome Folks
        </h1>
        <SignOut/>
      </header>

      <section>
        {user ? <ChatRoom/> : <Signin/>}
      </section>

    </div>
  );
}

function Signin(){

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);  // Use signInWithPopup instead of useSignInWithGoogle
  }

  return (
    <>
      <button className='sign-in' onClick={signInWithGoogle}>Sign In</button>
      <p>Lets connect to talk and grow together.</p>
    </>
  )

}

function SignOut(){

  return auth.currentUser && (
    <button className='sign-out' onClick={()=> auth.signOut()}>Sign Out</button>
  )

}

function ChatRoom(){

  const dummy = useRef();

  const messagesRef = firestore.collection('messages');

  const query = messagesRef.orderBy('createdAt').limit(100);

  const [messages] = useCollectionData(query,{idField: 'id'});

  const [formValue,setFormValue] = useState('');

  const sendMessage = async (e) => {

    e.preventDefault();

    const {uid,photoURL} = auth.currentUser;

    await messagesRef.add({

      text : formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL

    })

    setFormValue('');
    if (dummy.current) {
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

  }

  return(

    <>

      {messages && messages.map(msg => <ChatMessage key = {msg.id} message = {msg} />)}

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder='Type something...'/>

        <button type='submit' disabled={!formValue}>Go</button>
      
      </form>

    </>

  )

}

function ChatMessage(props){

  const {text,uid,photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (

    <div className= {`message ${messageClass}`}>

      <img src={photoURL} />
      <p>{text}</p>

    </div>

  )

}

export default App;
