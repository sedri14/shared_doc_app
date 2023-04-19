import React, { useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { SERVER_ADDRESS } from "../constants";

const Document = () => {
  const { docId } = useParams();
  const [document, setDocument] = useState(null);

  const loadDocument = (idNode) => {
    console.log("loading document..." + idNode);
    console.log("Seding a get request to:" + SERVER_ADDRESS + "doc/" + idNode);
    fetch(SERVER_ADDRESS + "doc/" + idNode, {
      method: "GET",
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
          console.log(body);
          setDocument(body.data);
          console.log(document);
        } else {
          alert(body.message);
        }
      })
      .catch((error) => {
        console.error(`ERROR: ${error}`);
      });
  };

  useEffect(() => {
    loadDocument(docId);
  }, [docId]);

  // const [content, setContent] = useState(document.content);

  // const handleContentChange = (event) => {
  //   setContent(event.target.value);
  // };

  // return (
  //   <main>
  //     {document && (
  //       <div>
  //         TEST DOC ${docId} ${document.name}
  //       </div>
  //     )}
  //   </main>
  // );

  return (
    <main className="container">
      {document && (
        <div className="row justify-content-center mt-3 mb-4">
          <div className="col-8">
            <div className="document">
              <header>
                <small>id: {docId}</small>
                <h1>{document.name}</h1>
                <div>
                  <p>
                    Created on {document.creationDate}
                    <br />
                    Last edited on {document.lastEdited}
                  </p>
                </div>
              </header>
              <main>
                <textarea
                  value={document.content}
                  //onChange={handleContentChange}
                />
              </main>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Document;
