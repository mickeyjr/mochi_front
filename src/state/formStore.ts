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

type products = {
  idProduct: string,
  nombre: string,
  numeroDePiezas: number,
  imagen: string
}

interface SaleData {
  PaymentReceived: string;
  PaymentType: string;
  SalesLocation: string,
  IdStore: string, 
  IdCashRegister: string, 
  IdEmployee: string, 
  products: Array<products>, 
}

interface ProductData{
    CodigoChino: String,
    CodigoBarras: String,
    Nombre: String,
    Descripcion:String,
    PrecioCosto: number,
    PrecioUnitario: number,
    IdEmployee: String,
    PrecioPublico: number,
    Contenido: number,
    stock: number,
    EstadoDelProducto: String,
    InStock: boolean,
    GananciaPorUnidad: number,
    Fecha: string,
    RegistrationType: number,
    Imagen: String,
    FechaEndExits: String,
}
// 2. Define la forma del estado global
interface FormState {
  storeData: StoreData | null;
  employeeData: EmployeeData | null;
  saleData: SaleData | null;
  productData: ProductData| null;
  setStoreData: (data: StoreData) => void;
  setEmployeeData: (data: EmployeeData) => void;
  setSaleData: (data: SaleData) => void;
  setProductData: (data: ProductData) => void;
}

// 3. Crea el store con tipos
export const useFormStore = create<FormState>((set) => ({
  storeData: null,
  employeeData: null,
  saleData: null,
  productData: null,
  setStoreData: (data) => set({ storeData: data }),
  setEmployeeData: (data) => set({ employeeData: data }),
  setSaleData: (data) => set({saleData: data}),
  setProductData:(data) => set({productData: data}),
}));
