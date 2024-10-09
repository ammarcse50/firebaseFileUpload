import JoditEditor from "jodit-react";
import { useEffect, useRef, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "./firebase.config";
import axios from "axios"

const UploadPage = () => {
  const [video, setVideo] = useState(undefined);
  const [photo, setPhoto] = useState(undefined);
  const [imgPer, setPhotoPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);
  const editor = useRef(null);
  const [inputs, setInputs] = useState({})
       
  const handleSubmit = e =>{
    e.preventDefault()

     axios.post('http://localhost:5000/fileUpload',{...inputs})
     console.log(inputs);
  }
  useEffect(() => {
    video && uploadFile(video, "videoUrl");
  }, [video]);
  useEffect(() => {
    photo && uploadFile(photo, "imgUrl");
  }, [photo]);

  const uploadFile = (file, fileType) => {
    // Create a root reference

    const storage = getStorage(app);
    const folder = fileType === "imgUrl" ? "images/" : "videos/";
    const fileName = new Date().getTime()+"_"+ file.name;
    const storageRef = ref(storage, folder + fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        fileType === "imgUrl"
          ? setPhotoPerc(Math.round(progress))
          : setVideoPerc(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setInputs((prev)=>{
            return {...prev,
              [fileType]: downloadURL
            }
          })
        });
      }
    );
  };
  
  return (
    <div>
      {/* <div className="form-control">
            <label className="label">
              <span className="label-text">Course Details*</span>
            </label>
            <div className="custom-class no-tailwind custom-ul custom-ol">
              <JoditEditor ref={editor} value={content} onChange={newContent => setContent(newContent)} />
            </div>
          </div> */}
 {photo && <img src={URL.createObjectURL(photo)} height={50} alt="" />}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="video">Video</label>{" "}
          {videoPerc > 0 && "Uploading: " + videoPerc + "%"}
          <br />
          <input
            type="file"
            accept="video/*"
            name="video"
            id="video"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        </div>
        <br />

        <div>
          <label htmlFor="photo">Photo</label>
          {imgPer > 0 && "Uploading: " + imgPer + "%"}
          <br />
          <input
            type="file"
            accept="photo/*"
            name="photo"
            id="photo"
            onChange={(e) => setPhoto(e.target.files[0])}
          />

          
        </div>

        <button type="submit">Submit</button>
      </form>

    </div>
  );
};

export default UploadPage;
