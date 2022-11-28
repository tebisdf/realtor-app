import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  function pathMatchRouter(route) {
    if (route === location.pathname) {
      return true;
    }
    return false;
  }
  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-50">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-3">
        <div>
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
            className="h-4 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div>
          <ul className="flex space-x-3">
            <li
              className={`cursor-pointer py-3 text-sm font-semibold
               text-gray-400 border-b-[3px] 
               border-b-transparent ${
                 pathMatchRouter("/") && "text-black border-b-red-500"
               }`}
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold
            text-gray-400 border-b-[3px] 
            border-b-transparent ${
              pathMatchRouter("/offers") && "text-black border-b-red-500"
            }`}
              onClick={() => navigate("/offers")}
            >
              Offers
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold
            text-gray-400 border-b-[3px] 
            border-b-transparent ${
              pathMatchRouter("/sign-in") && "text-black border-b-red-500"
            }`}
              onClick={() => navigate("/sign-in")}
            >
              Sign in
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}
