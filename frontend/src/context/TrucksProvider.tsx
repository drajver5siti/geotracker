import { ReactNode, useContext, useEffect, useState } from "react";
import { TrucksContext } from "./TrucksContext";
import { WebSocketContext } from "./WebSocketContext";
import { AvailableTruck, Truck } from "../types/trucks";

const TrucksProvider = ({ children }: { children: ReactNode }) => {

    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [availableTrucks, setAvailableTrucks] = useState<AvailableTruck[]>([]);
    const { lastMessage } = useContext(WebSocketContext);

    useEffect(() => {
        if (lastMessage === null) return

        switch (lastMessage.type) {
            case 'truck':
                const truck = lastMessage.data;
                setTrucks((prev) => ([ ...prev.filter(x => x.id !== truck.id ), truck ]))
                break;
            case 'trucks':
                setTrucks(lastMessage.data);
                break;
            case 'available_trucks':
                setAvailableTrucks(lastMessage.data)
                break;

            default:
                break;
        }
    }, [lastMessage])

    return (
        <TrucksContext.Provider value={{ trucks, availableTrucks }}>
            {children}
        </TrucksContext.Provider>
    )
}

export { TrucksProvider };
export default TrucksProvider;