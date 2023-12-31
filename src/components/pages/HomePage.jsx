import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useGlobalContext } from "../../context";
import { FolderTwoTone, FileTwoTone } from "@ant-design/icons";
import { IconContext } from "react-icons";
import { useNavigate } from "react-router-dom";
import AddInodeForm from "../AddInodeForm";
import { Dropdown, Menu } from "antd";
import { DeleteOutlined } from "@ant-design/icons/lib/icons";
import DeleteModal from "../DeleteModal";

const docLoadURL = "doc/";

const HomePage = () => {
  const {
    isLoggedin,
    getChildren,
    inodes,
    selectedINode,
    setSelectedINode,
    selectedInodeId,
    setSelectedInodeId,
    // currentParentId,
    // setCurrentParentId,
    currentFolder,
    setCurrentFolder,
    cats,
    myCats,
  } = useGlobalContext();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInodeType, setSelectedInodeType] = useState("");
  const [selectedInodeName, setSelectedInodeName] = useState("");

  const showModal = () => {
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    console.log("show modal changed boolean");
  }, [isDeleteModalOpen]);

  useEffect(() => {
    console.log(currentFolder);
    getChildren(currentFolder);
  }, [currentFolder]);

  useEffect(() => {}, [inodes]);

  const menu = (id, type, name) => (
    <Menu
      onClick={({ key }) => handleMenuClick(key, type, id, name)}
      items={[
        {
          label: "Delete",
          key: "delete",
          icon: <DeleteOutlined />,
          danger: true,
        },
      ]}
    ></Menu>
  );

  const handleMenuClick = (key, type, id, name) => {
    console.log(`You clicked ${key} for ${type} ${name}, id: ${id}`);
    if (key === "delete") {
      setSelectedInodeId(id);
      setSelectedInodeType(type);
      setSelectedInodeName(name);
      //open confirmation delete modal
      showModal();
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedin) {
      getChildren(localStorage.getItem("rootId"));
      myCats();
    }
  }, []);

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
      setSelectedInodeId(inode.id);
      if (inode.type === "FILE") {
        navigate(docLoadURL + `${inode.id}`);
      } else {
        //inode.type === "DIR"
        setCurrentFolder(inode);
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
              {currentFolder && (
                <h5>
                  Current folder is: {currentFolder.id} {currentFolder.name}
                </h5>
              )}

              <h1>Your Drive</h1>
              <section className="inodes">
                {inodes.map((inode) => {
                  const { id, name, creationDate, type } = inode;

                  return (
                    <Dropdown
                      overlay={menu(id, type, name)}
                      trigger={["contextMenu"]}
                      key={id}
                    >
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
                              <FolderTwoTone twoToneColor="#36a326" />{" "}
                            </IconContext.Provider>
                          ) : (
                            <IconContext.Provider
                              value={{ className: "shared-class", size: 70 }}
                            >
                              <FileTwoTone twoToneColor="#4d2cc7" />{" "}
                            </IconContext.Provider>
                          )}
                        </div>

                        <div className="inode-name">{name}</div>
                      </div>
                    </Dropdown>
                  );
                })}
              </section>
            </section>
            <div>
              {isDeleteModalOpen && (
                <DeleteModal
                  id={selectedInodeId}
                  type={selectedInodeType}
                  name={selectedInodeName}
                  isDeleteModalOpen={isDeleteModalOpen}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                />
              )}
            </div>
          </div>
          <div className="col">
            <section>
              <div
                style={{
                  height: 150,
                  width: 400,
                  border: "1px solid black",
                  padding: "10px",
                }}
              >
                <AddInodeForm />
              </div>
            </section>
          </div>
        </div>

        <div className="cats">
          {cats.map((cat, index) => (
            <div key={index}>{cat}</div>
          ))}
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
