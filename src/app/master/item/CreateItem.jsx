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
import { ItemCreate } from "@/components/buttonIndex/ButtonComponents";

const CreateItem = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    item_type: "",
    item_name: "",
    item_hsn: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.item_type || !formData.item_name || !formData.item_hsn) {
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
      const response = await axios.post(`${BASE_URL}/api/panel-create-item`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.data.code == 200) {
    
        toast({
          title: "Success",
          description: response.data.msg
        });
  
        setFormData({
          item_type: "",
          item_name: "",
          item_hsn: "",
        });
        await queryClient.invalidateQueries(["items"]);
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
        description: error.response?.data?.message || "Failed to create item",
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

        {pathname === "/master/item" ? (
          //  <Button
          //    variant="default"
          //    className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          //  >
          //    <SquarePlus className="h-4 w-4" /> Item
          //  </Button>
          <div>
            <ItemCreate
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            ></ItemCreate>
          </div>
        ) : pathname === "/create-contract" || pathname === "/create-invoice" ? (
          <p className="text-sm text-blue-600  hover:text-red-800 cursor-pointer">
            Create Item
          </p>
        ) : null}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Item</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="item_type">Item Type</Label>
            <Input
              id="item_type"
              name="item_type"
              value={formData.item_type}
              onChange={handleInputChange}
              placeholder="Enter Item Type"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="item_name">Item Name</Label>
            <textarea
              id="item_name"
              name="item_name"
              value={formData.item_name}
              onChange={handleInputChange}
              placeholder="Enter Item Name "
              className="w-full p-1 border border-gray-300 rounded-sm "
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="item_hsn">Item Hsn</Label>
            <Input
              id="item_hsn"
              name="item_hsn"
              value={formData.item_hsn}
              onChange={handleInputChange}
              placeholder="Enter Item Hsn "
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
              "Create Item"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateItem;
