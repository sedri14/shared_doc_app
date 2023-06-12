import React from "react";
import { useState } from "react";
import { SERVER_ADDRESS as SERVER_ADDRESS } from "../constants";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input } from "antd";

const registerURL = "auth/register";

const Register = () => {
  // const [formData, setFormData] = useState({
  //   email: "",
  //   name: "",
  //   password: "",
  // });

  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Success:", values);
    //setFormData({ ...formData, [values.name]: values.value });
    register(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const register = (values) => {
    console.log("Signing up..");
    console.log("Seding a post request to:" + SERVER_ADDRESS + registerURL);
    fetch(SERVER_ADDRESS + registerURL, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("status" + response.status);
        return Promise.all([response.status, response.json()]);
      })
      .then(([status, body]) => {
        if (status == 200) {
          navigate("/");
        } else {
          console.log(body.message);
        }
      })
      .catch((error) => {
        console.error(`ERROR: ${error}`);
      });
  };

  return (
    <Form
      name="basic"
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
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email",
          },
          { type: "email", message: "Input must be a valid email address" },
          { max: 100, message: "Email is too long" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input your name",
          },
          { max: 35, message: "Name is too long" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password",
          },
          { min: 4, message: "Password must be minimum 4 characters" },
          { max: 20, message: "Password must be up to 20 characters" },
        ]}
      >
        <Input.Password min={4} max={20} />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
