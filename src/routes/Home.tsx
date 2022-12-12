import { read } from "fs";
import React, { useState, useEffect, useContext } from "react";
import Cweet from "../components/Cweet";
import { UserContext } from "../context/UserContext";
import { dbService, storageService } from "../fbase";
import { v4 as uuidv4 } from "uuid";
import { BiMessageSquareAdd } from "react-icons/bi";
import { BsFillArrowRightCircleFill } from "react-icons/bs";

interface CweetData {
  id?: string;
  text?: string;
  createdAt?: number;
  author?: string;
}

function Home() {
  const [cweet, setCweet] = useState("");
  const [cweets, setCweets] = useState<CweetData[]>([]);
  const [fileString, setFileString] = useState<string>("");

  const { userObj }: any = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = dbService
      .collection("cweets")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const cweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCweets(cweetArray);
      });

    return () => unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let fileURL = "";
      if (fileString !== "") {
        const fileRef = storageService
          .ref()
          .child(`${userObj.uid}/${uuidv4()}`);
        const response = await fileRef.putString(fileString, "data_url");
        fileURL = await response.ref.getDownloadURL();
      }
      const cweetObj = {
        text: cweet,
        createdAt: Date.now(),
        author: userObj.uid,
        fileURL,
      };

      await dbService.collection("cweets").add(cweetObj);
      setCweet("");
      setFileString("");
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { value } = target;
    setCweet(value);
  };

  const onFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { files } = target;
    if (files) {
      const reader = new FileReader();
      reader.onloadend = (finishedEvent: any) => {
        setFileString(finishedEvent.target.result);
      };
      reader.readAsDataURL(files["0"]);
    }
  };

  const onClearPhoto = () => setFileString("");

  return (
    <div className="home__wrap">
      <form onSubmit={onSubmit} className="home__form">
        <input
          name="cweet"
          value={cweet}
          onChange={onChange}
          type="text"
          placeholder="what's on your mind?"
          maxLength={120}
        />
        <label htmlFor="fileInput" className="plus__icon__wrap">
          Add photos
          <BiMessageSquareAdd className="plus__icon" />
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ display: "none" }}
        />
        {fileString && (
          <div className="preview__wrap">
            <img src={fileString} alt="imgPreview" className="img__preview" />
            <button className="clear__photo" onClick={onClearPhoto}>
              Clear Photo
            </button>
          </div>
        )}
        <label htmlFor="submit__cweet" className="arrow__icon__wrap">
          <BsFillArrowRightCircleFill className="arrow__icon" />
        </label>
        <input
          type="submit"
          value="Cweet"
          id="submit__cweet"
          style={{ display: "none" }}
        />
      </form>

      <div>
        {cweets.map(
          (cweet: CweetData) =>
            cweet.createdAt && (
              <Cweet
                key={cweet.id}
                cweet={cweet}
                isOwner={cweet.author === userObj.uid}
                userObj={userObj}
              />
            )
        )}
      </div>
    </div>
  );
}

export default Home;
