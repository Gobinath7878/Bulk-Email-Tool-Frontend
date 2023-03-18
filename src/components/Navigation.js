import React,{useContext} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {Link,useNavigate } from 'react-router-dom'
import {AuthContext} from './../context/AuthContext'

function Navigation() {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };
  return (
    <>
      {['md'].map((expand) => (
        <Navbar key={expand} bg="light" expand={expand} className="py-3">
          <Container fluid>
            <Link to="/home" className='fw-bold mx-3 fs-3 school-name'>CheG<i className="fa-solid fa-graduation-cap"></i> School</Link>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Menu
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3 mx-5">
                  {user ? (<>
                  <NavDropdown
                    title={user.username}
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                    className='mx-2'
                  >
                    
                    <NavDropdown.Item onClick={logout}>
                      Logout
                    </NavDropdown.Item>
                    
                   
                  </NavDropdown>
                  <div className='d-flex gap-3 p-2'>
                  <Link to='/students' className='link'>Students</Link>
                        <Link to='/teachers' className='link'>Teachers</Link>
                        </div>
                  </>):(
                    <div className='d-flex gap-3 p-2'>
                        
                        <Link to='/' className='link'>Login</Link>
                        <Link to='/register' className='link'>Register</Link>


                    </div>
                  )}
                  
                </Nav>
                
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default Navigation;