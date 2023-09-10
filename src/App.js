import React from 'react';
import './App.css';

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyAgLnDW052KD_Sst4Mze-8dH8IMBXMPrOk",

  authDomain: "superchat-v1.firebaseapp.com",

  projectId: "superchat-v1",

  storageBucket: "superchat-v1.appspot.com",

  messagingSenderId: "1052226083435",

  appId: "1:1052226083435:web:8587e6a038b7901f3f2f2e",

  measurementId: "G-MPV9VYTJYG"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App">
      {/* <header className="App-header">

      </header> */}
      { user ? <SignOut/> : '' }
      <section>
        { user ? <ChatRoom/> : <SignIn/> }
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
  <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()} style={{borderRadius: '20px', width: 120, height: 50, position: 'absolute', zIndex: 999, left: 0, top: 30, fontSize: '12px'}}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = React.useRef();

  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = React.useState('');

  const sendMessage = async (e) => {

    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' })

  }
  return (
    <>
      <main>
        { messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />) }

        <div ref={dummy}></div>

      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

        <button type='submit'>Send</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved'

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt='' />
      <p>{text}</p>
    </div>
  )
}

export default App;
