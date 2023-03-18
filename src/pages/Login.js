import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import loginImg from '../assets/loginImg.png'


const Login = () => {
  const [loading,setLoading]=useState(false);

  const [credentials, setCredentials] = useState({
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
    dispatch({ type: "LOGIN_START", payload: credentials });
    try {
      setLoading(true)
      const res = await fetch(
        `https://bulk-email-tool-backend-ulpd.onrender.com/api/v1/auth/login`,
        {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(credentials),
        }
      );

      const result = await res.json();
      if (!res.ok){
      toast.error("User not found or Incorrect Credentials")
      } else{
      dispatch({ type: "LOGIN_SUCCESS", payload: result.data });
      
      navigate("/home");}
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.message });
    }
    finally{
      setLoading(false)
    }
  };

  return (
  <>
  <ToastContainer/>
      <Container className="login-container mt-3">
        <Row>
          <Col lg="8" className="form-container">

            <Form onSubmit={handleClick} className="login-input">
              
              <FormGroup>
                <label htmlFor="login" className="mb-4 py-2 fs-4 fw-bold ">Welcome!<br/>
               <span className="text-secondary fs-6">Please login to your Account!</span></label>
                <br />
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
              <Button className=" border-0" variant="dark" type="submit" 
              style={{ backgroundColor: loading ? "green" : "" }}>
                {loading ? "Logging in...":"Login"}{" "}
              </Button>
              <p className="text-secondary fw-bold fs-6">
              Don't have an account?
              <Link to="/register" className="fs-5"> &nbsp;&nbsp;create</Link>
            </p>
            </Form>        
          </Col>
          <Col lg="4" className="loginImg">
            <img src={loginImg} alt="Loading..."/>
            </Col>
        </Row>
      </Container>
  </>
  );
};

export default Login;
