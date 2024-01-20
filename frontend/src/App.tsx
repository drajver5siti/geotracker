import { useState } from "react";
import { AuthContext } from "./context/AuthContext";
import MainDashboard from "./components/MainDashboard";
import WebSocketProvider from "./context/WebSocketProvider";
import TrucksProvider from "./context/TrucksProvider";

const App = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [username, setUsername] = useState('');

	if (!loggedIn) {
		return (
			<div style={{ height: '100dvh', display: 'grid', placeItems: 'center' }}>
				<div style={{ display: 'flex', flexDirection: 'column', marginTop: '-200px', alignItems: 'center', rowGap: '10px' }}>
					<label style={{ fontSize: '1.5rem' }}>
						Please enter your username:
					</label>
					<input value={username} onChange={(e) => setUsername(e.target.value)} />
					<button style={{ width: '200px' }} onClick={() => setLoggedIn(true)} disabled={username === ''}>Login</button>
				</div>
			</div>
		)
	}

	return (
		<AuthContext.Provider value={{ username }}>
			<WebSocketProvider>
				<TrucksProvider>
					<MainDashboard />
				</TrucksProvider>
			</WebSocketProvider>
		</AuthContext.Provider>
	)
}

export { App };
export default App
