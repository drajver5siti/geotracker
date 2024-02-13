import { useContext } from "react";
import Map from "./Map";
import { APIProvider } from "@vis.gl/react-google-maps";
import LocationUpdater from "./LocationUpdater";
import { TrucksContext } from "../context/TrucksContext";
import { WebSocketContext } from "../context/WebSocketContext";
import { FaTruckFront } from "react-icons/fa6";
import { AuthContext } from "../context/AuthContext";

const MainDashboard = () => {

    const { availableTrucks } = useContext(TrucksContext);
    const { sendJsonMessage } = useContext(WebSocketContext);
    const { username } = useContext(AuthContext)

    const handleSubscribe = (id: string) => {
        sendJsonMessage(
            { 
                type: 'subscribe',
                target: id
            }
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr' }}>
            <div>
                Your username is: {username} <br/>
                <LocationUpdater /> <br/> <br/>
                {availableTrucks.map((t) => (
                    <div key={t.id} style={{ display: 'flex', columnGap: '5px' }}>
                        <FaTruckFront fontSize={'1.2rem'} />
                        <span>{t.id }</span>
                        <button style={{  }} onClick={() => handleSubscribe(t.id)}>
                            Follow
                        </button>
                    </div>
                ))}

            </div>
            <div>
                <APIProvider  apiKey={import.meta.env.VITE_MAPS_API_KEY}>
                    <Map />
                </APIProvider>
            </div>
        </div>
    )
}

export { MainDashboard };
export default MainDashboard;