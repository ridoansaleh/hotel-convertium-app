import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../css/navbar.css";

function NavBar() {
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
        <div className="logged-in">
          <span className="mr-10">{user.name}</span>
          <button className="logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      ) : (
        <button className="login" onClick={() => navigate("/login")}>
          Log in
        </button>
      )}
    </div>
  );
}

export default NavBar;
