import {
    Map as GoogleMap,
} from "@vis.gl/react-google-maps"
import { useContext } from "react";
import { TrucksContext } from "../context/TrucksContext";
import TruckMarker from "./TruckMarker";

const Map = () => {
    const position = { lat: 41.9981, lng: 21.4254 }

    const { trucks } = useContext(TrucksContext);

    return (
        <div style={{ height: '100vh' }}>
            <GoogleMap
                zoom={12}
                center={position}
                mapId={import.meta.env.VITE_MAPS_MAP_ID}
            >
                {trucks.map((t) => (
                    <TruckMarker key={t.id} truck={t} />
                ))}
            </GoogleMap>
        </div>
    )
}

export { Map }
export default Map