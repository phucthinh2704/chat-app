import React, { createContext, useContext, useMemo, useState } from "react";
import useFirestore from "../hooks/useFirestore";
import { AuthContext } from "./AuthProvider";

const AppContext = createContext();

const AppProvider = ({ children }) => {
	const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
	const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
	const [selectedRoomId, setSelectedRoomId] = useState("");

	const { user } = useContext(AuthContext);
	const { uid } = user;
	/**
	 * * useFirestore hook to get data from firestore
	 * * collection: rooms {
	 * 	name: string,
	 * 	description: string,
	 * 	members: [uid1, uid2,...]
	 * }
	 */
	const roomCondition = useMemo(() => {
		return {
			fieldName: "members",
			operator: "array-contains",
			compareValue: uid,
		};
	}, [uid]);
	const rooms = useFirestore("rooms", roomCondition);

	const selectedRoom = useMemo(
		() => rooms.find((room) => room.id == selectedRoomId) || {},
		[rooms, selectedRoomId]
	);
	const usersCondition = useMemo(() => {
		return {
			fieldName: "uid",
			operator: "in",
			compareValue: selectedRoom.members,
		};
	}, [selectedRoom.members]);
	const members = useFirestore("users", usersCondition);

	return (
		<AppContext.Provider
			value={{
				rooms,
				members,
				selectedRoom,
				isAddRoomVisible,
				setIsAddRoomVisible,
				selectedRoomId,
				setSelectedRoomId,
				isInviteMemberVisible,
				setIsInviteMemberVisible,
			}}>
			{children}
		</AppContext.Provider>
	);
};

export { AppContext };
export default AppProvider;
