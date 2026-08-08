// src/Components/VerifyToken.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";

const VerifyToken = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/verify`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Not authenticated");
        }

        setVerified(true);
      } catch (error) {
        dispatch(signoutSuccess());
        navigate("/sign-in", { replace: true });
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [dispatch, navigate, location]);

  if (checking) return null; // or a loader component

  return verified ? <>{children}</> : null;
};

export default VerifyToken;