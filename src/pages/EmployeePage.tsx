import EmployeeForm from "../components/EmployeeForm";

export default function EmployeePage() {
  return (

    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6"> Registrar Empleado </h1>
      <div className="w-full max-w-2xl"></div>
      <EmployeeForm />
    </div>
  );
}
