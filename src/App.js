import "./App.css";
import { useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/pages/HomePage";
import Footer from "./components/Footer";
import Document from "./components/Document";
import SharedWithMe from "./components/SharedWithMe";
import DashboardPage from "./components/pages/DashboardPage";
import Nav from "./components/Nav";
import NotFound from "./components/NotFound";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/shared-with-me" element={<SharedWithMe />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/doc/:docId" element={<Document />}></Route>
          <Route path="*" element={<NotFound />}></Route>
          <Route path="/dashboard/*" element={<DashboardPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
