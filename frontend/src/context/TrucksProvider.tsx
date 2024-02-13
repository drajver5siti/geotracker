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
                const availableTrucks = lastMessage.data;
                setAvailableTrucks(availableTrucks)


                const trucksIds = trucks.map(x => x.id);
                const availableTrucksIds = availableTrucks.map(x => x.id);
                // Check if trucks array has a truck that is no longer available, if so remove it
                const diff = trucksIds.filter(x => !availableTrucksIds.includes(x));

                if (diff.length > 0) {
                    // Remove it from the truck array
                    setTrucks((prev) => prev.filter(x => !diff.includes(x.id)))
                }
                
                // setTrucks((prev) => prev.filter(x => lastMessage.data.includes(x)))
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