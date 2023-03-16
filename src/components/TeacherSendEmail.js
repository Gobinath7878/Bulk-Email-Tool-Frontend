import { useState, useEffect } from "react";
import api from "../api";
import { Button } from "react-bootstrap";
import '../styles/sendEmail.css'

function TeacherSendEmail() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [teacherIds, setTeacherIds] = useState([]);
  const [Teacher, setTeacher] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    getTeacher();
  }, []);

  const getTeacher = async () => {
    try {
      const response = await api.get("/api/v1/teacher/getAll");
      setTeacher(response.data);
      setTeacherIds(response.data.map((teachers) => teachers._id)); // Set initial value to all Teacher IDs
    } catch (error) {
      console.log(error);
      setErrorMessage("Error retrieving Teacher");
    }
  };

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const selectedTeacher = Teacher.filter((teachers) =>
      teacherIds.includes(teachers._id)
      );
  
      const response = await api.post("/api/v1/send/email/teacher", {
        subject,
        message,
        teacher: selectedTeacher,
      });
      setShowSuccessMessage("Mail sent successfully to Teacher");
      setSubject("");
      setMessage("");
      setTeacherIds([]);
      // Fetch the updated Teacher list from the server
      const updatedResponse = await api.get("/api/v1/teacher/getAll");
      setTeacher(updatedResponse.data);
      console.log(response)
    } catch (error) {
      console.log(error);
      setErrorMessage("Error sending email");
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div className="sendEmail-container">
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={handleSubjectChange}
          required
        />
      </div>
      <div>
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          value={message}
          onChange={handleMessageChange}
          required
        ></textarea>
      </div>
      <Button type="submit"  className="button w-100 my-3 fw-bold">Send <i className="fa-solid fa-paper-plane text-success"></i></Button>
      <div>
        
        <label htmlFor="recipients">To:</label>
        <ul
          id="recipients"
          value={teacherIds}
          onChange={(event) => setTeacherIds(event.target.value)}
          multiple
        >
          {Teacher.map((teachers) => (
            <li key={teachers._id} value={teachers._id}>
              <i className="fa-solid fa-user-check text-success fs-6"></i> &nbsp;{teachers.email}
            </li>
          ))}
        </ul>
      </div>
      
      {errorMessage && <div>{errorMessage}</div>}
      {showSuccessMessage && (
        <div>Email sent successfully to Teacher.</div>
      )}
    </form>
  );
}

export default TeacherSendEmail;
