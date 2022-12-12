import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

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
    <div className="cweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="edit__form">
            <input
              placeholder="Edit your Cweet"
              onChange={onChange}
              type="text"
              value={newCweet}
              required
            />
            <button type="submit" className="edit">
              Edit
            </button>
          </form>
          <button className="cancel" onClick={toggleEditing}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <h4>{cweet.text}</h4>
          {cweet.fileURL && (
            <img
              width={50}
              height={50}
              src={cweet.fileURL}
              alt="cweet"
              className="cweet__img"
            />
          )}
          {isOwner && (
            <div className="edit__wrap">
              <button onClick={onDeleteClick}>
                <AiFillDelete className="delete__icon" />
              </button>
              <button onClick={toggleEditing}>
                <AiFillEdit className="update__icon" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Cweet;
