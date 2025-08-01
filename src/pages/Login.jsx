import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useQuery } from "../utils";
import "../css/form.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const query = useQuery();

  const totalGuest = query.get("guest");
  const start = query.get("start");
  const end = query.get("end");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) navigate("/");
    });
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
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
      const { error } = await supabase.auth.signInWithPassword(formData);
      if (error) {
        alert(error.message);
      } else {
        setFormData({ email: "", password: "" });
        setErrors({});
        if (totalGuest && start && end) {
          navigate(`/book?guest=${totalGuest}&start=${start}&end=${end}`);
        } else {
          navigate("/");
        }
      }
    }
  };

  return (
    <form
      className="login-form d-flex flex-column justify-center"
      onSubmit={handleSubmit}
      noValidate
    >
      <p className="label">
        Please <span className="font-bold">Log in</span> to your account!
      </p>

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="new-email"
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={!!errors.email}
          className={`field mt-5 ${!errors.email ? "mb-10" : ""}`}
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <div id="email-error" className="error-message mb-10" role="alert">
            {errors.email}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="new-password"
          aria-describedby={errors.password ? "password-error" : undefined}
          aria-invalid={!!errors.password}
          className={`field mt-5 ${!errors.password ? "mb-10" : ""}`}
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <div id="password-error" className="error-message mb-10" role="alert">
            {errors.password}
          </div>
        )}
      </div>

      <button type="submit" className="signup-btn mt-10">
        Log In
      </button>
      <div className="signup-cta">
        Doesn't have an account yet? Sign up <Link to="/register">here</Link>!
      </div>
    </form>
  );
}

export default Login;
