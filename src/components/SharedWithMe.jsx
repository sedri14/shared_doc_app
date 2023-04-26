import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import { CiFolderOn, CiFileOn } from "react-icons/ci";
import { IconContext } from "react-icons";
import { useNavigate } from "react-router-dom";
import { SERVER_ADDRESS } from "../constants";

const docLoadURL = "/doc";

const SharedWithMe = () => {
  const {
    isLoggedin,
    inodes,
    selectedINode,
    setSelectedINode,
    currentDocId,
    setCurrentDocId,
    loadDocument,
    getSharedWithMe,
  } = useGlobalContext();

  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log("Doc id has changed to: " + currentDocId);
  //   if (currentDocId) {
  //     loadDocument(currentDocId);
  //     navigate(`doc/${currentDocId}`);
  //   }
  // }, [currentDocId]);

  useEffect(() => {
    if (isLoggedin) {
      getSharedWithMe();
    }
  }, [isLoggedin]);

  const handleDbClickINode = (event, idNode) => {
    if (event.detail === 2) {
      let inode;
      inode = inodes.find((inode) => inode.id === idNode);
      console.log(
        (inode.type === "DIR" ? "Dir " : "FILE ") +
          "double clicked: " +
          inode.id +
          " " +
          inode.name
      );
      //console.log(inode);
      setSelectedINode(inode);
      if (inode.type === "FILE") {
        setCurrentDocId(inode.id);
        console.log("navigating to: " + docLoadURL + `${inode.id}`);
        navigate(docLoadURL + `/${inode.id}`);
      } else {
        //open dir
      }
    }
  };

  if (isLoggedin) {
    return (
      <section className="section">
        <h5>
          Selected inode:
          {selectedINode !== null ? selectedINode.name : "not selected"}
        </h5>
        <h5>User connected</h5>

        <h1>Shared With You</h1>
        <section className="inodes">
          {inodes.map((inode) => {
            const { id, name, creationDate, lastEdited, type, content } = inode;
            return (
              <div key={id} className="item">
                <div
                  className="icon"
                  onClick={(event) => {
                    handleDbClickINode(event, id);
                  }}
                >
                  {type === "DIR" ? (
                    <IconContext.Provider
                      value={{ className: "shared-class", size: 70 }}
                    >
                      <CiFolderOn />
                    </IconContext.Provider>
                  ) : (
                    <IconContext.Provider
                      value={{ className: "shared-class", size: 70 }}
                    >
                      <CiFileOn />
                    </IconContext.Provider>
                  )}
                </div>

                <div className="inode-name">{name}</div>
              </div>
            );
          })}
        </section>
      </section>
    );
  } else {
    return (
      <main className="container">
        <div className="row justify-content-center mt-3 mb-4">
          <div className="col-8">
            <h1 className="text-danger">HomePage</h1>
            <h2>Welcome to shared doc app!</h2>
            <h6>You are not connected.</h6>
          </div>
        </div>
      </main>
    );
  }
};

export default SharedWithMe;
