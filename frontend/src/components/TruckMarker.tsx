import { FaTruckFront } from "react-icons/fa6";
import {
    AdvancedMarker,
} from "@vis.gl/react-google-maps"
import { useState } from "react";
import { Truck } from "../types/trucks";

type Props = {
    truck: Truck
}

const TruckMarker = ({ truck }: Props) => {

    const [showName, setShowName] = useState(false);

    return (
        <AdvancedMarker position={{ lat: truck.lat, lng: truck.lng }} onClick={() => setShowName((prev) => !prev)} className="truck-marker">
            {showName && (
                <p>{truck.id}</p>
            )}
            <FaTruckFront fontSize={'1.2rem'} style={{ color: 'black' }} />
        </AdvancedMarker>
    )
}

export { TruckMarker };
export default TruckMarker;