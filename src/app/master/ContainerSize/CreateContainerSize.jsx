import React, { useEffect } from "react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { AlertCircle, Loader2, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocation } from "react-router-dom";
import { ButtonConfig } from "@/config/ButtonConfig";
import {
  ContainerSizeCreate,
  ContainerSizeEdit,
} from "@/components/buttonIndex/ButtonComponents";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useApiToken from "@/components/common/useApiToken";
const ContainerSizeForm = ({ containerId = null }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = Boolean(containerId);
  const [isFetching, setIsFetching] = useState(false);

  const [originalData, setOriginalData] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const token = useApiToken();
  const [formData, setFormData] = useState({
    containerSize: "",
    containerSize_status: isEditMode ? "Active" : null,
  });
  const fetchConatinerSizeData = async () => {
    if (!containerId || !open) return;
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-container-size-by-id/${containerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const containerSizeData = response?.data?.containerSize;
      setFormData({
        containerSize: containerSizeData.containerSize || "",
        containerSize_status:
          containerSizeData.containerSize_status || "Active",
      });
      setOriginalData({
        containerSize: containerSizeData.containerSize || "",
        containerSize_status:
          containerSizeData.containerSize_status || "Active",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch container size data",
        variant: "destructive",
      });
      setOpen(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if ((open, isEditMode)) {
      fetchConatinerSizeData();
    }
  }, [open, isEditMode]);
  const handleSubmit = async () => {
    const requiredFields = {
      ContainerSIze: "containerSize",
      Status: "containerSize_status",
    };
    const missingFields = Object.entries(requiredFields).filter(
      ([label, field]) =>
        !String(formData[field] || "").trim() &&
        (isEditMode || field !== "containerSize_status")
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
      const response = isEditMode
        ? await axios.put(
            `${BASE_URL}/api/panel-update-container-size/${containerId}`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        : await axios.post(
            `${BASE_URL}/api/panel-create-container-size`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });

        queryClient.invalidateQueries(["containersizes"]);
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
    (formData.containerSize !== originalData.containerSize ||
      formData.containerSize_status !== originalData.containerSize_status);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {isEditMode ? (
          <div>
            <ContainerSizeEdit />
          </div>
        ) : pathname === "/master/containersize" ? (
          <div>
            <ContainerSizeCreate
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            />
          </div>
        ) : pathname === "/create-contract" ? (
          <p className="text-xs text-yellow-700 ml-2 mt-1 w-32 hover:text-red-800 cursor-pointer">
            Create ConatainerSize
          </p>
        ) : null}
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
                {isEditMode ? "Edit ContainerSize" : "Create New ContainerSize"}
              </h4>
              <p className="text-sm text-muted-foreground">
                Enter the details for the new ConatainerSize
              </p>
            </div>
            <div className="grid gap-2">
              <Input
                id="containerSize"
                placeholder="Enter container size "
                value={formData.containerSize}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    containerSize: e.target.value,
                  }))
                }
              />
              {isEditMode && (
                <div className="grid gap-1">
                  <label
                    htmlFor="containerSize_status"
                    className="text-sm font-medium"
                  >
                    Status
                  </label>
                  <Select
                    value={formData.containerSize_status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        containerSize_status: value,
                      }))
                    }
                  >
                    <SelectTrigger
                      className={hasChanges ? "border-blue-200" : ""}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                          Active
                        </div>
                      </SelectItem>
                      <SelectItem value="Inactive">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                          Inactive
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  "Update ContainerSize"
                ) : (
                  "Create ContainerSize"
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

export default ContainerSizeForm;
