import {
  ItemPackingCreate,
  ItemPackingEdit,
} from "@/components/buttonIndex/ButtonComponents";
import useApiToken from "@/components/common/useApiToken";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle, Loader2, SquarePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const CreateItemPackingForm = ({ itemId = null }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isEditMode = Boolean(itemId);
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    item_packing: isEditMode ? null : "",
    item_packing_unit: isEditMode ? null : "",
    item_packing_no: isEditMode ? null : "",
    item_packing_status: isEditMode ? "Active" : null,
  });
  const { pathname } = useLocation();

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token = useApiToken();

  useEffect(() => {
    const fetchData = async () => {
      if (!itemId || !open) return;
      setIsFetching(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-ItemPacking-by-id/${itemId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data.itemPacking;
        setFormData({
          item_packing_status: data?.item_packing_status || "Active",
        });
        setOriginalData({
          item_packing_status: data?.item_packing_status || "Active",
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
  }, [itemId, open]);
  const requiredFields = isEditMode
    ? {
        Status: "item_packing_status",
      }
    : {
        Packing: "item_packing",
        Unit: "item_packing_unit",
        "Packing No": "item_packing_no",
      };

  const handleSubmit = async () => {
    // Identify missing fields
    const missingFields = Object.entries(requiredFields).filter(
      ([label, field]) =>
        !formData[field]?.trim() && (!isEditMode || field !== "item_category")
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
        ? `${BASE_URL}/api/panel-update-ItemPacking/${itemId}`
        : `${BASE_URL}/api/panel-create-ItemPacking`;
      const method = isEditMode ? "put" : "post";

      const response = await axios[method](endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });

        queryClient.invalidateQueries(["itemCategory"]);
        setOpen(false);

        if (!isEditMode) {
          setFormData({ item_category: "" });
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
    formData.item_packing_status !== originalData.item_packing_status;
  const handleChange = (e) => {
    const { name, value } = e.target;
    const isValid = /^\d*\.?\d*$/.test(value);

    if ((name === "item_packing" || name === "item_packing_no") && !isValid)
      return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {isEditMode ? (
          <div>
            <ItemPackingEdit />
          </div>
        ) : pathname === "/master/item-packing" ? (
          <div>
            <ItemPackingCreate
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            />
          </div>
        ) : pathname === "/create-contract/new" ||
          pathname === "/create-invoice/new" ? (
          <p className="text-xs text-blue-600 hover:text-red-800 cursor-pointer">
            <span className="flex items-center flex-row gap-1">
              <SquarePlus className="w-4 h-4" /> <span>Add</span>
            </span>
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
                {isEditMode ? "Edit Item Packing" : "Create Item Packing"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? "Update item packing details"
                  : "Enter the item packing details"}
              </p>
            </div>
            <div className="grid gap-2">
              {!isEditMode ? (
                <>
                  <Input
                    id="item_packing"
                    placeholder="Enter Item Packing"
                    value={formData.item_packing}
                    name="item_packing"
                    onChange={handleChange}
                  />

                  <Select
                    value={formData.item_packing_unit}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        item_packing_unit: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GM">GM</SelectItem>
                      <SelectItem value="KG">KG</SelectItem>
                      <SelectItem value="ML">ML</SelectItem>
                      <SelectItem value="LTR">LTR</SelectItem>
                      <SelectItem value="LBS">LBS</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="item_packing_no"
                    placeholder="Enter Item Packing No"
                    value={formData.item_packing_no}
                    name="item_packing_no"
                    onChange={handleChange}
                  />
                </>
              ) : (
                <Select
                  value={formData.item_packing_status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      item_packing_status: value,
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
                  "Update Item Packing"
                ) : (
                  "Create Item Packing"
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

export default CreateItemPackingForm;
