import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { format } from "date-fns";
import NavBar from "../components/NavBar";
import "flatpickr/dist/themes/material_blue.css";
import "../css/landing.css";
import hotelRoom from "../assets/hotel-room.jpg";

const guestOptions = [
  { value: "1", label: "1 person" },
  { value: "2", label: "2 persons" },
  { value: "3", label: "3 persons" },
  { value: "4", label: "4 persons" },
  { value: "5", label: "5 persons" },
];

function Landing() {
  const [totalGuest, setTotalGuest] = useState(null);
  const [dateRange, setDateRange] = useState([new Date()]);
  const navigate = useNavigate();

  const handleSearchRoom = () => {
    const [start, end] = dateRange;
    const formattedStart = start ? format(start, "yyyy-MM-dd") : "";
    const formattedEnd = end ? format(end, "yyyy-MM-dd") : "";
    if (!totalGuest || !formattedStart || !formattedEnd) {
      alert("Please complete the form!");
      return;
    }
    navigate(
      `/book?guest=${totalGuest.value}&start=${formattedStart}&end=${formattedEnd}`
    );
  };

  return (
    <div className="landing page m-auto">
      <NavBar />
      <img className="hero-image mt-24" src={hotelRoom} alt="Hero Image" />
      <h2 className="title">Book a Room</h2>
      <div className="search-bar">
        <Select
          className="input"
          options={guestOptions}
          placeholder="Total guest"
          value={totalGuest}
          onChange={(val) => setTotalGuest(val)}
          styles={{
            container: (base) => ({
              ...base,
              width: "100%",
            }),
            control: (base) => ({
              ...base,
              width: "100%",
            }),
          }}
        />
        <div className="divider" />
        <Flatpickr
          className="input date-picker"
          options={{ mode: "range", dateFormat: "D, d M Y" }}
          placeholder="Select a date"
          value={dateRange}
          onChange={setDateRange}
        />
      </div>
      <div className="search-btn-wrapper">
        <button className="search-btn" onClick={handleSearchRoom}>
          Search for Rooms
        </button>
      </div>
    </div>
  );
}

export default Landing;
