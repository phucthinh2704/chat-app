import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/analytics";


const firebaseConfig = {
	apiKey: "AIzaSyAxGxFeBryk2-hiceJZwE0zeemm0VXcmy4",
	authDomain: "chat-app-b241c.firebaseapp.com",
	projectId: "chat-app-b241c",
	storageBucket: "chat-app-b241c.firebasestorage.app",
	messagingSenderId: "138398622960",
	appId: "1:138398622960:web:2a580a86b0f46838278e35",
	measurementId: "G-Q3XJDBN82K",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);
// const fbProvider = new FacebookAuthProvider(app);
// const db = getFirestore(app);

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const db = firebase.firestore();

auth.useEmulator("http://127.0.0.1:9099/")
if(window.location.hostname === "localhost") {
	db.useEmulator("localhost", "8080");
}

export { auth, db };
export default firebase;
