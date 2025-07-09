import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../css/form.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) navigate("/");
    });
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.email.length < 8) {
      newErrors.password = "Password min 8 characters";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const { email, password, name, address } = formData;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        alert(signUpError.message);
        return;
      }
      if (data?.user) {
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            name,
            address,
          },
        ]);
        if (insertError) {
          alert(insertError.message);
          return;
        }
        alert(`Successfully created an account for ${name}`);
        setFormData({ name: "", email: "", password: "", address: "" });
        setErrors({});
        /* NOTE:
           redirect users to the landing page after signup
           email-verification is deactivated, so all users treat as activated after login by Supabase Auth
        */
        navigate("/");
      }
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit} noValidate>
      <p className="label">
        Please <span className="font-bold">Sign up</span> before booking a hotel
        room!
      </p>
      <div>
        <label>Name</label>
        <br />
        <input
          type="text"
          name="name"
          className={`field mt-5 ${!errors.name ? "mb-10" : ""}`}
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && (
          <div className="error-message mb-10">{errors.name}</div>
        )}
      </div>

      <div>
        <label>Address</label>
        <br />
        <textarea
          name="address"
          className={`field mt-5 ${!errors.address ? "mb-10" : ""}`}
          value={formData.address}
          onChange={handleChange}
        />
        {errors.address && (
          <div className="error-message mb-10">{errors.address}</div>
        )}
      </div>

      <div>
        <label>Email</label>
        <br />
        <input
          type="email"
          name="email"
          autoComplete="new-email"
          className={`field mt-5 ${!errors.email ? "mb-10" : ""}`}
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <div className="error-message mb-10">{errors.email}</div>
        )}
      </div>

      <div>
        <label>Password</label>
        <br />
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          className={`field mt-5 ${!errors.password ? "mb-10" : ""}`}
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <div className="error-message mb-10">{errors.password}</div>
        )}
      </div>

      <button type="submit" className="signup-btn mt-10">
        Sign Up
      </button>
      <div className="login-cta">
        Already have an account? Log in <Link to="/login">here</Link>!
      </div>
    </form>
  );
}

export default Register;
