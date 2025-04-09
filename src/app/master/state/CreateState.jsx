import {
  StateCreate,
  StateEdit,
} from "@/components/buttonIndex/ButtonComponents";
import useApiToken from "@/components/common/useApiToken";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BASE_URL from "@/config/BaseUrl";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const StateForm = ({ stateId = null }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isEditMode = Boolean(stateId);
  const [formData, setFormData] = useState({
    state_name: "",
    state_no: "",
    state_status: isEditMode ? "Active" : null,
  });
  const [originalData, setOriginalData] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const token = useApiToken();

  // Fetch data for edit
  useEffect(() => {
    const fetchData = async () => {
      if (!stateId || !open) return;
      setIsFetching(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-state-by-id/${stateId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data.state;
        setFormData({
          state_name: data?.state_name || "",
          state_no: data?.state_no || "",
          state_status: data?.state_status || "Active",
        });
        setOriginalData({
          state_name: data?.state_name || "",
          state_no: data?.state_no || "",
          state_status: data?.state_status || "Active",
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch state data",
          variant: "destructive",
        });
        setOpen(false);
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [stateId, open]);
  const requiredFields = {
    "State Name": "state_name",
    "State No": "state_no",
  };

  const handleSubmit = async () => {

    // Identify missing fields
    const missingFields = Object.entries(requiredFields).filter(
      ([label, field]) =>
        !formData[field]?.trim() && (!isEditMode || field !== "state_name") // skip state_name in edit mode
    );

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: (
          <div className="flex flex-col gap-1">
            {missingFields.map(([label], index) => (
              <div key={index}>• {label}</div>
            ))}
          </div>
        ),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isEditMode
        ? `${BASE_URL}/api/panel-update-state/${stateId}`
        : `${BASE_URL}/api/panel-create-state`;
      const method = isEditMode ? "put" : "post";

      const response = await axios[method](endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });

        queryClient.invalidateQueries(["customers"]);
        setOpen(false);

        if (!isEditMode) {
          setFormData({ state_name: "", state_no: "", state_status: "Active" });
        }
      } else {
        toast({
          title: "Error",
          description: response.data.msg,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges =
    isEditMode &&
    originalData &&
    (formData.state_name !== originalData.state_name ||
      formData.state_no !== originalData.state_no ||
      formData.state_status !== originalData.state_status);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {isEditMode ? (
          <div>
            <StateEdit />
          </div>
        ) : pathname === "/master/state" ? (
          <div>
            <StateCreate
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            />
          </div>
        ) : (
          <p className="text-xs text-yellow-700 ml-2 mt-1 w-32 hover:text-red-800 cursor-pointer">
            State
          </p>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-80">
        {isFetching ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">
                {isEditMode ? "Edit State" : "Create New State"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? "Update state details"
                  : "Enter the state details"}
              </p>
            </div>
            <div className="grid gap-2">
              {!isEditMode && (
                <Input
                  id="state_name"
                  placeholder="Enter state name"
                  value={formData.state_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      state_name: e.target.value,
                    }))
                  }
                />
              )}

              <Input
                id="state_no"
                placeholder="Enter state number"
                value={formData.state_no}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    state_no: e.target.value,
                  }))
                }
              />
              {isEditMode && (
                <Select
                  value={formData.state_status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, state_status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {hasChanges && (
                <Alert className="bg-blue-50 border-blue-200 mt-2">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-blue-600 text-sm">
                    You have unsaved changes
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleSubmit}
                disabled={isLoading || (isEditMode && !hasChanges)}
                className={`mt-2 ${ButtonConfig.backgroundColor} ${
                  ButtonConfig.hoverBackgroundColor
                } ${ButtonConfig.textColor} ${
                  hasChanges ? "relative overflow-hidden" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : isEditMode ? (
                  "Update State"
                ) : (
                  "Create State"
                )}
                {hasChanges && !isLoading && (
                  <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
                )}
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default StateForm;
