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
import { useFetchCountrys, useFetchPorts } from "@/hooks/useApi";
import { Textarea } from "@/components/ui/textarea";

const CreateBuyer = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    buyer_sort: "",
    buyer_group: "",
    buyer_name: "",
    buyer_address: "",
    buyer_port: "",
    buyer_country: "",
    buyer_ecgc_ref: "",
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

  const { data: portsData } = useFetchPorts();
  const { data: countryData } = useFetchCountrys();
  const handleSubmit = async () => {
    if (
      !formData.buyer_sort ||
      !formData.buyer_name ||
      !formData.buyer_address ||
      !formData.buyer_port ||
      !formData.buyer_country
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
        `${BASE_URL}/api/panel-create-buyer`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data.code == 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });

        setFormData({
          buyer_sort: "",
          buyer_group: "",
          buyer_name: "",
          buyer_address: "",
          buyer_port: "",
          buyer_country: "",
          buyer_ecgc_ref: "",
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
        description: error.response?.data?.message || "Failed to create  Buyer",
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

        {pathname === "/master/buyer" ? (
          <Button
            variant="default"
            className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          >
            <SquarePlus className="h-4 w-4" /> Buyer
          </Button>
        ) : pathname === "/create-contract" ||
          pathname === "/create-invoice" ||
          pathname === "/costing-create" ? (
          <p className="text-xs text-blue-600  hover:text-red-800 cursor-pointer">
            <span className="flex items-center flex-row gap-1">
              <SquarePlus className="w-4 h-4" /> <span>Add</span>
            </span>
          </p>
        ) : null}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Buyer</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="buyer_name"> Name</Label>
            <Input
              id="buyer_name"
              name="buyer_name"
              value={formData.buyer_name}
              onChange={handleInputChange}
              placeholder="Enter buyer name"
            />
          </div>
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
              "Create Buyer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBuyer;
