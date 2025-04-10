import {
  OrderTypeCreate,
  OrderTypeEdit,
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

const CreateOrderTypeForm = ({ orderId = null }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isEditMode = Boolean(orderId);
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    order_type: isEditMode ? null : "",
    order_type_status: isEditMode ? "Active" : null,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token = useApiToken();

  // Fetch data for edit
  useEffect(() => {
    const fetchData = async () => {
      if (!orderId || !open) return;
      setIsFetching(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-orderType-by-id/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data.orderType;
        setFormData({
          order_type_status: data?.order_type_status || "Active",
        });
        setOriginalData({
          order_type_status: data?.order_type_status || "Active",
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
  }, [orderId, open]);
  const requiredFields = isEditMode
    ? {
        Status: "order_type_status",
      }
    : {
        "Order Type": "order_type",
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
        ? `${BASE_URL}/api/panel-update-orderType/${orderId}`
        : `${BASE_URL}/api/panel-create-orderType`;
      const method = isEditMode ? "put" : "post";

      const response = await axios[method](endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });

        queryClient.invalidateQueries(["ordertypes"]);
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
    formData.order_type_status !== originalData.order_type_status;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {isEditMode ? (
          <div>
            <OrderTypeEdit />
          </div>
        ) : (
          <div>
            <OrderTypeCreate
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            />
          </div>
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
                {isEditMode ? "Edit Order Type" : "Create Order Type"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? "Update order type details"
                  : "Enter the order typedetails"}
              </p>
            </div>
            <div className="grid gap-2">
              {!isEditMode && (
                <Input
                  id="order_type"
                  placeholder="Enter order type"
                  value={formData.order_type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      order_type: e.target.value,
                    }))
                  }
                />
              )}

              {isEditMode && (
                <Select
                  value={formData.order_type_status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      order_type_status: value,
                    }))
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
                  "Update Order Type"
                ) : (
                  "Create Order Type"
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

export default CreateOrderTypeForm;
