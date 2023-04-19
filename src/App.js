import "./App.css";
import Favorites from "./components/Favorites";
import Meals from "./components/Meals";
import Modal from "./components/Modal";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import Document from "./components/Document";
import Nav from "./components/Nav";
import NotFound from "./components/NotFound";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useGlobalContext } from "./context";

function App() {
  const { showModal, favorites } = useGlobalContext();
  return (
    <div>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route
            path="/login"
            element={
              <div>
                <Login />
                {/* {favorites.length > 0 && <Favorites />}
                <Meals />
                {showModal && <Modal />} */}
              </div>
            }
          ></Route>
          <Route path="/doc/:docId" element={<Document />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
