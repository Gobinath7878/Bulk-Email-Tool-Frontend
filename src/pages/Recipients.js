import React, { useState, useEffect } from "react";
import api from "../api";
import { Container, Row, Col } from "react-bootstrap";
import SendMail from "../components/StudentSendEmail";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Table from "react-bootstrap/Table";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

function Recipients() {
  const [recipients, setRecipients] = useState([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [editedRecipient, setEditedRecipient] = useState("");
  const [editingRecipientId, setEditingRecipientId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [Loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //get all recipients
  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const response = await api.get("/api/v1/recipient/getAll");
        setRecipients(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecipients();
  }, []);

  //add recipients
  const handleAddRecipient = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await api.post("/api/v1/recipient/create", {
        email: newRecipient,
      });
      setRecipients([...recipients, response.data]);
      toast.success("Student added successfully");
      setNewRecipient("");
    } catch (error) {
      toast.error("Error adding Student (or) Email is already Exist");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecipient = async (id) => {
    try {
      await api.delete(`/api/v1/recipient/delete/${id}`);
      setRecipients(recipients.filter((recipient) => recipient._id !== id));
      toast.success("Student deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error deleting Student");
    }
  };

  const handleEditRecipient = async (id) => {
    setEditingRecipientId(id);
    const recipient = recipients.find((recipient) => recipient._id === id);
    setEditedRecipient(recipient.email);
  };

  const handleUpdateRecipient = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await api.put(
        `/api/v1/recipient/put/${editingRecipientId}`,
        {
          email: editedRecipient,
        }
      );
      setRecipients(
        recipients.map((recipient) =>
          recipient._id === editingRecipientId ? response.data : recipient
        )
      );
      setEditedRecipient("");
      setEditingRecipientId(null);
      toast.success("Student updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error updating student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container className="teacher-container p-5 mt-3">
        <Row>
          <Col lg="10">
            <div>
              <h2 className="fw-bold">
                <sup>
                  <i className="fa-solid fa-quote-left"></i>
                </sup>
                <span>Connecting Students,</span> <br />
                Empowering Education: Stay in Touch with Our Email Hub!
              </h2>

              <form onSubmit={handleAddRecipient}>
                <div className="input-container">
                  <input
                    type="email"
                    placeholder="Enter student Email"
                    value={newRecipient}
                    onChange={(event) => setNewRecipient(event.target.value)}
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
              <p>
                <span className="text-danger">*</span>It's important to ensure
                that the student's email address is correct, as this will be the
                primary way of communicating with them through the school
                website.
              </p>
            </div>

            <Offcanvas
              show={show}
              onHide={handleClose}
              placement="end"
              className="canvas-container"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Send Mail Form to Students</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <SendMail />
              </Offcanvas.Body>
            </Offcanvas>
          </Col>

          <Col lg="2" className="mt-2">
            <div>
              <Button className="mx-2 p-2 button fw-bold" onClick={handleShow}>
                <i className="fa-solid fa-envelope text-success mx-1"></i> Mail
                Form
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      <Container className="mt-3 p-0">
        <Row>
          <Col lg="9">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="p-3 px-4">Student's Email</th>
                  <th className="p-3">Edit</th>
                  <th className="p-3">Delete</th>
                </tr>
              </thead>

              <tbody>
                {recipients.map((recipient) => (
                  <tr key={recipient._id}>
                    <td>
                      {editingRecipientId === recipient._id ? (
                        <form onSubmit={handleUpdateRecipient}>
                          <label>
                            Email:
                            <input
                              type="text"
                              value={editedRecipient}
                              onChange={(event) =>
                                setEditedRecipient(event.target.value)
                              }
                            />
                          </label>
                          <Button
                            type="submit"
                            variant="success"
                            className="mx-2"
                            style={{ backgroundColor: Loading ? "green" : "" }}
                          >
                            {Loading ? "Saving..." : "Save"}{" "}
                          </Button>
                          <Button
                            type="button"
                            variant="warning"
                            className="mx-2"
                            onClick={() => setEditingRecipientId(null)}
                          >
                            Cancel
                          </Button>
                        </form>
                      ) : (
                        <span className="p-3">{recipient.email}</span>
                      )}
                    </td>
                    <td>
                      {editingRecipientId === recipient._id ? (
                        ""
                      ) : (
                        <div>
                          <Button
                            type="button"
                            variant="warning"
                            onClick={() => handleEditRecipient(recipient._id)}
                          >
                            <i className="fa-solid fa-user-pen"></i>
                          </Button>
                        </div>
                      )}
                    </td>
                    <td>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleDeleteRecipient(recipient._id)}
                      >
                        <i className="fa-solid fa-user-minus"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>

          <Col lg="3">
            <div className="circular">
              <h1>Weekend Student's Circular</h1>
              <p>Dear Students,</p>
              <p>
                We would like to inform you that there will be weekend classes
                for the upcoming month. The classes will take place on Saturdays
                and Sundays from 9am to 12pm. The subjects that will be covered
                are English, Math, and Science for grades 9 and 10.
              </p>
              <p>
                If you are not able to attend this special course in these
                weekend classes, please let us know by emailing us at
                mailto:chego@example.com We will provide you with the necessary
                materials and resources for teachin these classes in online.
              </p>
              <p className="signature">
                Thank you,
                <br />
                The Administration
              </p>
            </div>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
}

export default Recipients;
