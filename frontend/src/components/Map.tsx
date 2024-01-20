import {
    Map as GoogleMap,
    AdvancedMarker,
} from "@vis.gl/react-google-maps"
import { useContext } from "react";
import { FaTruckFront } from "react-icons/fa6";
import { TrucksContext } from "../context/TrucksContext";

const Map = () => {
    const position = { lat: 41.9981, lng: 21.4254 }

    const { trucks } = useContext(TrucksContext);

    return (
        <div style={{ height: '100vh' }}>
            <GoogleMap
                zoom={12}
                center={position}
                mapId={"502919b987dc08f6"}
            >
                {trucks.map((t) => (
                    <AdvancedMarker key={t.id} position={{ lat: t.lat, lng: t.lng }}>
                        <FaTruckFront fontSize={'1.2rem'} style={{ backgroundColor: 'white', color: 'black', 'padding': '4px', borderRadius: '5px'}} />
                    </AdvancedMarker>
                ))}
            </GoogleMap>
        </div>
    )
}

export { Map }
export default Map