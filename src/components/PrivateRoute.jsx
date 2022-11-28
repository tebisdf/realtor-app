import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "./Spinner";

export default function PrivateRoute() {
  const { loggedIn, checkingStatus } = useAuthStatus();
  if (checkingStatus) {
    return <Spinner/>;
  }
  //   outlet is the external router rendered since privateRoute has a child router profile
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
}
