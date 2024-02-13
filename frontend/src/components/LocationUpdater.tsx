import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { WebSocketContext } from "../context/WebSocketContext";


const clearWatcher = (watcher: number | null) => {
    if (watcher === null) return;
    navigator.geolocation.clearWatch(watcher);
}

const LocationUpdater = () => {
    const watcher = useRef<number | null>(null);
    const [updateLocation, setUpdateLocation] = useState(false);
    const [lastLocation, setLastLocation] = useState<{lat: number|null, lng: number|null}>({ lat: null, lng: null });

    const { username } = useContext(AuthContext)
    const { sendJsonMessage } = useContext(WebSocketContext);

    const handleUpdateLocation = (lat: number, lng: number) => {
        setLastLocation({ lat, lng });
        sendJsonMessage({ 
            id: username, 
            type: "location", 
            timestamp: Date.now(), 
            data: { 
                lng, 
                lat 
            } 
        })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (!updateLocation || !lastLocation.lat || !lastLocation.lng) return;
            handleUpdateLocation(lastLocation.lat, lastLocation.lng)
        }, 10000);

        return () => {
            clearInterval(interval);
        }

    }, [lastLocation, handleUpdateLocation, updateLocation])

    useEffect(() => {
        if (updateLocation === false) {
            clearWatcher(watcher.current);
            return;
        }

        if (watcher.current !== null) return;

        watcher.current = navigator.geolocation.watchPosition(
            (pos) => handleUpdateLocation(pos.coords.latitude, pos.coords.longitude),
            // (pos) => sendPositionMessage(pos.coords.latitude, pos.coords.longitude),
            null,
            {
                enableHighAccuracy: true
            }
        )

        return () => {
            clearWatcher(watcher.current);
        }
    }, [updateLocation, username, handleUpdateLocation]);

    return (
        <label>
            Update your location:
            <input type="checkbox" checked={updateLocation} onChange={() => setUpdateLocation((prev) => !prev)} />
        </label>
    )
}

export { LocationUpdater };
export default LocationUpdater;