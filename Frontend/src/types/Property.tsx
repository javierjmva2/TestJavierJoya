import { PropertyImage } from "./PropertyImage";
import { PropertyTrace } from "./PropertyTrace";

export interface Property {
    id: string;
    name: string;
    address: string;
    price: number;
    codeInternal: string;
    year: number;
    idOwner: string | null;
    images: PropertyImage[];
    traces: PropertyTrace[];
  }