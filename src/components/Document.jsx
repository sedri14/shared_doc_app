import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { SERVER_ADDRESS } from "../constants";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { useGlobalContext } from "../context";
import OnlineUsers from "./OnlineUsers";

const Document = () => {
  const { docId } = useParams();
  const [document, setDocument] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { currentUserEmail } = useGlobalContext();

  useEffect(() => {
    console.log(onlineUsers);
  }, [onlineUsers]);

  useEffect(() => {
    loadDocument(docId);

    const connectToWebSocket = () => {
      const socket = new SockJS(SERVER_ADDRESS + "ws");
      const stomp = Stomp.over(socket);
      stomp.connect({}, () => {
        console.log("Connected to websocket server");
        setStompClient(stomp);
      });
    };
    connectToWebSocket();
  }, [docId]);

  useEffect(() => {
    if (stompClient) {
      const onConnected = () => {
        console.log("Subscribing to topic /topic/usersJoin/" + docId);
        stompClient.subscribe(`/topic/usersJoin/${docId}`, onJoinEventReceived);
        stompClient.subscribe(
          `/topic/usersDisconnect/${docId}`,
          onDisconnectEventReceived
        );
        userJoin();
      };

      const onJoinEventReceived = (event) => {
        console.log("someone joined!");
        const message = JSON.parse(event.body);
        setOnlineUsers(message);
      };

      const onDisconnectEventReceived = (event) => {
        console.log("someone left!");
        const message = JSON.parse(event.body);
        setOnlineUsers(message);
      };

      const sendMessage = (message) => {
        if (stompClient.connected) {
          stompClient.send(`/app/update/${docId}`, {}, JSON.stringify(message));
        } else {
          console.log(
            "WebSocket connection is not established yet. Message not sent."
          );
        }
      };

      const userJoin = () => {
        const userEmail = localStorage.getItem("email");
        stompClient.send(
          `/app/join/${docId}`,
          {},
          JSON.stringify({ email: userEmail })
        );
      };

      const userDisconnect = () => {
        const userEmail = localStorage.getItem("email");
        stompClient.send(
          `/app/disconnect/${docId}`,
          {},
          JSON.stringify({ email: userEmail })
        );
      };

      // const addToOnlineUsers = (user) => {
      //   const alreadyOnline = onlineUsers.find((u) => u === user);
      //   if (alreadyOnline) return;
      //   const updatedOnlineUsers = [...onlineUsers, user];
      //   setOnlineUsers(updatedOnlineUsers);
      // };

      // const removeFromOnlineUsers = (user) => {
      //   const updatedOnlineUsers = onlineUsers.filter(
      //     (onlineUser) => onlineUser !== user
      //   );
      //   setOnlineUsers(updatedOnlineUsers);
      // };

      onConnected();

      return () => {
        userDisconnect();
        stompClient.disconnect();
      };
    }
  }, [stompClient, docId]);

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

  // const [content, setContent] = useState(document.content);

  // const handleContentChange = (event) => {
  //   setContent(event.target.value);
  // };

  return (
    <main className="container">
      {document && (
        <div className="row justify-content-center mt-3 mb-4">
          <div className="col-8">
            <div className="document">
              {onlineUsers.length > 0 && (
                <OnlineUsers onlineUsers={onlineUsers} />
              )}
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
