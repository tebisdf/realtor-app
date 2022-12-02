import React from "react";
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
export default function OAuth() {
  const navigate = useNavigate();
  async function onGoogleClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      //check for the user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      //if it does not exist then save it
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Could not Authenticate with GOOGLE");
      console.log(error);
    }
  }
  return (
    <button
      type="button" //only on type=sumbit would trigger the form onsubmit.button would not trigger form submit
      onClick={onGoogleClick}
      className="flex justify-center items-center w-full
       bg-red-700 uppercase text-sm font-medium 
       px-7 py-3 rounded text-white hover:bg-red-800
    active:bg-red-900 shadow-md hover:shadow-lg
    active:shadow-lg transition duration-150 ease-in-out"
    >
      <FcGoogle className="text-2xl bg-white rounded-full mr-2" />
      Continue with Google
    </button>
  );
}
