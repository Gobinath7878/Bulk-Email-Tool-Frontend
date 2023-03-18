import React, { useState, useEffect } from "react";
import api from "../api";
import { Container, Row, Col } from "react-bootstrap";
import TeacherSendEmail from "../components/TeacherSendEmail";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Table from 'react-bootstrap/Table';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';


function Teacher() {
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState("");
  const [editedTeacher, setEditedTeacher] = useState("");
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [Loading, setLoading] = useState(false);

  

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //get all teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get("/api/v1/teacher/getAll");
        setTeachers(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTeachers();
  }, []);

  //add Teacher
  // const handleAddTeacher = async (event) => {
  //   event.preventDefault();
  //   try {
  //     setIsLoading(true);
  //     const response = await api.post("/api/v1/teacher/create", {
  //       email: newTeacher
  //     });
  //     setTeachers([...teachers, response.data]);
  //     toast.success("Teacher added successfully");
  //     setNewTeacher("");
    
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Error adding Teacher");
      
  //   }
  //   finally{
  //     setIsLoading(false)
  //   }
  // };
  const handleAddTeacher = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await api.post("/api/v1/teacher/create", {
        email: newTeacher
      });
     
        setTeachers([...teachers, response.data]);
        toast.success("Teacher added successfully");
        setNewTeacher("");
      
    } catch (error) {
      console.log(error);
      toast.error("Error adding Teacher (or) Email is already Exist");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleDeleteTeacher = async (id) => {
    try {
      await api.delete(`/api/v1/teacher/delete/${id}`);
      setTeachers(teachers.filter((teacher) => teacher._id !== id));
      toast.success("Teacher deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error deleting Teacher");
    }
  };

  const handleEditTeacher = async (id) => {
    setEditingTeacherId(id);
    const teacher = teachers.find((teacher) => teacher._id === id);
    setEditedTeacher(teacher.email);
    //console.log(teachers.email)
  };

  const handleUpdateTeacher = async (event) => {
    event.preventDefault();
    try {
      setLoading(true)
      const response = await api.put(
        `/api/v1/teacher/put/${editingTeacherId}`,
        {
          email: editedTeacher,
        }
      );
      setTeachers(
        teachers.map((teacher) =>
          teacher._id === editingTeacherId ? response.data : teacher
        )
      );
      setEditedTeacher("");
      setEditingTeacherId(null);
      toast.success("Teacher updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error updating Teacher");
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <>
      
      <Container className="teacher-container p-5 mt-3">
        <Row>
          <Col lg="10">
            <div>
            <h2 className='fw-bold'><sup><i className="fa-solid fa-quote-left"></i></sup><span>Connecting Teachers,</span> <br/>Empowering Education: Stay in Touch with Our Email Hub!</h2>
             
              <form onSubmit={handleAddTeacher}>
              <div className="input-container">
                 
                  <input
                    type="email"
                    placeholder="Enter teacher Email"
                    value={newTeacher}
                    onChange={(event) => setNewTeacher(event.target.value)}
                    required
                  />
                
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{ backgroundColor: isLoading ? "green" : "" }}
                    className="button-send w-25 mx-2"
                  >
                    {isLoading ? "Adding..." : "Add"}{" "}
                  </button>
                </div>
              </form>
              <p><span className="text-danger">*</span>It's important to ensure that the teacher's email address is correct, as this will be the primary way of communicating with them through the school website.</p>

            </div>
        

            <Offcanvas show={show} onHide={handleClose} placement="end" className="canvas-container">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Send Mail Form for Teachers</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <TeacherSendEmail />
              </Offcanvas.Body>
            </Offcanvas>
          </Col>

          <Col lg='2' className="mt-2">
                  <div>
                    
                    <Button
              className="mx-2 p-2 button fw-bold"
              onClick={handleShow}
            >
              <i className="fa-solid fa-envelope text-success"></i> Mail Form
            </Button>
                  </div>
                </Col>
        </Row>
      </Container>
      
      <Container className="mt-3 p-0">
        <Row>
          <Col lg='9'>
          <Table striped bordered hover>
  <thead>
    <tr>
      <th className="p-3 px-4">Teacher's Email</th>
      <th className="p-3">Edit</th>
      <th className="p-3">Delete</th>
    </tr>
  </thead>
  <tbody>
    {teachers.map((teacher) => (
      <tr key={teacher._id}>
        <td>
          {editingTeacherId === teacher._id ? (
            <form onSubmit={handleUpdateTeacher}>
              <label>
                Email:
                <input
                  type="text"
                  value={editedTeacher}
                  onChange={(event) => setEditedTeacher(event.target.value)}
                />
              </label>
                    
              <Button type="submit" variant="success" className="mx-2" style={{ backgroundColor: Loading ? "green" : "" }} >
              {Loading ? "Saving..." : "Save"}{" "}
              </Button>
              <Button
                type="button"
                variant="warning"
                className="mx-2"
                onClick={() => setEditingTeacherId(null)}
              >
                Cancel
              </Button>
            </form>
          ) : (
            <span className="p-3">{teacher.email}</span>
          )}
        </td>
        <td>
          {editingTeacherId !== teacher._id && (
            <Button
              type="button"
              variant="warning"
              onClick={() => handleEditTeacher(teacher._id)}
            >
              <i className="fa-solid fa-user-pen"></i>
            </Button>
          )}
        </td>
        <td>
          <Button
            type="button"
            variant="danger"
           
            onClick={() => handleDeleteTeacher(teacher._id)}
          >
            <i className="fa-solid fa-user-minus"></i>
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>

          </Col>
          <Col lg='3'>
            <div className="circular">
            <h1>Weekend Teacher's Circular</h1>
	<p>Dear Teachers,</p>
	<p>We would like to inform you that there will be weekend classes for the upcoming month. The classes will take place on Saturdays and Sundays from 9am to 12pm. The subjects that will be covered are English, Math, and Science for grades 9 and 10.</p>
	<p>If you are interested in teaching these weekend classes, please let us know by emailing us at mailto:chego@example.com We will provide you with the necessary materials and resources for teaching these classes.</p>
	<p className="signature">Thank you,<br/>The Administration</p>

            </div>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
}

export default Teacher;
