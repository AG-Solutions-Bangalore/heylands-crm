import { useToast } from "@/hooks/use-toast";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { Loader2, SquarePlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { ButtonConfig } from "@/config/ButtonConfig";

const CreatePurProd = () => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { pathname } = useLocation();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
      purchaseOrderProduct: "",
      purchaseOrderProduct_hsn: "",
 
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async () => {
      if (
        !formData.purchaseOrderProduct 
      
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
        const response = await axios.post(`${BASE_URL}/api/panel-create-purchase-order-product`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response?.data.code == 200) {
      
          toast({
            title: "Success",
            description: response.data.msg
          });
    
          setFormData({
            purchaseOrderProduct: "",
            purchaseOrderProduct_hsn: "",
           
          });
          await queryClient.invalidateQueries(["purchaseorderproducts"]);
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
          description: error.response?.data?.message || "Failed to create purchase product",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
  return (
    <>
  
       <Popover open={open} onOpenChange={setOpen}>
       <PopoverTrigger asChild>
         {pathname === "/master/purchase-product" ? (
         
           <Button
           variant="default"
           className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
         >
           <SquarePlus className="h-4 w-4" /> Purchase Product
         </Button>
          
         ) : pathname === "/create-contract" ? (
           <p className="text-xs text-yellow-700 ml-2 mt-1 w-32 hover:text-red-800 cursor-pointer">
             Purchase Product
           </p>
         ) : null}
       </PopoverTrigger>
       <PopoverContent className="w-80">
         <div className="grid gap-4">
           <div className="space-y-2">
             <h4 className="font-medium leading-none"> Create Purchase product</h4>
             <p className="text-sm text-muted-foreground">
               Enter the details for the new Purchase Product
             </p>
           </div>
           <div className="grid gap-2">
           <Input
                 id="purchaseOrderProduct"
                 name="purchaseOrderProduct"
                 value={formData.purchaseOrderProduct}
                 onChange={handleInputChange}
                 placeholder="Enter purchase order product"
               />
          
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
                 "Create Purchase product"
               )}
             </Button>
           </div>
         </div>
       </PopoverContent>
     </Popover>
     </>
  )
}

export default CreatePurProd