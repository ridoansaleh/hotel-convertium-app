import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { format, parseISO, differenceInDays } from "date-fns";
import { supabase } from "../supabaseClient";
import NavBar from "../components/NavBar";
import BookSteps from "../components/BookSteps";
import Room from "../components/Room";
import "../css/booking.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function formatDate(date) {
  return format(parseISO(date), "MMM d, yyyy");
}

const sortOptions = [
  { value: "lowest", label: "Lowest price" },
  { value: "highest", label: "Highest price" },
];

function Booking() {
  const [step] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const query = useQuery();

  const totalGuest = query.get("guest");
  const start = query.get("start");
  const end = query.get("end");
  const totalStay = differenceInDays(parseISO(end), parseISO(start));

  const getRooms = async () => {
    const response = await supabase.from("hotel-rooms").select("*");
    return response;
  };

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await getRooms();
      if (error) {
        alert("Error getting the rooms");
      } else {
        setRooms(data.sort((a, b) => a.price - b.price) || []);
      }
    };

    fetchRooms();
  }, []);

  const handleSelect = (e) => {
    const value = e.target.value;
    setSelectedRoom(value);
    let newList = [];
    if (value === "lowest") {
      newList = [...rooms].sort((a, b) => a.price - b.price);
    } else {
      newList = [...rooms].sort((a, b) => b.price - a.price);
    }
    setRooms(newList);
  };

  return (
    <div className="page m-auto">
      <NavBar />
      <BookSteps step={step} />
      {step === 2 ? (
        <>
          <div className="filter-bar mt-24">
            <div className="top d-flex justify-between">
              <div>
                {formatDate(start)} <span className="font-bold">to</span>{" "}
                {formatDate(end)}
              </div>
              <div className="text-uppercase">
                {totalStay} night | {totalGuest} guest
              </div>
            </div>
            <div className="d-flex justify-end mt-10">
              <div className="sorting text-uppercase">
                <label className="mr-10">Sort by:</label>
                <select
                  className="text-uppercase"
                  value={selectedRoom}
                  onChange={handleSelect}
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="mt-24">
            {rooms.map((room) => (
              <Room key={room.id} {...room} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Booking;
