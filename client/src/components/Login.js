import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // using useHistory hook to redirect user if valid credentials.
  let history = useNavigate();
  // e: event
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const url = `http://localhost:8000/api/v1/users/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });

    const json = await response.json();
    if (json.success) {
      // Save the auth token and redirect
      localStorage.setItem("token", json.accessToken);
      console.log(
        "Logged in successfully",
        "access-token",
        localStorage.getItem("token")
      );
      history("/");
    } else {
      console.log("Invalid credentais", "danger");
    }
  };

  return (
    <div className="container my-3">
      <div className="position-fixed top-0 end-0 p-3">
        <button className="btn btn-primary" onClick={()=>{history('/signup')}}>
          Sign Up
        </button>
      </div>
      <div className="container my-3">
        <h2> Login to continue to iNotebook </h2>
      </div>
      <div className="container my-3">
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="username"
              className="form-control"
              id="username"
              name="username"
              aria-describedby="usernameHelp"
              value={credentials.username}
              onChange={onChange}
              required
            />
            <div id="usernameHelp" className="form-text">
              We'll never share your data with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}