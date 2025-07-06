import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function User() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const getProfile = async (id) => {
    const data = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    return data;
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setError("You are not log-in yet");
        return;
      }
      const profile = await getProfile(data.session.user.id);
      if (profile?.error) {
        setError("Error getting your profile");
        return;
      }
      setUser({ ...profile.data, email: data.session.user.email });
    });
  }, []);

  return { user, error };
}

export default User;
