import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  UploadOutlined,
  FileAddOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";
import { useGlobalContext } from "../../../context";

const SubBar = () => {
  const navigate = useNavigate();
  const { path, currentFolder, setCurrentFolder, getChildren } =
    useGlobalContext();

  const handleNavigate = (link, id) => {
    navigate(link);
    setCurrentFolder({ id: id });
    getChildren(id);
  };

  return (
    <nav className="navbar navbar-expand-lg mt-2 navbar-light bg-white py-2 px-5">
      <nav className="ms-5" aria-label="breadcrumb">
        <ol className="breadcrumb d-flex align-items-center">
          {currentFolder.id !== localStorage.getItem("rootId") ? (
            <>
              <button
                onClick={() =>
                  handleNavigate("/dashboard", localStorage.getItem("rootId"))
                }
                className="breadcrumb-item btn btn-link text-decoration-none"
              >
                Root
              </button>
              {console.log("Path:", path)}
              {path &&
                path.map((pathItem, index) => {
                  return (
                    <button
                      key={index}
                      className="breadcrumb-item btn btn-link text-decoration-none"
                      onClick={() =>
                        handleNavigate(
                          `/dashboard/folder/${pathItem.id}`,
                          pathItem.id
                        )
                      }
                    >
                      {pathItem.name}
                    </button>
                  );
                })}

              <li className="breadcrumb-item active">{currentFolder.name}</li>
            </>
          ) : (
            <>
              <li className="breadcrumb-item" active>
                Root
              </li>
            </>
          )}
        </ol>
      </nav>
      <ul className="navbar-nav ms-auto">
        <li className="nav-item mx-2">
          <Button>
            <UploadOutlined />
            Upload Txt File
          </Button>
        </li>
        <li className="nav-item mx-2">
          <Button>
            <FileAddOutlined />
            Create File
          </Button>
        </li>
        <li className="nav-item mx-2">
          <Button>
            <FolderAddOutlined />
            Create Folder
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default SubBar;
