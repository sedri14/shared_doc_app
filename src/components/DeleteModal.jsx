import { Modal, message, Space } from "antd";
import { SERVER_ADDRESS as SERVER_ADDRESS } from "../constants";
import { useGlobalContext } from "../context";

const deleteInodeURL = "fs/delete";

const DeleteModal = ({
  id,
  type,
  name,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
}) => {
  const { getChildren, currentParentId } = useGlobalContext();

  const handleOk = () => {
    deleteInodeRequest(id);
    setIsDeleteModalOpen(false);
  };
  const handleCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const deleteInodeRequest = () => {
    console.log("Delete inode " + id);
    console.log(
      "Seding a post request to:" + SERVER_ADDRESS + deleteInodeURL + `/${id}`
    );
    fetch(SERVER_ADDRESS + deleteInodeURL + `/${id}`, {
      method: "DELETE",
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
            
          console.log("inode deleted!");
          getChildren(currentParentId);
        } else {
          console.log(body.message);
        }
      })
      .catch((error) => {
        console.error(`ERROR: ${error}`);
      });
  };

  console.log("DeleteModal rendered");
  return (
    <>
      <Modal
        title="Delete"
        open={isDeleteModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>
          Are you sure you want to delete{" "}
          {type == "DIR" ? "folder" : "document"} <strong>{name}</strong>?
        </p>
      </Modal>
    </>
  );
};

export default DeleteModal;
