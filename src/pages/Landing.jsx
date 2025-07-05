import { useNavigate } from "react-router-dom";
import { FaUsers, FaAngleDown } from "react-icons/fa";
import NavBar from "../components/NavBar";
import "../css/landing.css";
import hotelRoom from "../assets/hotel-room.jpg";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing page m-auto">
      <NavBar />
      <img className="hero-image mt-24" src={hotelRoom} alt="Hero Image" />
      <h2 className="title">Book a Room</h2>
      <div className="search-bar">
        <div className="input">
          <div className="total-guest">
            <FaUsers />
            <span className="ml-5">2</span>
          </div>
          <FaAngleDown />
        </div>
        <div className="divider" />
        <div className="input">
          <span>Tue, 3 Jun 2025</span>
          <FaAngleDown />
        </div>
      </div>
      <div className="search-btn-wrapper">
        <button className="search-btn" onClick={() => navigate("/book")}>
          Search for Rooms
        </button>
      </div>
    </div>
  );
}

export default Landing;
