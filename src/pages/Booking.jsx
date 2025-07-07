import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { parseISO, differenceInDays } from "date-fns";
import { supabase } from "../supabaseClient";
import useUser from "../useUser";
import NavBar from "../components/NavBar";
import BookSteps from "../components/BookSteps";
import Room from "../components/Room";
import { HOTEL_TAX_RATE, HOTEL_SERVICE_FEE } from "../constants";
import {
  useQuery,
  formatDate,
  calculateTaxAndServiceFee,
  calculateTotalPayment,
} from "../utils";
import "../css/booking.css";

const sortOptions = [
  { value: "lowest", label: "Lowest price" },
  { value: "highest", label: "Highest price" },
];
const honorOptions = ["Mr", "Mrs", "Ms", "Miss", "Sir", "Madam"];
const taxAndServiceFees = (HOTEL_TAX_RATE + HOTEL_SERVICE_FEE) * 10;

function Booking() {
  const [step, setStep] = useState(2);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [honor, setHonor] = useState(honorOptions[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rooms, setRooms] = useState([]);
  const query = useQuery();
  const { user } = useUser();
  const navigate = useNavigate();

  const totalGuest = query.get("guest");
  const start = query.get("start");
  const end = query.get("end");

  const totalStay =
    end && start ? differenceInDays(parseISO(end), parseISO(start)) : 0;

  const getRooms = async () => {
    const response = await supabase.from("hotel-rooms").select("*");
    return response;
  };

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
  }, [user]);

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
    setSelectedPrice(value);
    let newList = [];
    if (value === "lowest") {
      newList = [...rooms].sort((a, b) => a.price - b.price);
    } else {
      newList = [...rooms].sort((a, b) => b.price - a.price);
    }
    setRooms(newList);
  };

  const handleSelectRoom = (roomId) => {
    const selectedRoom = rooms.find((room) => room.id === roomId);
    if (!selectedRoom) return;
    setSelectedRoom(selectedRoom);
    setStep(3);
  };

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleBookingProceed = async () => {
    if (validate()) {
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            profile_id: user.id,
            room_id: selectedRoom.id,
            guest_title: honor,
            guest_name: name,
            guest_email: email,
            total_guest: totalGuest,
            total_night: totalStay,
            from: new Date(start),
            to: new Date(end),
            price: selectedRoom.price,
            tax_and_service: calculateTaxAndServiceFee(
              totalStay * selectedRoom.price,
              taxAndServiceFees
            ),
            tax_and_service_rate: taxAndServiceFees,
            total_price: calculateTotalPayment(
              totalStay * selectedRoom.price,
              taxAndServiceFees
            ),
          },
        ])
        .select();
      if (error) {
        alert("Unable to proceed your booking");
        return;
      }
      const bookingId = data[0].id;
      navigate(`/confirmed?bookingId=${bookingId}`);
    } else {
      alert("Please input a valid name/email!");
    }
  };

  if (!totalGuest || !start || !end) {
    return <Navigate to="/" />;
  }

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
                  value={selectedPrice}
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
              <Room key={room.id} {...room} onRoomSelected={handleSelectRoom} />
            ))}
          </div>
        </>
      ) : null}
      {step === 3 ? (
        <div className="contact-information mt-24">
          <div className="details mb-16">
            <div>
              <div className="contact p-16">
                <div className="contact-title text-uppercase font-bold mb-16">
                  Contact Information
                </div>
                <div className="d-flex items-center mb-16">
                  <label className="w-30">Title</label>
                  <select
                    value={honor}
                    onChange={(e) => setHonor(e.target.value)}
                  >
                    {honorOptions.map((honor) => (
                      <option key={honor} value={honor}>
                        {honor}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="d-flex items-center mb-16">
                  <label className="w-30">Name</label>
                  <input
                    value={name}
                    className="w-70"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="d-flex items-center">
                  <label className="w-30">Email Address</label>
                  <input
                    value={email}
                    className="w-70"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              {/* START: buttons displayed in Desktop */}
              <div className="d-flex mt-24">
                <button
                  className="back-btn p-10 text-uppercase mr-10"
                  onClick={() => setStep(2)}
                >
                  Back
                </button>
                <button
                  className="proceed-btn p-10 text-uppercase"
                  onClick={handleBookingProceed}
                >
                  Proceed
                </button>
              </div>
              {/* END: buttons displayed in Desktop */}
            </div>
            <div className="order p-16">
              <div className="text-uppercase fs-13 mb-5">
                {formatDate(start)} to {formatDate(end)}
              </div>
              <div className="text-uppercase fs-13">{totalStay} night</div>
              <div className="text-uppercase font-bold mt-10">
                Room: {totalGuest} guest
              </div>
              <img
                src={selectedRoom.photo}
                className="selected-room mt-5"
                alt="Room Image"
              />
              <div className="text-uppercase font-bold fs-13 my-10">
                {selectedRoom.title}
              </div>
              <div className="d-flex justify-between mb-10">
                <span>Room</span>
                <span>S${totalStay * selectedRoom.price}</span>
              </div>
              <div className="d-flex justify-between mb-24">
                <span>Tax & Service Charges ({taxAndServiceFees}%)</span>
                <span>
                  S$
                  {calculateTaxAndServiceFee(
                    totalStay * selectedRoom.price,
                    taxAndServiceFees
                  )}
                </span>
              </div>
              <div className="d-flex justify-between">
                <span className="text-uppercase">Total</span>
                <span>
                  S$
                  {calculateTotalPayment(
                    totalStay * selectedRoom.price,
                    taxAndServiceFees
                  )}
                </span>
              </div>
            </div>
          </div>
          {/* START: buttons displayed in Mobile */}
          <div>
            <button
              className="back-btn p-10 text-uppercase mr-10"
              onClick={() => setStep(2)}
            >
              Back
            </button>
            <button
              className="proceed-btn p-10 text-uppercase"
              onClick={handleBookingProceed}
            >
              Proceed
            </button>
          </div>
          {/* END: buttons displayed in Mobile */}
        </div>
      ) : null}
    </div>
  );
}

export default Booking;
