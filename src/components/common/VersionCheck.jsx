import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BASE_URL from "@/config/BaseUrl";
import { useToast } from "@/hooks/use-toast";
import { logout } from "@/redux/slice/authSlice";
import { setShowUpdateDialog } from "@/redux/slice/versionSlice";
import { persistor } from "@/redux/store/store";
import axios from "axios";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useApiToken from "./useApiToken";

const VersionCheck = () => {
  const token = useApiToken();
  const localVersion = useSelector((state) => state.auth?.version);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [retryPopup, setRetryPopup] = useState(false);
  const isDialogOpen = useSelector((state) => state.version.showUpdateDialog);
  const serverVersion = useSelector((state) => state?.version?.version);
  // console.log(localVersion, "localVersion", serverVersion, "serverVersion");

  const handleCloseDialog = () => {
    dispatch(
      setShowUpdateDialog({
        showUpdateDialog: false,
        version: serverVersion,
      })
    );
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
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

        handleCloseDialog();
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const statusRes = await axios.get(`${BASE_URL}/api/panel-check-status`);
        const serverVer = statusRes?.data?.version?.version_panel;

        if (token && statusRes.data?.success === "ok") {
          dispatch(
            setShowUpdateDialog({
              showUpdateDialog: false,
              version: serverVer,
            })
          );

          if (localVersion !== serverVer) {
            dispatch(
              setShowUpdateDialog({
                showUpdateDialog: true,
                version: serverVer,
              })
            );
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
        dispatch(
          setShowUpdateDialog({
            showUpdateDialog: true,
            version: serverVersion,
          })
        );
        setRetryPopup(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [retryPopup]);

  if (!token) return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
      <DialogContent
        className="max-w-md p-6 rounded-2xl shadow-2xl border bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:to-zinc-800 [&>button.absolute]:hidden"
        aria-describedby={undefined}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        hideClose={true}
      >
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 mb-3">
            <RefreshCw className="w-6 h-6 animate-spin-slow" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Update Available
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            A new version of the panel is ready. Update now to version{" "}
            <span className="font-medium text-blue-600">{serverVersion}</span>.
          </p>
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              handleCloseDialog();
              setRetryPopup(true);
            }}
            className="rounded-full px-6 py-2"
          >
            Do It Later
          </Button>
          <Button
            onClick={handleLogout}
            className="rounded-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Updatting" : "Update Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VersionCheck;
