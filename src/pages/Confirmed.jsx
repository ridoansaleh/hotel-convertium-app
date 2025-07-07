import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { supabase } from "../supabaseClient";
import { useQuery, formatDate } from "../utils";
import "../css/confirmed.css";

function Confirmed() {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(true);
  const query = useQuery();
  const bookingId = query.get("bookingId");

  useEffect(() => {
    async function getBookingDetails() {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
            *,
            hotel-rooms (
              title,
              photo
            )
        `
        )
        .eq("id", bookingId)
        .single();
      setBooking(data);
      if (error) {
        alert("Error getting the booking detail");
      }
      setLoading(false);
    }

    getBookingDetails();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="confirmed page m-auto">
      <NavBar />
      <div className="text-center mt-32 mb-24">
        <div className="title text-uppercase fs-24 mb-16">
          Your Booking Has Been Confirmed
        </div>
        <div className="mb-5">
          We have sent your booking confirmation to the email address that you
          have provided
        </div>
        <div className="mb-5">
          Check-in/Check-out:{" "}
          <span className="font-bold">
            {formatDate(booking.from)} to {formatDate(booking.to)}
          </span>
        </div>
        <div className="mb-5">
          Booking Confirmation Number:{" "}
          <span className="font-bold">{bookingId}</span>
        </div>
        <div className="mb-5">
          Total Price for 1 Night:{" "}
          <span className="font-bold">$S{booking.price}</span>
        </div>
      </div>
      <div className="info d-flex p-16">
        <div className="payment">
          <div className="d-flex">
            <img
              src={booking["hotel-rooms"].photo}
              className="photo mr-10"
              alt="Room Image"
            />
            <div>
              <div className="fs-13 font-bold text-uppercase mb-5">
                Room : {booking["hotel-rooms"].title}
              </div>
              <div>{booking.total_guest} Guest</div>
            </div>
          </div>
          <div className="font-bold text-uppercase my-10">Package:</div>
          <div className="d-flex justify-between mb-10 mr-10">
            <span>Room</span>
            <span>$S{booking.price * booking.total_night}</span>
          </div>
          <div className="d-flex justify-between mb-10 mr-10">
            <span>Tax & Service Charges ({booking.tax_and_service_rate}%)</span>
            <span>$S{booking.tax_and_service}</span>
          </div>
          <div className="d-flex justify-between mr-10">
            <span>Total Price</span>
            <span>$S{booking.total_price}</span>
          </div>
        </div>
        <div className="guest p-16">
          <div className="text-uppercase fs-13 font-bold mb-24">
            Guest Details
          </div>
          <div className="mb-5">
            Name: {booking.guest_title} {booking.guest_name}
          </div>
          <div>Email Address: {booking.guest_email}</div>
        </div>
      </div>
    </div>
  );
}

export default Confirmed;
