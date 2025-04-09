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
import { SchemeEdit } from "@/components/buttonIndex/ButtonComponents";

const EditScheme = ({ schemeId }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    scheme_description: "",
    scheme_tax: "",
    scheme_status: "Active",
  });

  const fetchCustomerData = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-scheme-by-id/${schemeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const schemeData = response.data.scheme;
      setFormData({
        scheme_description: schemeData.scheme_description,
        scheme_tax: schemeData.scheme_tax,
        scheme_status: schemeData.scheme_status,
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
      scheme_status: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.scheme_description ||
      !formData.scheme_tax ||
      !formData.scheme_status
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
        `${BASE_URL}/api/panel-update-scheme/${schemeId}`,
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

     
      await queryClient.invalidateQueries(["schemes"]);
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
        description: error.response?.data?.message || "Failed to update Scheme",
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
              <SchemeEdit
                className={`transition-all duration-200 ${
                  isHovered ? "bg-blue-50" : ""
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              ></SchemeEdit>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Scheme</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Scheme</DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="scheme_description">Scheme Description</Label>
              <textarea
                id="scheme_description"
                name="scheme_description"
                value={formData.scheme_description}
                onChange={handleInputChange}
                placeholder="Enter Scheme Description"
                className="w-full p-1 border border-gray-300 rounded-sm "
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="scheme_tax">Scheme Tax</Label>
              <Input
                id="scheme_tax"
                name="scheme_tax"
                value={formData.scheme_tax}
                onChange={handleInputChange}
                placeholder="Enter Scheme Tax "
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="scheme_status">Status</Label>
              <Select
                value={formData.scheme_status}
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
              "Update Scheme"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditScheme;
