import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAb5ZrwKkFwpYRyeF9EAgnxxwiWApsNNPc",
    authDomain: "socketevo.firebaseapp.com",
    projectId: "socketevo",
    storageBucket: "socketevo.appspot.com",
    messagingSenderId: "825578235739",
    appId: "1:825578235739:web:2e81dbb9613a238e0bdc7e",
    measurementId: "G-99QS0LZC2T"
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

export default firebaseAuth;