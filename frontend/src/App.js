import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./Components/Admin";
// import EditStock from "./Components/EditStock"; // Import the component you want to render for /editstock
import Editpage from "./Components/Editpage";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Admin />} /> {/* Default route */}
          <Route path="/editstock" element={<Editpage />} /> {/* Renders EditStock on /editstock */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
