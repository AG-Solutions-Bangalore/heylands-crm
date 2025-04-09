// BuyerForm.jsx
import {
  BuyerCreate,
  BuyerEdit,
} from "@/components/buttonIndex/ButtonComponents";
import useApiToken from "@/components/common/useApiToken";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BASE_URL from "@/config/BaseUrl";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useToast } from "@/hooks/use-toast";
import { useFetchCountrys, useFetchPorts } from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const BuyerForm = ({ mode = "create", buyerId = null }) => {
  const [open, setOpen] = useState(false);
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    buyer_sort: "",
    buyer_group: "",
    buyer_name: "",
    buyer_address: "",
    buyer_port: "",
    buyer_country: "",
    buyer_ecgc_ref: "",
    buyer_status: isEdit ? "Active" : null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token = useApiToken();
  const { data: portsData } = useFetchPorts();
  const { data: countryData } = useFetchCountrys();
  const { pathname } = useLocation();

  const fetchBuyerData = async () => {
    if (!buyerId) return;
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-buyer-by-id/${buyerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const buyer = response.data.buyer;
      setFormData({
        buyer_sort: buyer.buyer_sort,
        buyer_group: buyer.buyer_group,
        buyer_address: buyer.buyer_address,
        buyer_port: buyer.buyer_port,
        buyer_name: buyer.buyer_name,
        buyer_country: buyer.buyer_country,
        buyer_ecgc_ref: buyer.buyer_ecgc_ref,
        buyer_status: buyer.buyer_status,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch buyer",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isEdit && open) fetchBuyerData();
  }, [open]);

  const handleInputChange = (e, key, value) => {
    if (e?.target) {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, buyer_status: value }));
  };
  const requiredFields = isEdit
    ? {
        "Buyer Short": "buyer_sort",
        "Buyer Company": "buyer_group",
        Address: "buyer_address",
        Port: "buyer_port",
        Country: "buyer_country",
        Ref: "buyer_ecgc_ref",
        Status: "buyer_status",
      }
    : {
        "Buyer Short": "buyer_sort",
        "Buyer Company": "buyer_group",
        Name: "buyer_name",
        Address: "buyer_address",
        Port: "buyer_port",
        Country: "buyer_country",
        Ref: "buyer_ecgc_ref",
      };
  const handleSubmit = async () => {
    const missingFields = Object.entries(requiredFields).filter(
      ([label, field]) =>
        !formData[field]?.trim() && (!isEdit || field !== "buyer_status")
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
      const url = isEdit
        ? `${BASE_URL}/api/panel-update-buyer/${buyerId}`
        : `${BASE_URL}/api/panel-create-buyer`;

      const method = isEdit ? axios.put : axios.post;

      const response = await method(url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { code, msg } = response.data;

      if (code === 200) {
        toast({ title: "Success", description: msg });
        await queryClient.invalidateQueries(["buyers"]);
        setOpen(false);
        if (!isEdit) {
          setFormData({
            buyer_sort: "",
            buyer_group: "",
            buyer_name: "",
            buyer_address: "",
            buyer_port: "",
            buyer_country: "",
            buyer_ecgc_ref: "",
            buyer_status: "Active",
          });
        }
      } else {
        toast({ title: "Error", description: msg, variant: "destructive" });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to submit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isEdit ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <BuyerEdit
                  className={`h-4 w-4 ${
                    isHovered ? "text-blue-500" : ""
                  } transition-all`}
                />
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isEdit ? "Edit Buyer" : "Create Buyer"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <DialogTrigger asChild>
          {pathname === "/master/buyer" ? (
            <div>
              <BuyerCreate
                className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              />
            </div>
          ) : pathname === "/create-contract" ? (
            <p className="text-xs text-yellow-700 ml-2 mt-1 w-32 hover:text-red-800 cursor-pointer">
              Create Buyer
            </p>
          ) : null}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Buyer" : "Create Buyer"}{" "}
            {isEdit && formData.buyer_name && (
              <span className="text-blue-500 text-xl">
                - {formData.buyer_name}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="flex gap-2">
              <div className="grid gap-2 w-full">
                <Label htmlFor="buyer_sort">Short Name</Label>
                <Input
                  name="buyer_sort"
                  value={formData.buyer_sort}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2 w-full">
                <Label htmlFor="buyer_group">Group</Label>
                <Input
                  name="buyer_group"
                  value={formData.buyer_group}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="buyer_address">Address</Label>
              <Textarea
                name="buyer_address"
                rows={3}
                value={formData.buyer_address}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex gap-2">
              <div className="w-full">
                <Label>Port</Label>
                <Select
                  value={formData.buyer_port}
                  onValueChange={(val) =>
                    handleInputChange(null, "buyer_port", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Port" />
                  </SelectTrigger>
                  <SelectContent>
                    {portsData?.country?.map((port, idx) => (
                      <SelectItem key={idx} value={port.country_port}>
                        {port.country_port}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <Label>Country</Label>
                <Select
                  value={formData.buyer_country}
                  onValueChange={(val) =>
                    handleInputChange(null, "buyer_country", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryData?.country?.map((c, idx) => (
                      <SelectItem key={idx} value={c.country_name}>
                        {c.country_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              {!isEdit && (
                <div className="grid gap-2 w-full">
                  <Label htmlFor="buyer_name"> Buyer Name</Label>
                  <Input
                    name="buyer_name"
                    value={formData.buyer_name}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              <div className="grid gap-2 w-full">
                <Label htmlFor="buyer_ecgc_ref">ECGC Ref</Label>
                <Input
                  name="buyer_ecgc_ref"
                  value={formData.buyer_ecgc_ref}
                  onChange={handleInputChange}
                />
              </div>
              {isEdit && (
                <div className="grid gap-2 w-full">
                  <Label>Status</Label>
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
              )}
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
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : isEdit ? (
              "Update Buyer"
            ) : (
              "Create Buyer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyerForm;
