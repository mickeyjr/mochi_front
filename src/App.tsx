import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StorePage from "./pages/StorePage";
import EmployeePage from "./pages/EmployeePage";
import SalesPage from "./pages/SalesPage";
import ProductPage from "./pages/ProductPage";
import ProductByStorePage from "./pages/ProductByStorePage";
import './App.css'

export default function App() {
  return (
    <Router>
      <nav className="p-4 bg-blue-100 flex gap-4">
        <Link to="/store"> Registrar Tienda |</Link>
        <Link to="/employee"> Registrar Empleado |</Link>
        <Link to="/sales"> Registra Venta |</Link>
        <Link to="/product"> Registra Producto |</Link>
        <Link to="/productByStore"> Registra Producto por tienda |</Link>

      </nav>
      <Routes>
        <Route path="/store" element={<StorePage />} />
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/productByStore" element={<ProductByStorePage />} />

      </Routes>
    </Router>
  );
}
