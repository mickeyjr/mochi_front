import EmployeeForm from "../components/EmployeeForm";

export default function EmployeePage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4"> Registrar Empleado </h1>
      <EmployeeForm />
    </div>
  );
}
