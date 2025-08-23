import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import StorePage from "./pages/StorePage";
import EmployeePage from "./pages/EmployeePage";
import SalesPage from "./pages/SalesPage";
import ProductPage from "./pages/ProductPage";
import ProductByStorePage from "./pages/ProductByStorePage";
import { Menu, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function App() {
  const [open, setOpen] = useState(false); 

  return (
    <Router>
      <nav className="bg-blue-600 shadow-md text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <div className="text-xl font-bold">Sistema Mochi</div>

            {/* Links Desktop */}
            <div className="hidden md:flex gap-6 items-center">
              <NavLink to="/store" className={({ isActive }) => isActive ? "font-semibold border-b-2 border-white" : "hover:text-gray-200"}>
                Registrar Tienda
              </NavLink>
              <NavLink to="/employee" className={({ isActive }) => isActive ? "font-semibold border-b-2 border-white" : "hover:text-gray-200"}>
                Registrar Empleado
              </NavLink>
              <div className="relative">
                {/* Botón (peer) */}
                <button className="flex items-center gap-1 hover:text-gray-200 peer">
                  Ventas <ChevronDown size={16} />
                </button>

                {/* Dropdown */}
                <div
                  className="absolute left-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg 
      opacity-0 scale-95 
      peer-hover:opacity-100 peer-hover:scale-100 
      hover:opacity-100 hover:scale-100
      transform transition-all duration-200 z-20
    "
                >
                  <NavLink
                    to="/sales"
                    className="block px-4 py-2 hover:bg-blue-100"
                  >
                    Registrar Venta
                  </NavLink>
                  <NavLink
                    to="/sales-report"
                    className="block px-4 py-2 hover:bg-blue-100"
                  >
                    Reporte de Ventas
                  </NavLink>
                </div>
              </div>

              <NavLink to="/product" className={({ isActive }) => isActive ? "font-semibold border-b-2 border-white" : "hover:text-gray-200"}>
                Registrar Producto
              </NavLink>
              <NavLink to="/productByStore" className={({ isActive }) => isActive ? "font-semibold border-b-2 border-white" : "hover:text-gray-200"}>
                Producto por Tienda
              </NavLink>
            </div>

            {/* Botón hamburguesa (móvil) */}
            <button
              className="md:hidden p-2 rounded hover:bg-blue-500"
              onClick={() => setOpen(!open)}
            >
              <Menu />
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {open && (
          <div className="md:hidden bg-blue-500 flex flex-col gap-2 p-4">
            <NavLink to="/store" onClick={() => setOpen(false)}>Registrar Tienda</NavLink>
            <NavLink to="/employee" onClick={() => setOpen(false)}>Registrar Empleado</NavLink>

            {/* Submenú móvil (con details/summary) */}
            <details>
              <summary className="cursor-pointer py-2">Ventas</summary>
              <div className="pl-4 flex flex-col gap-1">
                <NavLink to="/sales" onClick={() => setOpen(false)}>Registrar Venta</NavLink>
                <NavLink to="/sales-report" onClick={() => setOpen(false)}>Reporte de Ventas</NavLink>
              </div>
            </details>

            <NavLink to="/product" onClick={() => setOpen(false)}>Registrar Producto</NavLink>
            <NavLink to="/productByStore" onClick={() => setOpen(false)}>Producto por Tienda</NavLink>
          </div>
        )}
      </nav>

      {/* Rutas */}
      <Routes>
        <Route path="/store" element={<StorePage />} />
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/productByStore" element={<ProductByStorePage />} />
        {/* <Route path="/sales-report" element={<SalesReportPage />} /> */}
      </Routes>
    </Router>
  );
}
