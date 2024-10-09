import { useState } from "react";

import "./App.css";
import axios from "axios";
const img_key = "31b8c3042470c9673a22cc6767e6a68f";
const img_api = `https://api.imgbb.com/1/upload?key=${img_key}`;
function App() {
  const [image, setImage] = useState(""); // images always string

  const handleImg = (e) => {
    e.preventDefault();

    const file = e.target.files[0];

    setImage(file);
  };

  const handleClick = () => {
    document
      .getElementById("uploadIcon")
      .addEventListener("click", function () {
        document.getElementById("fileInput").click();
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(image);
    // to send img to imgbb must confim sending img must be on object

    const imgFile = { image: e.target.image.files[0] };
    console.log("imgFile", imgFile);
    const res = await axios.post(img_api, imgFile, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    console.log(res.data.data.display_url);
  };

  return (
    <>
      <div onClick={handleClick}>
        {image ? (
          <img src={URL.createObjectURL(image)} width={120} alt="" />
        ) : (
          <img id="uploadIcon" src={"/upload.png"} />
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <input type="file" id="fileInput" name="image" onChange={handleImg} />
        <button type="submit">btn</button>
      </form>

      <h3>Image Posts</h3>
    </>
  );
}

export default App;
