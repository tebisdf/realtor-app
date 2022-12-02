import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
//as its sending out 2 variables
export function UseAuthStatus() {
  const [loggedIn, setLoggedIn] = useState(false);
  //   start checking process ui
  const [checkingStatus, setCheckingStatus] = useState(true);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {//
      if (user) {
        setLoggedIn(true);
      }
      setCheckingStatus(false);
    });
  }, []);
  return { loggedIn, checkingStatus };
}
