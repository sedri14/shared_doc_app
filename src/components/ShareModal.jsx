import {
  Modal,
  Button,
  Avatar,
  Space,
  Form,
  Input,
  Radio,
  Tooltip,
} from "antd";
import { QuestionCircleFilled } from "@ant-design/icons";
import { SERVER_ADDRESS as SERVER_ADDRESS } from "../constants";
import { useGlobalContext } from "../context";
import { useEffect, useState } from "react";

const changeUserRoleURL = "fs/changeUserRole/";
const getDocumentRolesURL = "doc/roles/";
const ColorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];

const ShareModal = ({ id, title, isShareModalOpen, setIsShareModalOpen }) => {
  const { getChildren, currentParentId } = useGlobalContext();
  const [permissions, setPermissions] = useState([]);
  const [color, setColor] = useState(ColorList[0]);
  const [modalTitle, setModaltitle] = useState(`Share '${title}'`);

  const handleOk = () => {
    setIsShareModalOpen(false);
  };

  useEffect(() => {
    console.log("share modal open:" + isShareModalOpen);
  }, [isShareModalOpen]);

  useEffect(() => {
    console.log("permissions:", permissions);
  }, [permissions]);

  useEffect(() => {
    getDocumentRoles();
  }, []);

  const getDocumentRoles = () => {
    console.log(`Getting roles for document ${id}`);
    console.log(
      "Seding a post request to:" +
        SERVER_ADDRESS +
        getDocumentRolesURL +
        `${id}`
    );
    fetch(SERVER_ADDRESS + getDocumentRolesURL + `${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        inodeId: id,
      },
    })
      .then((response) => {
        console.log("status" + response.status);
        return Promise.all([response.status, response.json()]);
      })
      .then(([status, body]) => {
        if (status == 200) {
          setPermissions(body);
        } else {
          console.log(body.message);
        }
      })
      .catch((error) => {
        console.error(`ERROR: ${error}`);
      });
  };

  const addPermission = (newPermission) => {
    const updatedPermissions = [...permissions, newPermission];
    setPermissions(updatedPermissions);
  };

  const removePermission = (userEmail) => {
    const updatedPermissions = permissions.filter((p) => p.email !== userEmail);
    setPermissions(updatedPermissions);
  };

  function handleRemove(userEmail, docId) {
    console.log("Removing user with email:", userEmail);
    console.log(
      "Seding a post request to:" +
        SERVER_ADDRESS +
        changeUserRoleURL +
        `${docId}`
    );
    fetch(SERVER_ADDRESS + changeUserRoleURL + `${docId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        inodeId: docId,
      },
      body: JSON.stringify({
        email: userEmail,
        isDeleteRole: true,
      }),
    })
      .then((response) => {
        console.log("status" + response.status);
        return Promise.all([response.status, response.json()]);
      })
      .then(([status, body]) => {
        if (status == 200) {
          removePermission(userEmail);
          alert("User" + body.user + "now has no access to this document");
        } else {
          console.log(body.message);
        }
      })
      .catch((error) => {
        console.error(`ERROR: ${error}`);
      });
  }

  function addRole(role, docId) {
    console.log("Adding user with permission:", role.email);
    console.log(
      "Seding a post request to:" +
        SERVER_ADDRESS +
        changeUserRoleURL +
        `${docId}`
    );
    fetch(SERVER_ADDRESS + changeUserRoleURL + `${docId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        inodeId: docId,
      },
      body: JSON.stringify(role),
    })
      .then((response) => {
        console.log("status" + response.status);
        return Promise.all([response.status, response.json()]);
      })
      .then(([status, body]) => {
        if (status == 200) {
          getDocumentRoles();
        } else {
          alert(body.message);
        }
      })
      .catch((error) => {
        console.error(`ERROR: ${error}`);
      });
  }

  const handleFormFinish = (values, docId) => {
    values.isDeleteRole = false;
    console.log("Success:", values);
    addRole(values, docId);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        className="share-modal"
        title={modalTitle}
        open={isShareModalOpen}
        okText="Done"
        footer={[
          <Button key="done" onClick={handleOk}>
            Done
          </Button>,
        ]}
      >
        <Tooltip title="To change a user's permission type, you can add it again with the desired permission">
          <QuestionCircleFilled />
        </Tooltip>
        <h6>Add/change user permission</h6>
        <Form
          name="share"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={(values) => handleFormFinish(values, id)}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Space>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input an email address" },
                {
                  type: "email",
                  message: "Input must be a valid email address",
                },
                { max: 100, message: "Email is too long" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="userRole"
              rules={[{ required: true, message: "Please pick an item!" }]}
            >
              <Radio.Group>
                <Radio.Button value="EDITOR">Editor</Radio.Button>
                <Radio.Button value="VIEWER">Viewer</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Add
              </Button>
            </Form.Item>
          </Space>
        </Form>

        <h6>People With Access</h6>

        {permissions.map((permission) => {
          const { email, name, role } = permission;

          return (
            <div key={email} className="item">
              <Space size={16} wrap>
                <Avatar
                  style={{
                    backgroundColor: color,
                    verticalAlign: "middle",
                  }}
                  size="large"
                >
                  {email.charAt(0).toUpperCase()}
                </Avatar>
                <p>
                  {`${
                    name.charAt(0).toUpperCase() + name.slice(1)
                  }, (${email})`}
                  <strong>{`${role}`}</strong>
                  {role !== "OWNER" && (
                    <Button
                      danger
                      type="link"
                      onClick={() => handleRemove(email, id)}
                    >
                      Remove
                    </Button>
                  )}
                </p>
              </Space>
            </div>
          );
        })}
      </Modal>
    </>
  );
};

export default ShareModal;
