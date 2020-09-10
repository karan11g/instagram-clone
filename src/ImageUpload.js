import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { storage, db } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("ck");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const imageInputRef = React.useRef();

  const handleChange = (e) => {
    if (e.target.files[0]) {
      console.log(e.target.files[0]);
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const UploadTask = storage.ref(`images/${image.name}`).put(image);
    UploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //Error Message
        console.log(error);
        alert(error.message);
      },
      () => {
        // Complete function..
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //post image inside db
            db.collection("instagram").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
              likes:0
            });
            setProgress(0);
            setCaption("");
            imageInputRef.current.value = "";
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageupload">
      <progress className="imageupload__progress" value={progress} max="100" />
      <input className="imageupload__caption"
        placeholder="Enter a caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        type="text"
      />
      <input clasName="imageupload__file" type="file" onChange={handleChange} ref={imageInputRef} />
      <Button className="imageupload__uploadbutton" onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
