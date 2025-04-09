import React from "react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
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
import { ButtonConfig } from "@/config/ButtonConfig";
import { BagTypeCreate } from "@/components/buttonIndex/ButtonComponents";
const CreateBagType = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bagType: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const handleSubmit = async () => {
    if (!formData.bagType.trim()) {
      toast({
        title: "Error",
        description: "Description of Goods  are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
       const response = await axios.post(`${BASE_URL}/api/panel-create-bagType`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    
      if (response?.data.code == 200) {
    
        toast({
          title: "Success",
          description: response.data.msg || "Bag type Created successfully", // Show response message if available
        });
  
        setFormData({ bagType: "" });
        await queryClient.invalidateQueries(["bagTypeList"]);
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
          error.response?.data?.message || "Failed to create Bag Type",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {pathname === "/master/bagType" ? (
          // <Button
          //   variant="default"
          //   className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} `}
          // >
          //   <SquarePlus className="h-4 w-4 " /> Bag Type
          // </Button>
          <div>
            <BagTypeCreate
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} `}
            ></BagTypeCreate>
          </div>
        ) : pathname === "/create-contract" ? (
          <p className="text-xs text-yellow-700 ml-2 mt-1 w-32 hover:text-red-800 cursor-pointer">
            Create Bag Type
          </p>
        ) : null}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Create New Bag Type</h4>
            <p className="text-sm text-muted-foreground">
              Enter the details for the bag type
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              id="bagType"
              placeholder="Enter Bag Type "
              value={formData.bagType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bagType: e.target.value,
                }))
              }
            />

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`mt-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create  Bag Type"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreateBagType;
