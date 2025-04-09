import { useToast } from "@/hooks/use-toast";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { Edit, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ButtonConfig } from "@/config/ButtonConfig";
import { ProductDescriptionEdit } from "@/components/buttonIndex/ButtonComponents";

const EditProductDescription = ({ proDescId }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    product_name:"",
    product_description: "",
    product_hs: "",
    product_hsn: "",
    product_status: "Active",
  });

  const fetchCustomerData = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-product-description-by-id/${proDescId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const productSubData = response.data.productSub;
      setFormData({
        product_name: productSubData?.product_name,
        product_description: productSubData.product_description,
        product_hs: productSubData.product_hs,
        product_hsn: productSubData.product_hsn,
        product_status: productSubData.product_status,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch scheme data",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCustomerData();
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      product_status: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.product_description ||
      !formData.product_hs ||
      !formData.product_hsn ||
      !formData.product_status
    ) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-product-description/${proDescId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data.code == 200) {
    
        toast({
          title: "Success",
          description: response.data.msg
        });
  
       
        await queryClient.invalidateQueries(["productsSub"]);
  
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
          error.response?.data?.message || "Failed to update Product Desc",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
                 <Button variant="ghost" size="icon">
                   <Edit className="h-4 w-4" />
                 </Button>
               </DialogTrigger> */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              {/* <Button
                      variant="ghost"
                      size="icon"
                      className={`transition-all duration-200 ${
                        isHovered ? "bg-blue-50" : ""
                      }`}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <Edit
                        className={`h-4 w-4 transition-all duration-200 ${
                          isHovered ? "text-blue-500" : ""
                        }`}
                      />
                    </Button> */}
              <div>
                <ProductDescriptionEdit
                  className={`transition-all duration-200 ${
                    isHovered ? "bg-blue-50" : ""
                  }`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                ></ProductDescriptionEdit>
              </div>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Custome</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Custom Desc for {formData.product_name}</DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="product_description">Product Description</Label>
              <textarea
                id="product_description"
                name="product_description"
                value={formData.product_description}
                onChange={handleInputChange}
                placeholder="Enter Product Description"
                className="w-full p-1 border border-gray-300 rounded-sm "
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="product_hs">HS</Label>
              <Input
                id="product_hs"
                name="product_hs"
                value={formData.product_hs}
                onChange={handleInputChange}
                placeholder="Enter HS  "
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product_hsn">HSN</Label>
              <Input
                id="product_hsn"
                name="product_hsn"
                value={formData.product_hsn}
                onChange={handleInputChange}
                placeholder="Enter HSN "
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="product_status">Status</Label>
              <Select
                value={formData.product_status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || isFetching}
            className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Product Desc"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDescription;
