import React from "react";
import { useState } from "react";
import { Form, Row, Col, Container, Button } from "react-bootstrap";
import { SERVER_ADDRESS as SERVER_ADDRESS } from "../constants";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";

const userLoginURL = "auth/login";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setIsLoggedin, setCurrentUserEmail } = useGlobalContext();
  const [passWordShown, setPasswordShown] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    console.log(event);
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const userLogin = () => {
    console.log("Logging in...");
    console.log("Seding a post request to:" + SERVER_ADDRESS + userLoginURL);
    fetch(SERVER_ADDRESS + userLoginURL, {
      method: "POST",
      body: JSON.stringify(formData),
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
          localStorage.setItem("token", body.token);
          setIsLoggedin(true);
          localStorage.setItem("email", body.email);
          localStorage.setItem("rootId", body.rootId);
          navigate("/");
        } else {
          console.log(body.message);
        }
      })
      .catch((error) => {
        console.error(`ERROR: ${error}`);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    userLogin();
  };

  const togglePassword = () => {
    setPasswordShown(!passWordShown);
  };

  return (
    <main className="container">
      <div className="section">
        <Row className="justify-content-md-center mt-5">
          <Col md={4}>
            <div className="login-form">
              <h3>Login</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    name="email"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type={passWordShown ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    name="password"
                    onChange={handleInputChange}
                  />
                  <button onClick={togglePassword}>Show Password</button>
                </Form.Group>
                <Button variant="primary" type="submit" block>
                  Login
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </main>
  );
};
export default Login;
