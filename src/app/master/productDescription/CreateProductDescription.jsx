import { useToast } from "@/hooks/use-toast";
import React from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { Loader2, SquarePlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { ButtonConfig } from "@/config/ButtonConfig";
import { ProductDescriptionCreate } from "@/components/buttonIndex/ButtonComponents";
import { useFetchProduct } from "@/hooks/useApi";

const CreateProductDescription = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    product_hs: "",
    product_hsn: "",
  });

  const handleInputChange = (e, key, value) => {
    if (e && e.target) {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };
const { data: productData } = useFetchProduct();
  const handleSubmit = async () => {
    if (
      !formData.product_name ||
      !formData.product_description ||
      !formData.product_hs ||
      !formData.product_hsn
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
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-product-description`,
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
  
        setFormData({
          product_name: "",
          product_description: "",
          product_hs: "",
          product_hsn: "",
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
          error.response?.data?.message || "Failed to create Product Desc",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <Button variant="default" className="ml-2 bg-yellow-500 text-black hover:bg-yellow-100">
                   <SquarePlus className="h-4 w-4" /> Customer
                 </Button> */}

        {pathname === "/master/productdescription" ? (
          //  <Button
          //    variant="default"
          //    className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          //  >
          //    <SquarePlus className="h-4 w-4" /> Product Desc
          //  </Button>
          <div>
            <ProductDescriptionCreate
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            />
          </div>
        ) : pathname === "/create-contract" ? (
          <p className="text-xs text-yellow-700 ml-2 mt-1 w-32 hover:text-red-800 cursor-pointer">
            Create Custom Desc
          </p>
        ) : null}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Custom Desc</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="product_name">Product Name</Label>
         
            <Select
              value={formData.product_name}
              onValueChange={(value) =>
                handleInputChange(null, "product_name", value)
              }
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select product " />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {productData?.product?.map((product, index) => (
                  <SelectItem key={index} value={product.product_name}>
                    {product.product_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="product_description">Product Description</Label>
            <textarea
              id="product_description"
              name="product_description"
              value={formData.product_description}
              onChange={handleInputChange}
              placeholder="Enter Product Description"
              className="w-full p-1  border border-gray-300 rounded-sm "
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="product_hs">HS</Label>
            <Input
              id="product_hs"
              name="product_hs"
              value={formData.product_hs}
              onChange={handleInputChange}
              placeholder="Enter HS details "
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="product_hsn">HSN</Label>
            <Input
              id="product_hsn"
              name="product_hsn"
              value={formData.product_hsn}
              onChange={handleInputChange}
              placeholder="Enter HSN  details "
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Product Desc"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductDescription;
