import { createContext } from "react";
import { AvailableTruck, Truck } from "../types/trucks";

type ContextType = {
    trucks: Truck[],
    availableTrucks: AvailableTruck[]
}

export const TrucksContext = createContext<ContextType>({ trucks: [], availableTrucks: [] });