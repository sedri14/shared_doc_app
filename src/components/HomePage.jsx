import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useGlobalContext } from "../context";
import { CiFolderOn, CiFileOn } from "react-icons/ci";
import { IconContext } from "react-icons";
import { useNavigate } from "react-router-dom";
import AddInodeForm from "./AddInodeForm";
import { SERVER_ADDRESS } from "../constants";

const docLoadURL = "doc/";

const HomePage = () => {
  const {
    isLoggedin,
    getChildren,
    inodes,
    selectedINode,
    setSelectedINode,
    currentDocId,
    setCurrentDocId,
    loadDocument,
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
      getChildren(localStorage.getItem("rootId"));
    }
  }, [isLoggedin]);

  useEffect(() => {

  }, [inodes]);

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
        //TODO: replace url to doc/:docId by cnhanging the currentDocId.
        setCurrentDocId(inode.id);
        navigate(docLoadURL + `${inode.id}`);
      } else {
        //open dir
      }
    }
  };

  if (isLoggedin) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <section className="section">
              <h5>
                Selected inode:
                {selectedINode !== null ? selectedINode.name : "not selected"}
              </h5>
              <h5>User connected</h5>

              <h1>Your Drive</h1>
              <section className="inodes">
                {inodes.map((inode) => {
                  const { id, name, creationDate, type } = inode;
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
          </div>
          <div className="col">
            <section>
              <div style={{ border: "1px solid black", padding: "10px" }}>
                <AddInodeForm />
              </div>
            </section>
          </div>
        </div>
      </div>
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

export default HomePage;
