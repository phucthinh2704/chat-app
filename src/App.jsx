import "./App.css";
import ChatRoom from "./components/ChatRoom";
import Login from "./components/Login";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import AuthProvider from "./Context/AuthProvider";
import AppProvider from "./Context/AppProvider";
import AddRoomModal from "./components/Modals/AddRoomModal";
import InviteMemberModal from "./components/Modals/InviteMemberModal";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<AppProvider>
					<Routes>
						<Route
							path="/login"
							Component={Login}></Route>
						<Route
							path="/"
							Component={ChatRoom}></Route>
					</Routes>
					<AddRoomModal></AddRoomModal>
					<InviteMemberModal></InviteMemberModal>
				</AppProvider>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
