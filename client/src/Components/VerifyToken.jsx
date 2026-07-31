// src/Components/VerifyToken.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { signoutSuccess } from "../redux/user/userSlice";

const VerifyToken = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // 🔹 detect route changes
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const token = Cookies.get("access_token");

    if (!token) {
      dispatch(signoutSuccess());
      navigate("/sign-in", { replace: true });
    } else {
      setVerified(true);
    }
  }, [dispatch, navigate, location]); // 🔹 add location as dependency

  if (!verified) return null; // optional: show loader instead of null

  return <>{children}</>;
};

export default VerifyToken;
