import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Navigation() {
  const { userObj }: any = useContext(UserContext);

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">
            {userObj.displayName || userObj.email}'s Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
