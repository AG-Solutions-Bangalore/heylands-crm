import useApiToken from "@/components/common/useApiToken";
import BASE_URL from "@/config/BaseUrl";
import { useToast } from "@/hooks/use-toast";
import { logout } from "@/redux/slice/authSlice";
import { persistor } from "@/redux/store/store";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const secretKey = import.meta.env.VITE_SECRET_KEY;
const validationKey = import.meta.env.VITE_SECRET_VALIDATION;

const ValidationWrapper = ({ children }) => {
  const [status, setStatus] = useState("pending");
  const token = useApiToken();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/panel-logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.code === 200) {
        toast({
          title: "Sucess",
          description: res.data.msg || "You have been logged out.",
        });

        await persistor.flush();
        localStorage.clear();
        dispatch(logout());
        navigate("/");
        setTimeout(() => persistor.purge(), 1000);
      } else {
        toast({
          title: "Logout Failed",
          description: res.data.msg || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout Error",
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    const validateEnvironment = async () => {
      try {
        const statusRes = await axios.get(`${BASE_URL}/api/panel-check-status`);

        if (statusRes.data?.success !== "ok") {
          throw new Error("Panel status check failed");
        }

        const dotenvRes = await axios.get(`${BASE_URL}/api/panel-fetch-dotenv`);
        const dynamicValidationKey = dotenvRes.data?.hashKey;

        if (!dynamicValidationKey) {
          throw new Error("Validation key missing from response");
        }

        const computedHash = validationKey
          ? CryptoJS.MD5(validationKey).toString()
          : "";

        if (!secretKey || computedHash !== dynamicValidationKey) {
          throw new Error("Unauthorized environment file detected");
        }

        setStatus("valid");
        if (location.pathname === "/maintance-mode") {
          navigate("/");
        }
      } catch (error) {
        console.error("❌ Validation Error:", error.message);
        if (token) {
          handleLogout();
        }
        toast({
          title: "Environment Error",
          description: "Environment validation failed. Redirecting...",
          variant: "destructive",
        });

        setStatus("invalid");

        if (location.pathname !== "/maintance-mode") {
          navigate("/maintance-mode");
        }

        setTimeout(() => persistor.purge(), 1000);
      }
    };

    validateEnvironment();
  }, [navigate, dispatch, location]);

  // if (status === "pending") {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //    <LoaderComponent/>
  //     </div>
  //   );
  // }

  return children;
};

export default ValidationWrapper;
