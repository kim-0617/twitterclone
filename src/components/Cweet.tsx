import React, { useState } from "react";
import { dbService, storageService } from "../fbase";

function Cweet({ cweet, isOwner }: any) {
  const [editing, setEditing] = useState(false);
  const [newCweet, setNewCweet] = useState(cweet.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Really Delete??");
    if (ok) {
      // delete
      await dbService.doc(`cweets/${cweet.id}`).delete();
      await storageService.refFromURL(cweet.fileURL).delete();
    }
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { value } = target;
    setNewCweet(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dbService.doc(`cweets/${cweet.id}`).update({
      text: newCweet,
    });
    setEditing(false);
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              placeholder="Edit your Cweet"
              onChange={onChange}
              type="text"
              value={newCweet}
              required
            />
            <input type="submit" value="Edit" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{cweet.text}</h4>
          {cweet.fileURL && (
            <img width={50} height={50} src={cweet.fileURL} alt="cweet" />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Cweet</button>
              <button onClick={toggleEditing}>Edit Cweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Cweet;
