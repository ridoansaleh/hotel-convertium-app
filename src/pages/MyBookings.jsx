import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import NavBar from "../components/NavBar";
import { supabase } from "../supabaseClient";
import "../css/my-bookings.css";

const today = format(new Date(), "yyyy-MM-dd");

function MyBookings() {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);

  useEffect(() => {
    async function getUpcomingBookings() {
      const { data: upcoming, error } = await supabase
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
        .gte("from", today);
      if (error) {
        alert("Error getting the upcoming bookings");
      }
      setUpcomingBookings(upcoming);
    }

    async function getPastBookings() {
      const { data: past, error } = await supabase
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
        .lt("from", today);
      if (error) {
        alert("Error getting the past bookings");
      }
      setPastBookings(past);
    }

    getUpcomingBookings();
    getPastBookings();
  }, []);

  return (
    <div className="page m-auto">
      <NavBar goBack />
      <h2>My Bookings History</h2>
      <div className="title-bar p-10 mb-10">Upcoming</div>
      <div className="mb-32">
        {upcomingBookings.length > 0 ? (
          upcomingBookings.map((item) => (
            <div key={item.id} className="list">
              <Link to={`/confirmed?bookingId=${item.id}`}>{item.id}</Link>
              <span>{item["hotel-rooms"].title}</span>
              <span>
                {item.from} to {item.to}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center">No Upcoming Bookings</div>
        )}
      </div>
      <div className="title-bar p-10 mb-10">Past</div>
      <div className="mb-24">
        {pastBookings.length > 0 ? (
          pastBookings.map((item) => (
            <div key={item.id} className="list">
              <Link to={`/confirmed?bookingId=${item.id}`}>{item.id}</Link>
              <span>{item["hotel-rooms"].title}</span>
              <span>
                {item.from} to {item.to}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center">No Past Bookings</div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
