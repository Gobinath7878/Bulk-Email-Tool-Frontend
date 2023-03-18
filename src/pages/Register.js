import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import registerImg from "../assets/loginImg.png";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: undefined,
    email: undefined,
    password: undefined,
  });

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(
        `https://bulk-email-tool-backend-ulpd.onrender.com/api/v1/auth/register`,
        {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ credentials }),
        }
      );
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message + "/ User already Exist");
      } else {
        dispatch({ type: "REGISTER_SUCCESS" });
        navigate("/");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <Container className="d-flex align-items-center justify-content-center login-container mt-3">
        <Row>
          <Col lg="4" className="loginImg">
            <img src={registerImg} alt="Loading..." />
          </Col>
          <Col lg="8" className="form-container">
            <Form onSubmit={handleClick} className="login-input">
              <FormGroup>
                <label htmlFor="login" className="mb-4 py-2 fs-4 fw-bold ">
                  Welcome!
                  <br />
                  <span className="text-secondary fs-6">
                    Register your Account!
                  </span>
                </label>
                <br />
                <input
                  type="text"
                  placeholder="Username"
                  required
                  id="username"
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <input
                  type="text"
                  placeholder="Email"
                  required
                  id="email"
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <input
                  type="password"
                  placeholder="password"
                  required
                  id="password"
                  onChange={handleChange}
                />
              </FormGroup>
              <Button
                variant="dark"
                type="submit"
                className="border-0"
                style={{ backgroundColor: loading ? "green" : "" }}
              >
                {loading ? "Registering..." : "Register"}{" "}
              </Button>
              <p className="text-secondary fw-bold fs-6">
                Already have an account?
                <Link to="/login" className="fs-5">
                  {" "}
                  &nbsp;&nbsp;Login
                </Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Register;
