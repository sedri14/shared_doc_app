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
  const [content, setContent] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [rawText, setRawText] = useState([]);
  const [prevCursorPosition, setPrevCursorPosition] = useState(0);

  useEffect(() => {
    if (null !== document) {
      console.log("Document details:", document);
      console.log(document.rawText);
      setRawText(document.rawText);
    }
  }, [document]);

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
        console.log("Subscribing to topics usersJoin and usersDiscommect of doc " + docId);
        stompClient.subscribe(`/topic/usersJoin/${docId}`, onJoinEventReceived);
        stompClient.subscribe(
          `/topic/usersDisconnect/${docId}`,
          onDisconnectEventReceived
        );
        console.log(`connecting to socket room /topic/updates/${docId}`);
        stompClient.subscribe(`/topic/updates/${docId}`, onUpdateEventReceived);
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

      const onUpdateEventReceived = (event) => {
        console.log("NEW TEXT UPDATE RECIEVED");
        const updatedRawText = JSON.parse(event.body);
        console.log("WHAT RETURNED FROM SOCKET: ", updatedRawText);
        setRawText(updatedRawText);
        setCursorPosition(prevCursorPosition + 1);
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

  const sendMessage = (message) => {
    if (stompClient.connected) {
      stompClient.send(`/app/update/${docId}`, {}, JSON.stringify(message));
    } else {
      console.log(
        "WebSocket connection is not established yet. Message not sent."
      );
    }
  };

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
          setDocument(body);
          setRawText(body.rawText)
        } else {
          alert(body.message);
        }
      })
      .catch((error) => {
        console.error(`ERROR: ${error}`);
      });
  };

  const convertRawTextToReadableText = () => {
    console.log("converting raw text to readable content");
    setContent(rawText.map((charItem) => charItem.val));
  };

  useEffect(() => {
    console.log("current raw text:", rawText);
    console.log("$$$$$$$$$$$$$", rawText);
    convertRawTextToReadableText();
  }, [rawText]);

  useEffect(() => {
    console.log("%%%%%CURRENT DOC CONTENT%%%%%", content);
  }, [content]);

  const handleContentChange = (event) => {
    const newChar = event.nativeEvent.data;
    console.log("Char insertion: " + newChar);

    const next = event.target.selectionStart - 1;
    console.log("current position:" + next);
    const prev =
      next - 1 >= 0 ? next - 1 : null;
    console.log("prev position:", prev);

    //const nextPosition = currentPosition + 1;
    //console.log("next position:", nextPosition);

    console.log(rawText);

    const message = {
      p: rawText.length === 0 ? [] : rawText[prev].pos,
      q: rawText.length === 0 || next >= rawText.length ? [] : rawText[next].pos,
      ch: newChar,
      email: localStorage.getItem("email")
    };

    console.log("Message To Socket:", message);
    setPrevCursorPosition(prev);
    console.log(prev);
    sendMessage(message);
  };

  const handleMouseMove = (event) => {
    const textarea = event.target;
    const { selectionStart } = textarea;

    setCursorPosition(selectionStart);
  };

  const handleKeyUp = (event) => {
    const textarea = event.target;
    const { selectionStart } = textarea;

    setCursorPosition(selectionStart);
  };

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
                  value={content.join("")}
                  onChange={handleContentChange}
                  onMouseMove={handleMouseMove}
                  onKeyUp={handleKeyUp}
                />
              </main>
              <p>Cursor Position: {cursorPosition}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Document;
