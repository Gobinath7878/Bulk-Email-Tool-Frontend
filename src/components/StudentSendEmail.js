import { useState, useEffect } from "react";
import api from "../api";
import { Button } from "react-bootstrap";
import '../styles/sendEmail.css'
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

function SendEmail() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientIds, setRecipientIds] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
 
  useEffect(() => {
    getRecipients();
  }, []);

  const getRecipients = async () => {
    try {
      const response = await api.get("/api/v1/recipient/getAll");
      setRecipients(response.data);
      setRecipientIds(response.data.map((recipient) => recipient._id)); // Set initial value to all recipient IDs
    } catch (error) {
      console.log(error);
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
      setIsLoading(true);
      const selectedRecipients = recipients.filter((recipient) =>
        recipientIds.includes(recipient._id)
      );
  
      const response = await api.post("/api/v1/recipient/send/mail", {
        subject,
        message,
        recipients: selectedRecipients,
      });
      toast.success(response.data.message);
      setSubject("");
      setMessage("");
      setRecipientIds([]);
      // Fetch the updated recipient list from the server
      const updatedResponse = await api.get("/api/v1/recipient/getAll");
      setRecipients(updatedResponse.data);
      
    } catch (error) {
      console.log(error);
      toast.error("Error sending mails");
    }
    finally {
      setIsLoading(false);
    }
  };
  

  return (
    <>
    <ToastContainer/>
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
      <Button
          type="submit"
          className="button w-100 my-3 fw-bold"
          disabled={isLoading}
          style={{ backgroundColor: isLoading ? "green" : "" }}
        >
          {isLoading ? "Sending..." : "Send"}{" "}
          <i className="fa-solid fa-paper-plane text-success"></i>
        </Button>
      <div>
        <label htmlFor="recipients">To:</label>
        {recipients.length ===0 ?(<><p className="mt-3 bg-warning text-center p-2 rounded-2 text-white">
        Loading...</p></>):(
        <ul
          id="recipients"
          value={recipientIds}
          onChange={(event) => setRecipientIds(event.target.value)}
          multiple
        >
          {recipients.map((recipient) => (
            <li key={recipient._id} value={recipient._id}>
             <i className="fa-solid fa-user-check text-success fs-6"></i> &nbsp; {recipient.email}
            </li>
          ))}

        </ul>
        )}
      </div>
    </form>
    </>
  );
}

export default SendEmail;
