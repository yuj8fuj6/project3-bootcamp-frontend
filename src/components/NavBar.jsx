import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
// import { Link, useMatch, useResolvedPath } from "react-router-dom";
import Logo from "./Logo";
import {
  HomeSVG,
  ProfileSVG,
  ForumSVG,
  MessengerSVG,
  ContactSVG,
  MapSVG,
  LogoutSVG,
} from "../assets/SVG";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">
        <Logo />
      </Link>
      <ul className="menu menu-horizontal px-1">
        <li>
          <Link to="/" className="justify-center-link">
            <HomeSVG />
            Home
          </Link>
        </li>
        <li>
          <Link to="/profile" className="justify-center-link">
            <ProfileSVG />
            Profile
          </Link>
        </li>
        <li>
          <Link to="/forum" className="justify-center-link">
            <ForumSVG />
            Forum
          </Link>
        </li>
        <li>
          <Link to="/messenger" className="justify-center-link">
            <MessengerSVG />
            Messenger
          </Link>
        </li>
        <li>
          <Link to="/contact" className="justify-center-link">
            <ContactSVG />
            Contact
          </Link>
        </li>
        <li>
          <Link to="/map" className="justify-center-link">
            <MapSVG />
            Map
          </Link>
        </li>
        <li>
          <Link to="/login" className="justify-center-link">
            <LogoutSVG />
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
}

//  <CustomLink className="justify-center-link" to="/">
//           <HomeSVG />
//           Home
//         </CustomLink>
//         <CustomLink to="profile" className="justify-center-link">
//           <ProfileSVG />
//           Pofile
//         </CustomLink>
//         <CustomLink to="/forum" className="justify-center-link">
//           <ForumSVG />
//           Forum
//         </CustomLink>
//         <CustomLink to="/messenger" className="justify-center-link">
//           <MessengerSVG />
//           Messenger
//         </CustomLink>
//         <CustomLink to="/contact" className="justify-center-link">
//           <ContactSVG />
//           Contact
//         </CustomLink>
//         <CustomLink to="/map" className="justify-center-link">
//           <MapSVG />
//           Map
//         </CustomLink>
//         <CustomLink to="/logout" className="justify-center-link">
//           <LogoutSVG />
//           Logout
//         </CustomLink>

// // to have an active display when CustomLink is selected
// function CustomLink({ to, children, ...props }) {
//   const resolvedPath = useResolvedPath(to);

//   // to determine if resolvedPath is active, without "end:true", partially matched URL
//   const isActive = useMatch({ path: resolvedPath.pathname, end: true });

//   return (
//     <li className={isActive ? "active" : ""}>
//       <Link to={to} {...props}>
//         {children}
//       </Link>
//     </li>
//   );
// }
