// src/state/formStore.ts
import { create } from 'zustand';

// 1. Define las interfaces para los datos
interface StoreData {
  name: string;
  address: string;
}

interface EmployeeData {
  FullName: string;
  Position: string;
  Age: string,
  Role: string, 
  StartDate: string, 
  IdStore: string, 
  Address:string, 
  Birthday: string 
}

// 2. Define la forma del estado global
interface FormState {
  storeData: StoreData | null;
  employeeData: EmployeeData | null;
  setStoreData: (data: StoreData) => void;
  setEmployeeData: (data: EmployeeData) => void;
}

// 3. Crea el store con tipos
export const useFormStore = create<FormState>((set) => ({
  storeData: null,
  employeeData: null,
  setStoreData: (data) => set({ storeData: data }),
  setEmployeeData: (data) => set({ employeeData: data }),
}));
