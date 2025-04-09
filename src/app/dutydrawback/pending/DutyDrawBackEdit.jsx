import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { Loader2, Edit, AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ButtonConfig } from "@/config/ButtonConfig";
import {
  DutyDrawBackPendingEdit,
  DutyDrawBackReceivedEdit,
} from "@/components/buttonIndex/ButtonComponents";
import { useLocation } from "react-router-dom";
const DutyDrawBackEdit = ({ pendingId }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    invoice_dd_scroll_no: "",
    invoice_dd_date: "",
    invoice_dd_status: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const location = useLocation();
  const isReceived = location.pathname == "/dutydrawback/received";
  const displayName = isReceived ? "Received" : "Pending";

  const fetchPendingData = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-invoice-by-id/${pendingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const pendingData = response?.data?.invoice;
      setFormData({
        invoice_dd_scroll_no: pendingData.invoice_dd_scroll_no || "",
        invoice_dd_date: pendingData.invoice_dd_date || "",
        invoice_dd_status: pendingData.invoice_dd_status || "",
      });
      setOriginalData({
        invoice_dd_scroll_no: pendingData.invoice_dd_scroll_no || "",
        invoice_dd_date: pendingData.invoice_dd_date || "",
        invoice_dd_status: pendingData.invoice_dd_status || "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pending data",
        variant: "destructive",
      });
      setOpen(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPendingData();
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!formData.invoice_dd_status.trim()) {
      toast({
        title: "Error",
        description: "Invoice DD Status is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-duty-drawback/${pendingId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data?.code === 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });

        await queryClient.invalidateQueries(["pending"]);
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.data.msg || "Something went wrong!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("API Error:", error.response); // Debug API error response
      toast({
        title: "Error",
        description:
          error.response?.data?.message || `Failed to update  ${displayName}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if there are changes
  const hasChanges =
    originalData &&
    (formData.invoice_dd_scroll_no !== originalData.invoice_dd_scroll_no ||
      formData.invoice_dd_date !== originalData.invoice_dd_date ||
      formData.invoice_dd_status !== originalData.invoice_dd_status);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <div>
                {displayName === "Pending" ? (
                  <DutyDrawBackPendingEdit
                    className={`transition-all duration-200 ${
                      isHovered ? "bg-blue-50" : ""
                    }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  />
                ) : (
                  <DutyDrawBackReceivedEdit
                    className={`transition-all duration-200 ${
                      isHovered ? "bg-blue-50" : ""
                    }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  />
                )}
              </div>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit {displayName}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="w-80">
        {isFetching ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Edit {displayName}</h4>
              <p className="text-sm text-muted-foreground">
                Update {displayName} details
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <label
                  htmlFor="invoice_dd_scroll_no"
                  className="text-sm font-medium"
                >
                  Scrool Number
                </label>
                <div className="relative">
                  <Input
                    id="invoice_dd_scroll_no"
                    placeholder="Enter scroll number"
                    value={formData.invoice_dd_scroll_no}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        invoice_dd_scroll_no: e.target.value,
                      }))
                    }
                    className={hasChanges ? "pr-8 border-blue-200" : ""}
                  />
                  {hasChanges &&
                    formData.invoice_dd_scroll_no !==
                      originalData.invoice_dd_scroll_no && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <RefreshCcw
                          className="h-4 w-4 text-blue-500 cursor-pointer hover:rotate-180 transition-all duration-300"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              invoice_dd_scroll_no:
                                originalData.invoice_dd_scroll_no,
                            }))
                          }
                        />
                      </div>
                    )}
                </div>
              </div>
              <div className="grid gap-1">
                <label
                  htmlFor="invoice_dd_date"
                  className="text-sm font-medium"
                >
                  DD Date
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    id="invoice_dd_date"
                    placeholder="Enter date"
                    value={formData.invoice_dd_date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        invoice_dd_date: e.target.value,
                      }))
                    }
                    className={hasChanges ? "pr-8 border-blue-200" : ""}
                  />
                  {hasChanges &&
                    formData.invoice_dd_date !==
                      originalData.invoice_dd_date && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <RefreshCcw
                          className="h-4 w-4 text-blue-500 cursor-pointer hover:rotate-180 transition-all duration-300"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              invoice_dd_date: originalData.invoice_dd_date,
                            }))
                          }
                        />
                      </div>
                    )}
                </div>
              </div>
              <div className="grid gap-1">
                <label
                  htmlFor="invoice_dd_status"
                  className="text-sm font-medium"
                >
                  Status
                </label>
                <Select
                  value={formData.invoice_dd_status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      invoice_dd_status: value,
                    }))
                  }
                >
                  <SelectTrigger
                    className={hasChanges ? "border-blue-200" : ""}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="Received">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                        Received
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                disabled={isLoading || !hasChanges}
                className={`mt-2 relative overflow-hidden ${
                  hasChanges
                    ? `${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}  `
                    : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  `Update  ${displayName}`
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

export default DutyDrawBackEdit;
