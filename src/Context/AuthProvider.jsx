import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const nav = useNavigate();
	
	useEffect(() => {
		const unsubscribed = onAuthStateChanged(auth, (user) => {
			if (user) {
				const { email, displayName, photoURL, uid } = user;
				setUser({ email, displayName, photoURL, uid });
				setIsLoading(false);
				nav("/");
			} else {
				setIsLoading(false);
				nav("/login");
			}
		});
		return () => {
			unsubscribed();
		};
	}, [nav]);
	return (
		<AuthContext.Provider value={{ user }}>
			{isLoading ? <Spin /> : children}
		</AuthContext.Provider>
	);
};

export { AuthContext };
export default AuthProvider;
