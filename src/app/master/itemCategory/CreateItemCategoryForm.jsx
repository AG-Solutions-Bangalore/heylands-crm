import {
  ItemCategoryCreate,
  ItemCategoryEdit,
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
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const CreateItemCategoryForm = ({ itemId = null }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isEditMode = Boolean(itemId);
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    item_category: isEditMode ? null : "",
    order_type_status: isEditMode ? "Active" : null,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token = useApiToken();
  const {
    data: ItemCategory,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["ItemCategory", open, !isEditMode],
    queryFn: async () => {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-ItemCategory`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.itemCategory || [];
    },
    enabled: open && !isEditMode,
  });
  const handleInputChange = (e, key = null, val = null) => {
    if (e?.target) {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (key) {
      setFormData((prev) => ({ ...prev, [key]: val }));
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!itemId || !open) return;
      setIsFetching(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-ItemCategory-by-id/${itemId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data.itemCategory;
        setFormData({
          item_category_status: data?.item_category_status || "Active",
        });
        setOriginalData({
          item_category_status: data?.item_category_status || "Active",
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
        Status: "item_category_status",
      }
    : {
        "Item Category": "item_category",
      };

  const handleSubmit = async () => {
    // Identify missing fields
    const missingFields = Object.entries(requiredFields).filter(
      ([label, field]) =>
        !formData[field]?.trim() && (!isEditMode || field !== "item_category") // skip state_name in edit mode
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
        ? `${BASE_URL}/api/panel-update-ItemCategory/${itemId}`
        : `${BASE_URL}/api/panel-create-ItemCategory`;
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
    formData.item_category_status !== originalData.item_category_status;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {isEditMode ? (
          <div>
            <ItemCategoryEdit />
          </div>
        ) : (
          <div>
            <ItemCategoryCreate
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
                {isEditMode ? "Edit Item Category" : "Create Item Category"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? "Update item category details"
                  : "Enter the item category details"}
              </p>
            </div>
            <div className="grid gap-2">
              {!isEditMode ? (
                <div>
                  <Label htmlFor="item_category">Item Category</Label>
                  <Select
                    value={formData.item_category}
                    onValueChange={(val) =>
                      handleInputChange(null, "item_category", val)
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select Item Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {ItemCategory?.map((b, i) => (
                        <SelectItem key={i} value={b.item_category}>
                          {b.item_category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <Select
                  value={formData.item_category_status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      item_category_status: value,
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
                  "Update Item Category"
                ) : (
                  "Create Item Category"
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

export default CreateItemCategoryForm;
