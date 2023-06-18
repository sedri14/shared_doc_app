import React, { useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { SERVER_ADDRESS } from "../constants";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import OnlineUsers from "./OnlineUsers";
import { ShareAltOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import ShareModal from "./ShareModal";
import { useGlobalContext } from "../context";

const getDocURL = "doc/getDoc/";

const Document = () => {
  const { docId } = useParams();
  const [document, setDocument] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [rawText, setRawText] = useState([]);
  const textareaRef = useRef(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [connectedUserRole, setConnectedUserRole] = useState(null);
  const { selectedInodeId } = useGlobalContext();

  const showModal = () => {
    setIsShareModalOpen(true);
  };

  const handleShareClick = (key, type, id, name) => {
    showModal();
  };

  useEffect(() => {
    if (null !== document) {
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
        console.log(
          "Subscribing to topics usersJoin and usersDiscommect of doc " + docId
        );
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
    console.log(">>>>>>>>>>>loading document..." + idNode);
    console.log(
      "Seding a get request to:" + SERVER_ADDRESS + getDocURL + idNode
    );
    fetch(SERVER_ADDRESS + getDocURL + idNode, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        inodeId: idNode,
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
          setRawText(body.rawText);
          setCursorPosition(rawText.length);
          setConnectedUserRole(body.userRole);
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

  const handleArrowKeyDown = (arrowKeyType) => {
    if (arrowKeyType === "ArrowLeft") {
      if (cursorPosition <= 0) return;

      setCursorPosition(cursorPosition - 1);
    }

    if (arrowKeyType === "ArrowRight") {
      if (cursorPosition >= rawText.length) return;

      setCursorPosition(cursorPosition + 1);
    }
  };

  useEffect(() => {
    console.log("#####state of rawText:", rawText);
    convertRawTextToReadableText();
    //update cursor position
    setCursorPosition(cursorPosition + 1);
  }, [rawText]);

  useEffect(() => {
    console.log("%%%%%CURRENT DOC CONTENT%%%%%", content);
  }, [content]);

  const handleKeyDown = (event) => {
    event.preventDefault();
    let newChar = event.key;
    console.log("Char insertion: " + newChar);

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      handleArrowKeyDown(event.key);
      return;
    }

    if (event.key === "Enter") newChar = 10; //ascii value for newline

    const prev = cursorPosition - 1;
    console.log("prev position:", prev);
    const next = cursorPosition;
    console.log("current position:" + next);

    console.log(rawText);

    const message = {
      p: rawText.length === 0 ? [] : rawText[prev].pos,
      q:
        rawText.length === 0 || next >= rawText.length ? [] : rawText[next].pos,
      ch: newChar,
      email: localStorage.getItem("email"),
    };

    console.log("Message To Socket:", message);
    sendMessage(message);
  };

  const handleMouseMove = (event) => {
    const textarea = event.target;
    const { selectionStart } = textarea;

    setCursorPosition(selectionStart);
  };

  useEffect(() => {
    console.log("********************", cursorPosition);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition]);

  return (
    <main className="container">
      {document && (
        <div className="row justify-content-center mt-3 mb-4">
          <div className="col-8">
            <div className="document">
              {onlineUsers.length > 0 && (
                <OnlineUsers onlineUsers={onlineUsers} />
              )}
              {isShareModalOpen && (
                <ShareModal
                  id={selectedInodeId}
                  title={document.name}
                  isShareModalOpen={isShareModalOpen}
                  setIsShareModalOpen={setIsShareModalOpen}
                />
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
                  <Space wrap>
                    <h4>{`Connected as: ${connectedUserRole}`}</h4>
                  </Space>
                  <Space wrap>
                    {connectedUserRole === "OWNER" && (
                      <Button
                        type="primary"
                        icon={<ShareAltOutlined />}
                        onClick={handleShareClick}
                      >
                        Share
                      </Button>
                    )}

                    <Button type="primary" icon={<DownloadOutlined />}>
                      Download
                    </Button>
                  </Space>
                </div>
              </header>
              <main>
                <textarea
                  ref={textareaRef}
                  value={content.join("")}
                  onKeyDown={handleKeyDown}
                  onMouseMove={handleMouseMove}
                  disabled={connectedUserRole === "VIEWER"}
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
