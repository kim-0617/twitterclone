import React, { useState, useEffect, useContext } from "react";
import { authService, dbService } from "../fbase";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Profile() {
  const navigate = useNavigate();
  const { userObj, refreshUser }: any = useContext(UserContext);
  const [newDisplayName, setNewDisplayName] = useState<string>(
    userObj.displayName
  );

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { value } = target;
    setNewDisplayName(value);
  };

  const getMyCweets = async () => {
    const cweets = await dbService
      .collection("cweets")
      .where("author", "==", userObj.uid)
      .orderBy("createdAt")
      .get();
    // console.log(cweets.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    getMyCweets();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          value={newDisplayName}
          onChange={onChange}
          type="text"
          placeholder="Display name"
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
}

export default Profile;
