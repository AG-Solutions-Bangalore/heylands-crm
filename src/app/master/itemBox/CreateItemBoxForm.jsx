import {
  ItemBoxCreate,
  ItemBoxEdit,
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

const CreateItemBoxForm = ({ itemId = null }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isEditMode = Boolean(itemId);
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    item_box_size: isEditMode ? null : "",
    item_box_weight: isEditMode ? null : "",
    item_box_status: isEditMode ? "Active" : null,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token = useApiToken();

  useEffect(() => {
    const fetchData = async () => {
      if (!itemId || !open) return;
      setIsFetching(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-ItemBox-by-id/${itemId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data.itemBox;
        setFormData({
          item_box_status: data?.item_box_status || "Active",
        });
        setOriginalData({
          item_box_status: data?.item_box_status || "Active",
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
        Status: "item_box_status",
      }
    : {
        "Box Size": "item_box_size",
        Weight: "item_box_weight",
      };

  const handleSubmit = async () => {
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
      const endpoint = isEditMode
        ? `${BASE_URL}/api/panel-update-ItemBox/${itemId}`
        : `${BASE_URL}/api/panel-create-ItemBox`;
      const method = isEditMode ? "put" : "post";

      const response = await axios[method](endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });

        queryClient.invalidateQueries(["itemBox"]);
        setOpen(false);

        if (!isEditMode) {
          setFormData({ item_box_size: "", item_box_weight: "" });
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
    formData.item_box_status !== originalData.item_box_status;
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "item_box_size") {
      const isValidDimension = /^[\d.X]*$/.test(value);
      if (!isValidDimension) return;
    }

    if (name === "item_box_weight") {
      const isValidWeight = /^\d*\.?\d*$/.test(value);
      if (!isValidWeight) return;
    }

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
            <ItemBoxEdit />
          </div>
        ) : (
          <div>
            <ItemBoxCreate
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
                {isEditMode ? "Edit Item Box" : "Create Item Box"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? "Update item box details"
                  : "Enter the item box details"}
              </p>
            </div>
            <div className="grid gap-2">
              {!isEditMode ? (
                <>
                  <Input
                    id="item_box_size"
                    placeholder="Enter Item Box"
                    value={formData.item_box_size}
                    name="item_box_size"
                    onChange={handleChange}
                  />

                  <Input
                    id="item_box_weight"
                    placeholder="Enter Item Weight"
                    value={formData.item_box_weight}
                    name="item_box_weight"
                    onChange={handleChange}
                  />
                </>
              ) : (
                <Select
                  value={formData.item_box_status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      item_box_status: value,
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
                  "Update Item Box"
                ) : (
                  "Create Item Box"
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

export default CreateItemBoxForm;
