import { Dropdown, Menu } from "antd";
import { FolderTwoTone, FileTwoTone, DeleteOutlined } from "@ant-design/icons";
import { useGlobalContext } from "../../../context";
import { useNavigate } from "react-router-dom";

const ShowItems = ({ title, items }) => {
  const { setSelectedInodeId, setCurrentFolder } = useGlobalContext();

  const navigate = useNavigate();

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
      //setSelectedInodeType(type);
      //setSelectedInodeName(name);
      //open confirmation delete modal
      //showModal();
    }
  };

  const handleDbClickINode = (event, inodeId) => {
    let inode = items.find((inode) => inode.id === inodeId);
    console.log(
      (inode.type === "DIR" ? "DIR " : "FILE ") +
        "double clicked: " +
        inode.id +
        " " +
        inode.name
    );
    // setSelectedINode(inode);
    // setSelectedInodeId(inode.id);
    if (inode.type === "FILE") {
      //navigate(docLoadURL + `${inode.id}`);
      console.log("file clicked");
    } else {
      //inode.type === "DIR"
      //setCurrentParentId(inode.id);
      setCurrentFolder(inode);
      navigate(`/dashboard/folder/${inodeId}`);
    }
  };

  return (
    <div className="w-100">
      <h4 className="border-bottom py-4">{title}</h4>
      <div className="row gap-2 p-4 flex-wrap">
        {items.map((item, index) => {
          const { id, name, type } = item;
          return (
            <Dropdown
              overlay={menu(id, type, name)}
              trigger={["contextMenu"]}
              key={id}
            >
              <p
                key={index * 55}
                className="col-md-2 py-3 text-center d-flex flex-column border"
                onDoubleClick={(event) => {
                  handleDbClickINode(event, id);
                }}
              >
                {type === "DIR" ? (
                  <FolderTwoTone
                    twoToneColor="#36a326"
                    style={{ fontSize: "24px" }}
                    className="mb-3"
                  />
                ) : (
                  <FileTwoTone
                    twoToneColor="#4d2cc7"
                    style={{ fontSize: "24px" }}
                    className="mb-3"
                  />
                )}
                {name}
              </p>
            </Dropdown>
          );
        })}
      </div>
    </div>
  );
};

export default ShowItems;
