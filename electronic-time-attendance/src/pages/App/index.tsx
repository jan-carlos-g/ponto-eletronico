import React from "react";
import { Row, Col } from "reactstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./../Login";
import Home from "./../Home";
import "./style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Row>
          <Col md="12">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </Col>
        </Row>
      </div>
      <ToastContainer />
    </Router>
  );
};

export default App;
