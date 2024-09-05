import { Outlet, useNavigate } from "react-router-dom";
import "./dashboardLayout.scss";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Hamburger ve kapatma ikonları
import ChatList from "../../components/chatList/ChatList";
import SetHamburgerMenuVis from "../../context/setHamburgerMenuVis";





const DashboardLayout = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  const { isMenuOpen, setIsMenuOpen } = SetHamburgerMenuVis();
  console.log(isMenuOpen);

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  if (!isLoaded) return "Loading...";

  return (
    <div className="dashboardLayout">
      <button
        className="hamburger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      <div className={`menu ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(false)}>
        <ChatList />
      </div>
      <div className={`content ${isMenuOpen ? "shifted" : ""}`}  onClick={() => setIsMenuOpen(false)}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
