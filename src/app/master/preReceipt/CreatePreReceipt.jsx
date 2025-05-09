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
  PreRecepitsCreate,
  PreRecepitsEdit,
} from "@/components/buttonIndex/ButtonComponents";
import useApiToken from "@/components/common/useApiToken";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PreReceiptForm = ({ preReceiptId }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isEditMode = Boolean(preReceiptId);
  const [originalData, setOriginalData] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const token = useApiToken();
  const [formData, setFormData] = useState({
    prereceipts_name: isEditMode ? null : "",
    prereceipts_status: isEditMode ? "Active" : null,
  });
  const fetchPrerecepitData = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-prereceipts-by-id/${preReceiptId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const prereceiptsData = response?.data?.prereceipts;
      setFormData({
        prereceipts_status: prereceiptsData.prereceipts_status || "Active",
      });
      setOriginalData({
        prereceipts_status: prereceiptsData.prereceipts_status || "Active",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch Pre Receipt data",
        variant: "destructive",
      });
      setOpen(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (open && isEditMode) {
      fetchPrerecepitData();
    }
  }, [open, isEditMode]);
  const handleSubmit = async () => {
    const requiredFields = isEditMode
      ? {
          Status: "prereceipts_status",
        }
      : {
          Name: "prereceipts_name",
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
            `${BASE_URL}/api/panel-update-prereceipts/${preReceiptId}`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        : await axios.post(
            `${BASE_URL}/api/panel-create-prereceipts`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

      if (response?.data.code == 200) {
        toast({ title: "Success", description: response.data.msg });
        await queryClient.invalidateQueries(["prereceipt"]);

        if (!isEditMode) {
          setFormData({
            prereceipts_name: "",
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
          error.response?.data?.message || "Failed to submit prereceipt",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const hasChanges =
    originalData &&
    formData.prereceipts_status !== originalData.prereceipts_status;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {isEditMode ? (
          <div>
            <PreRecepitsEdit />
          </div>
        ) : pathname === "/master/prerecepits" ? (
          <div>
            <PreRecepitsCreate
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} `}
            ></PreRecepitsCreate>
          </div>
        ) : pathname === "/create-contract" ? (
          <p className="text-xs text-yellow-700 ml-2 mt-1 w-32 hover:text-red-800 cursor-pointer">
            Create Pre Receipt
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
                {isEditMode ? "Edit Pre Receipt" : "Create New Pre Receipt"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? "Update pre receipt details"
                  : "Enter the details for the new pre receipt"}
              </p>
            </div>
            <div className="grid gap-2">
              {!isEditMode ? (
                <Input
                  id="prereceipt"
                  placeholder="Enter Pre Receipt "
                  value={formData.prereceipts_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      prereceipts_name: e.target.value,
                    }))
                  }
                />
              ) : (
                <div className="grid gap-1">
                  <label
                    htmlFor="prereceipts_status"
                    className="text-sm font-medium"
                  >
                    Status
                  </label>
                  <Select
                    value={formData.prereceipts_status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        prereceipts_status: value,
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
                  "Update Pre Receipt"
                ) : (
                  "Create Pre Receipt"
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

export default PreReceiptForm;
