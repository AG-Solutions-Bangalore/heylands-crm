import {
  ProductCreate,
  ProductEdit,
} from "@/components/buttonIndex/ButtonComponents";
import useApiToken from "@/components/common/useApiToken";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BASE_URL from "@/config/BaseUrl";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const CreateProductForm = ({ productId = null }) => {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isEditMode = Boolean(productId);
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    product_name: isEditMode ? null : "",
    product_rodtep_per: "",
    product_drawback_per: "",
    product_default_statement: "",
    product_status: isEditMode ? "Active" : null,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const token = useApiToken();
  const fetchProductData = async () => {
    if (!productId) return;
    setIsFetching(true);
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/panel-fetch-product-by-id/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const product = data.product;
      setFormData({
        product_rodtep_per: product.product_rodtep_per || "",
        product_drawback_per: product.product_drawback_per,
        product_default_statement: product.product_default_statement,
        product_status: product.product_status || "Active",
      });
      setOriginalData({
        product_rodtep_per: product.product_rodtep_per || "",
        product_drawback_per: product.product_drawback_per,
        product_default_statement: product.product_default_statement,
        product_status: product.product_status || "Active",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch product data",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (open && isEditMode) {
      fetchProductData();
    }
  }, [open]);

  const handleInputChange = (e, key = null, val = null) => {
    const decimalAllowedFields = ["product_rodtep_per", "product_drawback_per"];

    const isValidDecimal = (input) => /^(\d+)?(\.\d*)?$/.test(input);

    if (e?.target) {
      const { name, value } = e.target;

      if (decimalAllowedFields.includes(name) && !isValidDecimal(value)) return;

      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (key) {
      if (decimalAllowedFields.includes(key) && !isValidDecimal(val)) return;

      setFormData((prev) => ({ ...prev, [key]: val }));
    }
  };
  const handleSubmit = async () => {
    const requiredFields = isEditMode
      ? {
          Status: "product_status",
          RODTEP: "product_rodtep_per",
          Drawback: "product_drawback_per",
          "Default Statement": "product_default_statement",
        }
      : {
          Name: "product_name",
          RODTEP: "product_rodtep_per",
          Drawback: "product_drawback_per",
          "Default Statement": "product_default_statement",
        };
    const missingFields = Object.entries(requiredFields).filter(
      ([label, field]) =>
        !formData[field]?.trim() && (!isEditMode || field !== "product_name")
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
            `${BASE_URL}/api/panel-update-product/${productId}`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        : await axios.post(`${BASE_URL}/api/panel-create-product`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });

      if (response?.data.code === 200) {
        toast({ title: "Success", description: response.data.msg });
        await queryClient.invalidateQueries(["banks"]);

        if (
          !isEditMode &&
          setFormData({
            product_name: "",
            product_rodtep_per: "",
            product_drawback_per: "",
            product_default_statement: "",
          })
        )
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
        description: error.response?.data?.message || "Operation failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const hasChanges =
    isEditMode &&
    originalData &&
    (formData.product_rodtep_per !== originalData.product_rodtep_per ||
      formData.product_drawback_per !== originalData.product_drawback_per ||
      formData.product_default_statement !==
        originalData.product_default_statement ||
      formData.product_status !== originalData.product_status);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isEditMode ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <ProductEdit
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                />
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Product</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <DialogTrigger asChild>
          {pathname === "/master/product" ? (
            <div>
              <ProductCreate
                className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              ></ProductCreate>
            </div>
          ) : pathname === "/create-enquiries" ||
            pathname === "/costing-create" ? (
            <p className="text-xs text-yellow-700 ml-2 mt-1 w-32 hover:text-red-800 cursor-pointer">
              Create Product
            </p>
          ) : null}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Product" : "Create New Product"}
          </DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {!isEditMode && (
              <div className="grid gap-2">
                <Label htmlFor="bank_name">Product Name</Label>
                <Input
                  id="product_name"
                  placeholder="Enter product name"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="product_rodtep_per">RODTEP</Label>
              <Input
                id="product_rodtep_per"
                name="product_rodtep_per"
                value={formData.product_rodtep_per}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="product_drawback_per">DrawBack</Label>
              <Input
                id="product_drawback_per"
                name="product_drawback_per"
                value={formData.product_drawback_per}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="product_default_statement">
                {" "}
                Default Statement
              </Label>
              <textarea
                id="product_default_statement"
                placeholder="Enter Default Statement"
                className="w-full p-1 border border-gray-300 rounded-sm "
                value={formData.product_default_statement}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    product_default_statement: e.target.value,
                  }))
                }
              />
            </div>

            {isEditMode && (
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={formData.product_status}
                  onValueChange={(val) =>
                    handleInputChange(null, "product_status", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
        {hasChanges && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-600 text-sm">
              You have unsaved changes
            </AlertDescription>
          </Alert>
        )}
        <DialogFooter>
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
              "Update Product"
            ) : (
              "Create Product"
            )}
            {hasChanges && !isLoading && (
              <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductForm;
