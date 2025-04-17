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
  PortofLoadingCreate,
  PortofLoadingEdit,
} from "@/components/buttonIndex/ButtonComponents";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useApiToken from "@/components/common/useApiToken";
const PortofLoadingForm = ({ portId = null }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const isEditMode = Boolean(portId);
  const { toast } = useToast();
  const token = useApiToken();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const [formData, setFormData] = useState({
    portofLoading: "",
    portofLoadingCountry: "",
    portofLoading_status: isEditMode ? "Active" : null,
  });

  const fetchPortofLoadingData = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-portofLoading-by-id/${portId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const qualityData = response?.data?.portofLoading;

      setFormData({
        portofLoading_status: qualityData.portofLoading_status || "Active",
      });
      setOriginalData({
        portofLoading_status: qualityData.portofLoading_status || "Active",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch portofLoading data",
        variant: "destructive",
      });
      setOpen(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (open && isEditMode) {
      fetchPortofLoadingData();
    }
  }, [open, isEditMode]);
  const handleSubmit = async () => {
    const requiredFields = isEditMode
      ? {
          Status: "portofLoading_status",
        }
      : {
          "Port of Loading": "portofLoading",
          "Loading Country": "portofLoadingCountry",
        };
    const missingFields = Object.entries(requiredFields).filter(
      ([label, field]) => !formData[field]?.trim()
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
            `${BASE_URL}/api/panel-update-portofLoading/${portId}`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        : await axios.post(
            `${BASE_URL}/api/panel-create-portofLoading`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

      if (response?.data.code == 200) {
        toast({ title: "Success", description: response.data.msg });
        await queryClient.invalidateQueries(["portofLoadingList"]);

        if (!isEditMode) {
          setFormData({
            portofLoading: "",
            portofLoadingCountry: "",
          });
        }
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.data.msg,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to submit port of loading",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges =
    originalData &&
    formData.portofLoading_status !== originalData.portofLoading_status;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <PopoverTrigger asChild>
          {isEditMode ? (
            <div onClick={() => setOpen(true)}>
              <PortofLoadingEdit />
            </div>
          ) : pathname === "/master/portofloading" ? (
            <div onClick={() => setOpen(true)}>
              <PortofLoadingCreate
                className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              />
            </div>
          ) : pathname === "/create-contract/new" ||
            pathname === "/create-invoice/new" ||
            pathname === "/costing-create" ? (
            <p className="text-xs text-blue-600 hover:text-red-800 cursor-pointer">
              <span className="flex items-center flex-row gap-1">
                <SquarePlus className="w-4 h-4" /> <span>Add</span>
              </span>
            </p>
          ) : null}
        </PopoverTrigger>
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
                {isEditMode ? "Edit PortofLoading" : "Create New PortofLoading"}
              </h4>
              <p className="text-sm text-muted-foreground">
                Enter the details for the portofLoading
              </p>
            </div>
            <div className="grid gap-2">
              {!isEditMode ? (
                <>
                  <Input
                    id="PortofLoading"
                    placeholder="Enter PortofLoading"
                    value={formData.portofLoading}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        portofLoading: e.target.value,
                      }))
                    }
                  />
                  <Input
                    id="portofLoadingCountry"
                    placeholder="Enter portofLoadingCountry"
                    value={formData.portofLoadingCountry}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        portofLoadingCountry: e.target.value,
                      }))
                    }
                  />
                </>
              ) : (
                <div className="grid gap-1">
                  <label
                    htmlFor="quality_status"
                    className="text-sm font-medium"
                  >
                    Status
                  </label>
                  <Select
                    value={formData.portofLoading_status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        portofLoading_status: value,
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
                  "Update State"
                ) : (
                  "Create PortofLoading"
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

export default PortofLoadingForm;
