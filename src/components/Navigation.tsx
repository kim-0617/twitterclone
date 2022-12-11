import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { CgProfile } from "react-icons/cg";
import { BsTwitter } from "react-icons/bs";

function Navigation() {
  const { userObj }: any = useContext(UserContext);

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">
            <BsTwitter className="twitter__icon" />
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <CgProfile className="profile__icon" />
          </Link>
          <Link to="/profile">{`${
            userObj.displayName || userObj.email
          }'s Profile`}</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
