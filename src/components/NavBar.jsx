import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../css/navbar.css";

function NavBar({ goBack = false }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getProfile = async (id) => {
    const data = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    return data;
  };

  const checkUserSession = () => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data?.session) {
        const profile = await getProfile(data.session.user.id);
        setUser(profile.data);
        if (profile?.error) {
          alert("Error getting your profile");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      checkUserSession();
      navigate("/");
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="navbar">
      {user ? (
        <div className="authenticated d-flex justify-between items-center w-100">
          {goBack ? (
            <Link className="my-bookings" to="/">
              Back to Home
            </Link>
          ) : (
            <Link className="my-bookings" to="/my-bookings">
              My Bookings
            </Link>
          )}
          <div>
            <span className="mr-10">{user.name}</span>
            <button className="logout" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-end">
          <button className="login" onClick={() => navigate("/login")}>
            Log in
          </button>
        </div>
      )}
    </div>
  );
}

export default NavBar;
