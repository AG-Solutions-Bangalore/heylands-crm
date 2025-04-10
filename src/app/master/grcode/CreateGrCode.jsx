import {
  GRCodeCreate,
  GRCodeEdit,
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const GrCodeForm = ({ grcodeId }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isEditMode = Boolean(grcodeId);
  const [originalData, setOriginalData] = useState(null);
  const token = useApiToken();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  const [formData, setFormData] = useState({
    gr_code_des: isEditMode ? null : " ",
    product_name: isEditMode ? null : "",
    gr_code_status: isEditMode ? "Active" : null,
  });

  const fetchGRCodeData = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-grcode-by-id/${grcodeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const stateData = response?.data?.grcode;
      setFormData({
        gr_code_status: stateData.gr_code_status || "Active",
      });
      setOriginalData({
        gr_code_status: stateData.gr_code_status || "Active",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch gr code status data",
        variant: "destructive",
      });
      console.log(error);
      setOpen(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (open && isEditMode) {
      fetchGRCodeData();
    }
  }, [open, isEditMode]);
  const handleSubmit = async () => {
    const requiredFields = isEditMode
      ? {
          Status: "gr_code_status",
        }
      : {
          Description: "gr_code_des",
          "Product Name": "product_name",
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
            `${BASE_URL}/api/panel-update-grcode/${grcodeId}`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        : await axios.post(`${BASE_URL}/api/panel-create-grcode`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });

      if (response?.data.code == 200) {
        toast({ title: "Success", description: response.data.msg });
        await queryClient.invalidateQueries(["grcodeList"]);

        if (!isEditMode) {
          setFormData({
            gr_code_des: "",
            product_name: "",
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
          error.response?.data?.message || "Failed to submit grcodeList",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    data: grcodeData,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["grcode"],
    queryFn: async () => {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-product-list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
  });
  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const hasChanges =
    originalData && formData.gr_code_status !== originalData.gr_code_status;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {isEditMode ? (
          <div>
            <GRCodeEdit />
          </div>
        ) : pathname === "/master/grcode" ? (
          <div>
            <GRCodeCreate
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            ></GRCodeCreate>
          </div>
        ) : pathname === "/create-contract" ? (
          <p className="text-xs text-yellow-700 ml-2 mt-1 w-32 hover:text-red-800 cursor-pointer">
            Create GR Code
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
                {" "}
                {isEditMode ? "Edit GR Code" : "Create New GR Code"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? "Update state details"
                  : "Enter the details for the new GR Code"}
              </p>
            </div>
            <div className="grid gap-2">
              {!isEditMode ? (
                <>
                  {/* <Input
                    id="gr_code_des"
                    placeholder="Enter gr code desc"
                    value={formData.gr_code_des}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gr_code_des: e.target.value,
                      }))
                    }
                  /> */}
                  <div className="grid gap-2">
                    <label
                      htmlFor="gr_code_des"
                      className="block text-sm font-medium"
                    >
                      Description
                    </label>
                    <textarea
                      id="gr_code_des"
                      placeholder="Enter gr code"
                      className="w-full p-1 border border-gray-300 rounded-sm "
                      value={formData.gr_code_des}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          gr_code_des: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product <span className="text-red-500"></span>
                    </label>
                    <Select
                      value={formData.product_name}
                      onValueChange={(value) =>
                        handleInputChange({ target: { value } }, "product_name")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product name" />
                      </SelectTrigger>
                      <SelectContent>
                        {grcodeData?.product?.map((product) => (
                          <SelectItem
                            key={product.id}
                            value={product.product_name}
                          >
                            {product.product_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <div className="grid gap-1">
                  <label
                    htmlFor="gr_code_status"
                    className="text-sm font-medium"
                  >
                    Status
                  </label>
                  <Select
                    value={formData.gr_code_status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        gr_code_status: value,
                      }))
                    }
                  >
                    <SelectTrigger
                      className={hasChanges ? "border-blue-200" : ""}
                    >
                      <SelectValue placeholder="Select grcode" />
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
                  "Update GR Code"
                ) : (
                  "Create GR Code"
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

export default GrCodeForm;
