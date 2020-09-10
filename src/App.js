import React, { useState, useEffect } from "react";
import InstagramEmbed from "react-instagram-embed";
import "./App.css";
import Post from "./Post";
import { db } from "./firebase";
import { Modal, makeStyles, Button, Input, Avatar } from "@material-ui/core";
import { auth } from "./firebase";
import ImageUpload from "./ImageUpload";
import KaranAvatar from './Images/KaranAvatar.jpg';

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  
  const [openSignIn, setOpenSignIn] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));
  const classes = useStyles();

  useEffect(() => {
    db.collection("instagram")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  const signUp = (event) => {
    event.preventDefault();
    console.log(user);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({ displayName: username });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form>
            <center className="app__signout">
              <img
                className="app__signImg"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
                alt=""
              />
              <Input
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="passwrod"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button color="secondary" onClick={signUp}>
                SignUp
              </Button>
            </center>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form>
            <center className="app__signout">
              <img
                className="app__signImg"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
                alt=""
              />

              <Input
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="passwrod"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button color="secondary" onClick={signIn}>
                Sign In
              </Button>
            </center>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImg"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
          alt=""
        />

        {user ? (
          <div className="app__logoutcontainer">
          <Avatar
          className="app__loginavatar"
          alt={user?.displayName}
          src={KaranAvatar}
        />
          <Button color="secondary"  onClick={() => auth.signOut()}>
            Logout
          </Button>
          </div>
        ) : (
          <div className="app__loginContainer">
            <Button color="secondary" onClick={() => setOpenSignIn(true)}>
              Sign In
            </Button>
            <Button color="secondary" onClick={() => setOpen(true)}>
              Sign Up
            </Button>
          </div>
        )}
      </div>
      <div className="app__post">
        <div className="app_postleft">
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
            user={user}
            likes={post.likes}
            
          />
        ))}
        </div>
        <div className="app_postright">
        <InstagramEmbed
        url='https://www.instagram.com/p/CDBl1W_AMnb/'
        maxWidth={320}
        hideCaption={false}
        containerTagName="div"
        protocol=""
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
        </div>
      </div>
     

      {user?.displayName ? (
        <ImageUpload username={user?.displayName} />
      ) : (
        null
      )}
    </div>
  );
}

export default App;
