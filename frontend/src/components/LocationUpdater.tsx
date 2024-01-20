import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { WebSocketContext } from "../context/WebSocketContext";

const LocationUpdater = () => {
    const watcher = useRef<number | null>(null);
    const [updateLocation, setUpdateLocation] = useState(false);
    
    const { username } = useContext(AuthContext)
    const { sendJsonMessage } = useContext(WebSocketContext);

    // useEffect(() => {

    //     const interval = setInterval(() => {
    //         navigator.geolocation.getCurrentPosition(
    //             (pos) => sendJsonMessage({ id: username, type: "location", timestamp: Date.now(), data: { lng: pos.coords.longitude, lat: pos.coords.latitude }}),
    //             null,
    //             {
    //                 enableHighAccuracy: true
    //             }
    //         )

    //         return () => {
    //             clearInterval(interval);
    //         }

    //     }, 5000);


    // }, []);

    useEffect(() => {
        if (updateLocation === false) {
            if (watcher.current) {
                navigator.geolocation.clearWatch(watcher.current);
            }
            return;
        }

        watcher.current = navigator.geolocation.watchPosition(
            (pos) => sendJsonMessage({ id: username , type: "location", timestamp: Date.now(), data: { lng: pos.coords.longitude, lat: pos.coords.latitude } }),
            null,
            {
                enableHighAccuracy: true,
            }
        )

        return () => {
            if (watcher.current) {
                navigator.geolocation.clearWatch(watcher.current)
            }
        }

    }, [updateLocation, username, sendJsonMessage]);


    return (
        <label>
            Update your location:
            <input type="checkbox" checked={updateLocation} onChange={() => setUpdateLocation((prev) => !prev)} />
        </label>
    )
}

export { LocationUpdater };
export default LocationUpdater;