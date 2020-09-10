import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import "./Post.css";
import { db } from "./firebase";
import firebase from "firebase";
import KaranAvatar from "./Images/KaranAvatar.jpg";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { Button } from "@material-ui/core";
function Post({ postId, imageUrl, username, caption, user, likes }) {
  const [comments1, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [like, setLike] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("instagram")
        .doc(postId)
        .collection("comments1")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("instagram")
        .doc(postId)
        .collection("likesCollection")
        .onSnapshot((snapshot) => {
          setLike(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("instagram").doc(postId).collection("comments1").add({
      username: user?.displayName,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };
  var docRef = db
    .collection("instagram")
    .doc(postId)
    .collection("likesCollection");
  const changeLikes = (e) => {
    like.map((lf) => {
      if (lf.username === user?.displayName) {
        docRef.doc(user?.displayName).set({
          alreadylike: lf.alreadylike ? false : true,
          username: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        if (lf.alreadylike) {
          db.collection("instagram")
            .doc(postId)
            .update({
              likes: likes - 1,
            });
        } else {
          db.collection("instagram")
            .doc(postId)
            .update({
              likes: likes + 1,
            });
        }
      } 
      // else {
      //   docRef.doc(user?.displayName).set({
      //     alreadylike: true,
      //     username: user.displayName,
      //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      //   });
      // }
    });
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt="K" src={KaranAvatar} />
        <h2>{username}</h2>
      </div>
      <div>
        <img className="post__img" src={imageUrl} alt="" />
      </div>
      <div className="post__text">
        <strong>{username}: </strong>
        {caption}

        <div className="post__commentslistContainer">
          {comments1.map((comment) => (
            <p>
              <div className="post__commentslist">
                <div className="post__avatar">
                  <Avatar alt={user?.displayName} src={KaranAvatar} />
                </div>
                <div>
                  <strong> {comment?.username}</strong>:{comment?.text}
                </div>
              </div>
            </p>
          ))}
        </div>
      </div>
      <div className="post__likes">
        {likes > 1 ? (
          <strong> {likes} likes</strong>
        ) : (
          <strong> {likes} like</strong>
        )}
      </div>

      {user && (
        <form className="post__commentbox">
          <Button onClick={changeLikes}>
            {like.map((l) => {
              if (l.username === user?.displayName) {
                return l.alreadylike ? (
                  <FavoriteIcon className="post__heart" fonsize="small" />
                ) : (
                  <FavoriteBorderOutlinedIcon />
                );
              }
            })}
          </Button>
          <input
            className="post__comment"
            placeholder="Enter a comment.."
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            type="submit"
            // disable={!comment}
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
