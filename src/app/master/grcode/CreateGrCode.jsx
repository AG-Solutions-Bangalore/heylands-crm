import React from "react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { Loader2, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonConfig } from "@/config/ButtonConfig";
import { GRCodeCreate } from "@/components/buttonIndex/ButtonComponents";

const CreateGrCode = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    gr_code_des: "",
    product_name: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const handleSubmit = async () => {
    if (!formData.gr_code_des.trim() || !formData.product_name.trim()) {
      toast({
        title: "Error",
        description: "gr code desc and product name are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASE_URL}/api/panel-create-grcode`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });


      if (response?.data.code == 200) {
    
        toast({
          title: "Success",
          description: response.data.msg
        });
  
        setFormData({
          gr_code_des: "",
          product_name: "",
        });
        await queryClient.invalidateQueries(["grcodeList"]);
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
        description: error.response?.data?.message || "Failed to create Grcode",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGrCode = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const response = await fetch(`${BASE_URL}/api/panel-fetch-product-list`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch buyer data");
    return response.json();
  };

  const { data: grcodeData } = useQuery({
    queryKey: ["grcode"],
    queryFn: fetchGrCode,
  });

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {pathname === "/master/grcode" ? (
          // <Button
          //   variant="default"
          //   className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          // >
          //   <SquarePlus className="h-4 w-4 mr-2" /> GR Code
          // </Button>
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
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Create New GR Code</h4>
            <p className="text-sm text-muted-foreground">
              Enter the details for the new GR Code
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              id="gr_code_des"
              placeholder="Enter gr code desc"
              value={formData.gr_code_des}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  gr_code_des: e.target.value,
                }))
              }
            />

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
                    <SelectItem key={product.id} value={product.product_name}>
                      {product.product_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`mt-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create GR Code"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreateGrCode;
