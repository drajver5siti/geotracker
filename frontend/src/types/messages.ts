import { AvailableTruck, Truck } from "./trucks"

type AvailableTrucksMessage = {
    type: "available_trucks",
    data: AvailableTruck[]
}

type TrucksMessage = {
    type: "trucks",
    data: Truck[]
}

type TruckMessage = {
    type: "truck",
    data: Truck
}

export type ServerMessage = (
    | AvailableTrucksMessage
    | TrucksMessage
    | TruckMessage
);