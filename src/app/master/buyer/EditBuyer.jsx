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
import { useFetchCountrys, useFetchPorts } from "@/hooks/useApi";
import { Textarea } from "@/components/ui/textarea";
const EditBuyer = ({buyerId}) => {
    const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    buyer_sort: "",
    buyer_group: "",
    buyer_name: "",
    buyer_address: "",
    buyer_port: "",
    buyer_country: "",
    buyer_ecgc_ref: "",
    buyer_status: "Active",
  });

  const fetchBuyerData = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-buyer-by-id/${buyerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const buyerData = response.data.buyer;
      setFormData({
        buyer_sort: buyerData.buyer_sort,
        buyer_group: buyerData.buyer_group,
        buyer_address: buyerData.buyer_address,
        buyer_port: buyerData.buyer_port,
        buyer_name: buyerData.buyer_name,
        buyer_country: buyerData.buyer_country,
        buyer_ecgc_ref: buyerData.buyer_ecgc_ref,
        buyer_status: buyerData.buyer_status,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bank buyer",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (open) {
        fetchBuyerData();
    }
  }, [open]);

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
const { data: portsData } = useFetchPorts();
  const { data: countryData } = useFetchCountrys();
  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      buyer_status: value,
    }));
  };

  const handleSubmit = async () => {
    if (
        !formData.buyer_sort ||
        !formData.buyer_address ||
        !formData.buyer_port ||
        !formData.buyer_country || 
      !formData.buyer_status
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
      const response = await axios.put(`${BASE_URL}/api/panel-update-buyer/${buyerId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.data.code == 200) {
    
        toast({
          title: "Success",
          description: response.data.msg
        });
  
       
        await queryClient.invalidateQueries(["buyers"]);
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
        description: error.response?.data?.message || "Failed to update buyer",
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
               <Button
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
               </Button>
               {/* <BankEdit
                 onMouseEnter={() => setIsHovered(true)}
                 onMouseLeave={() => setIsHovered(false)}
               ></BankEdit> */}
             </DialogTrigger>
           </TooltipTrigger>
           <TooltipContent>
             <p>Edit Buyer</p>
           </TooltipContent>
         </Tooltip>
       </TooltipProvider>
 
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle>Edit Buyer - <span className="text-xl text-blue-500">{formData.buyer_name}</span></DialogTitle>
         </DialogHeader>
 
         {isFetching ? (
           <div className="flex justify-center py-8">
             <Loader2 className="h-6 w-6 animate-spin" />
           </div>
         ) : (
           <div className="grid gap-4 py-4">
        
        <div className=" flex items-center justify-between gap-2 ">
                    <div className="grid gap-2">
                      <Label htmlFor="buyer_sort"> Short Name</Label>
                      <Input
                        id="buyer_sort"
                        name="buyer_sort"
                        value={formData.buyer_sort}
                        onChange={handleInputChange}
                        placeholder="Enter buyer short name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="buyer_group"> Group</Label>
                      <Input
                        id="buyer_group"
                        name="buyer_group"
                        value={formData.buyer_group}
                        onChange={handleInputChange}
                        placeholder="Enter buyer group name"
                      />
                    </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="buyer_address"> Address</Label>
                      <Textarea
                        id="buyer_address"
                        name="buyer_address"
                        rows={3}
                        value={formData.buyer_address}
                        onChange={handleInputChange}
                        placeholder="Enter buyer address"
                      />
                    </div>
          
                    <div className=" flex items-center justify-between gap-2 ">
                      <div className="w-full">
                        <Label htmlFor="buyer_port"> Port</Label>
                        <Select
                          value={formData.buyer_port}
                          onValueChange={(value) =>
                            handleInputChange(null, "buyer_port", value)
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Port" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {portsData?.country?.map((country, index) => (
                              <SelectItem key={index} value={country.country_port}>
                                {country.country_port}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-full">
                        <Label htmlFor="buyer_country"> Country</Label>
                        <Select
                          value={formData.buyer_country}
                          onValueChange={(value) =>
                            handleInputChange(null, "buyer_country", value)
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {countryData?.country?.map((country, index) => (
                              <SelectItem key={index} value={country.country_name}>
                                {country.country_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
          
                    {/* <div className="grid gap-2">
                      <Label htmlFor="buyer_ecgc_ref">ECGC Ref</Label>
                      <Input
                        id="buyer_ecgc_ref"
                        name="buyer_ecgc_ref"
                        value={formData.buyer_ecgc_ref}
                        onChange={handleInputChange}
                        placeholder="Enter buyer ecgc ref "
                      />
                    </div> */}
 
             <div className="grid gap-2">
               <Label htmlFor="buyer_status">Status</Label>
               <Select
                 value={formData.buyer_status}
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
               "Update Buyer"
             )}
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
  )
}

export default EditBuyer