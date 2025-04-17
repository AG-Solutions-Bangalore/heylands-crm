import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useApiToken from "./useApiToken";
import BASE_URL from "@/config/BaseUrl";
import { logout } from "@/redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { persistor } from "@/redux/store/store";
import { useToast } from "@/hooks/use-toast";
import { ButtonConfig } from "@/config/ButtonConfig";

const VersionCheck = () => {
  const token = useApiToken();
  const localVersion = useSelector((state) => state.auth?.version);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [serverVersion, setServerVersion] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [retryPopup, setRetryPopup] = useState(false);

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
          title: "Success",
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
    const checkVersion = async () => {
      try {
        const statusRes = await axios.get(`${BASE_URL}/api/panel-check-status`);
        const serverVer = statusRes.data?.version?.version_panel;

        if (token && statusRes.data?.success === "ok") {
          setServerVersion(serverVer);
          console.log(serverVer, "serverVer");
          console.log(localVersion, "localVersion");
          if (localVersion !== serverVer) {
            setShowDialog(true);
          }
        }
      } catch (error) {
        console.error("Panel status check failed:", error);
      }
    };

    checkVersion();
  }, [token, localVersion, navigate]);

  useEffect(() => {
    if (retryPopup) {
      const timeout = setTimeout(() => {
        setShowDialog(true);
        setRetryPopup(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [retryPopup]);

  if (!token) return null;

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent
        className="max-w-sm text-center [&>button.absolute]:hidden"
        aria-describedby={undefined}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        hideClose={true}
      >
        <DialogHeader>
          <DialogTitle>Update Available</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 mt-2">
          A new version of the panel is available. Please update to version{" "}
          <strong>{serverVersion}</strong>.
        </p>
        <DialogFooter className="mt-4 flex justify-center gap-2">
          <Button
            onClick={() => {
              setShowDialog(false);
              setRetryPopup(true);
            }}
            className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          >
            Do It Later
          </Button>
          <Button
            onClick={handleLogout}
            className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VersionCheck;
