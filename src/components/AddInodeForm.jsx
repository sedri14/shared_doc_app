import React, { useState, useEffect } from "react";
import { SERVER_ADDRESS as SERVER_ADDRESS } from "../constants";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";

const addInodeURL = "fs/add";

const AddInodeForm = () => {
  const { getChildren, currentFolder } = useGlobalContext();
  const [type, setType] = useState("FILE");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const addInodeRequest = (messageBody) => {
    console.log(
      `Adding a new ${messageBody.type}, name: ${messageBody.name} under folder id ${messageBody.parentId}`
    );
    console.log(messageBody);
    console.log("Seding a post request to:" + SERVER_ADDRESS + addInodeURL);
    fetch(SERVER_ADDRESS + addInodeURL, {
      method: "POST",
      body: JSON.stringify(messageBody),
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((response) => {
        console.log("status" + response.status);
        return Promise.all([response.status, response.json()]);
      })
      .then(([status, body]) => {
        if (status == 200) {
          alert("inode added!");
          getChildren(currentFolder.id);
        } else {
          console.log(body.message);
        }
      })
      .catch((error) => {
        console.error(`ERROR: ${error}`);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Type:", type);
    console.log("Name:", name);

    const messageBody = {
      parentId: currentFolder.id,
      name: name,
      type: type,
    };

    addInodeRequest(messageBody);
    setType(type);
    setName("");
  };

  return (
    <div className="container">
      <h6>Add a new file/folder</h6>
      <form onSubmit={handleSubmit}>
        <label>
          Type:
          <select value={type} onChange={handleTypeChange}>
            <option value="FILE">File</option>
            <option value="DIR">Folder</option>
          </select>
        </label>
        <br />
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            maxLength={20}
          />
        </label>
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddInodeForm;
