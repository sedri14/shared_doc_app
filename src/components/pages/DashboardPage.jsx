import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SubBar from "../DashboardComponents/SubBar/SubBar";
import { useGlobalContext } from "../../context";
import FolderComponent from "../DashboardComponents/FolderComponent/FolderComponent";
import HomeComponent from "../DashboardComponents/HomeComponent/HomeComponent";

const DashboardPage = () => {
  const {
    isLoggedin,
    getChildren,
    inodes,
    // currentParentId,
    // setCurrentParentId,
    currentFolder,
    setCurrentFolder
  } = useGlobalContext();
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInodeType, setSelectedInodeType] = useState("");
  const [selectedInodeName, setSelectedInodeName] = useState("");

  useEffect(() => {
    if (!isLoggedin) {
      navigate("/");
    } else {
      console.log(
        "Dashboard component mount with current inode id",
        currentFolder.id
      );
      //setCurrentParentId(localStorage.getItem("rootId"));
    }
  }, []);

  useEffect(() => {
    getChildren(currentFolder.id);
  }, [currentFolder]);

  useEffect(() => {
    console.log(inodes);
  }, [inodes]);

  return (
    <>
      <h1>Welcome to Dashboard</h1>
      <SubBar />
      <Routes>
        <Route path="" element={<HomeComponent />} />
        <Route path="folder/:folderId" element={<FolderComponent />} />
      </Routes>
    </>
  );
};

export default DashboardPage;
