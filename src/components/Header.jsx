import React from "react";
export default function Header() {
  return (
    <div>
      <header className="flex justify-between items-center px-3 max-w-6xl">
      <div>
          <img  
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
            className="h-4 cursor-pointer bg-blue-800"
          />
        </div>
        <div>
          <ul className="">
            <li>Home</li>
            <li>Offers</li>
            <li>Sign in</li>
          </ul>
        </div>
      </header>
    </div>
  );
}
