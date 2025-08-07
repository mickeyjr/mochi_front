import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StorePage from "./pages/StorePage";
import EmployeePage from "./pages/EmployeePage";
import './App.css'

export default function App() {
  return (
    <Router>
      <nav className="p-4 bg-blue-100 flex gap-4">
        <Link to="/store"> Registrar Tienda |</Link>
        <Link to="/employee"> Registrar Empleado </Link>
      </nav>
      <Routes>
        <Route path="/store" element={<StorePage />} />
        <Route path="/employee" element={<EmployeePage />} />
      </Routes>
    </Router>
  );
}
