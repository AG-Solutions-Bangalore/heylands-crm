import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, SquarePlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { ButtonConfig } from "@/config/ButtonConfig";
import {
  CountryCreate,
  CountryEdit,
} from "@/components/buttonIndex/ButtonComponents";
import useApiToken from "@/components/common/useApiToken";
import { useLocation } from "react-router-dom";

const CountryForm = ({ countryId }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    country_name: "",
    country_port: "",
    country_dp: "",
    country_da: "",
    country_pol: "",
  });
  const { pathname } = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isEditMode = Boolean(countryId);
  const token = useApiToken();
  const fetchCountryData = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-country-by-id/${countryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const countryData = response.data.country;
      setFormData({
        country_name: countryData.country_name,
        country_port: countryData.country_port,
        country_dp: countryData.country_dp,
        country_da: countryData.country_da,
        country_pol: countryData.country_pol,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch country data",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (open && isEditMode) {
      fetchCountryData();
    }
  }, [open, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "country_dp" ||
      name === "country_pol" ||
      name === "country_da"
    ) {
      if (!/^\d*$/.test(value)) return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const requiredFields = {
      Name: "country_name",
      Port: "country_port",
      DP: "country_dp",
      DA: "country_da",
      POL: "country_pol",
    };
    const missingFields = Object.entries(requiredFields).filter(
      ([label, field]) => !String(formData[field] || "").trim()
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
      const response = isEditMode
        ? await axios.put(
            `${BASE_URL}/api/panel-update-country/${countryId}`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        : await axios.post(`${BASE_URL}/api/panel-create-country`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });

      if (response?.data.code == 200) {
        toast({ title: "Success", description: response.data.msg });
        await queryClient.invalidateQueries(["countries"]);

        if (!isEditMode) {
          setFormData({
            scheme_short: "",
            scheme_description: "",
            scheme_tax: "",
            scheme_status: "",
          });
        }
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
          error.response?.data?.message || "Failed to submit country",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              {isEditMode ? (
                <div>
                  <CountryEdit
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  />{" "}
                </div>
              ) : pathname === "/master/country" ? (
                <div>
                  <CountryCreate
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={` ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
                  />
                </div>
              ) : pathname === "/create-contract/new" ||
                pathname === "/create-invoice/new" ? (
                <p className="text-xs text-blue-600 hover:text-red-800 cursor-pointer">
                  <span className="flex items-center flex-row gap-1">
                    <SquarePlus className="w-4 h-4" /> <span>Add</span>
                  </span>
                </p>
              ) : null}
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isEditMode ? "Edit Country" : "Create Country"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Country" : "Create Country"}
          </DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {[
              "country_name",
              "country_port",
              "country_dp",
              "country_da",
              "country_pol",
            ].map((field) => (
              <div key={field} className="grid gap-2">
                <Label htmlFor={field}>
                  {field
                    .replace("country_", "")
                    .toUpperCase()
                    .replace("_", " ")}
                </Label>
                <Input
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  placeholder={`Enter ${field
                    .replace("country_", "")
                    .toUpperCase()}`}
                />
              </div>
            ))}
          </div>
          // <div className="grid gap-4 py-4">
          //   <div className="grid gap-2">
          //     <Label htmlFor="country_name">Country Name</Label>
          //     <Input
          //       id="country_name"
          //       name="country_name"
          //       value={formData.country_name}
          //       onChange={handleInputChange}
          //       placeholder="Enter Country Name"
          //     />
          //   </div>
          //   <div className="grid gap-2">
          //     <Label htmlFor="country_port">Country Port</Label>
          //     <Input
          //       id="country_port"
          //       name="country_port"
          //       value={formData.country_port}
          //       onChange={handleInputChange}
          //       placeholder="Enter Country Port"
          //     />
          //   </div>

          //   <div className="grid gap-2">
          //     <Label htmlFor="country_dp">DP</Label>
          //     <Input
          //       id="country_dp"
          //       name="country_dp"
          //       value={formData.country_dp}
          //       onChange={handleInputChange}
          //       placeholder="Enter DP Details "
          //     />
          //   </div>
          //   <div className="grid gap-2">
          //     <Label htmlFor="country_da">DA</Label>
          //     <Input
          //       id="country_da"
          //       name="country_da"
          //       value={formData.country_da}
          //       onChange={handleInputChange}
          //       placeholder="Enter DA Details "
          //     />
          //   </div>
          //   <div className="grid gap-2">
          //     <Label htmlFor="country_pol">POL</Label>
          //     <Input
          //       id="country_pol"
          //       name="country_pol"
          //       value={formData.country_pol}
          //       onChange={handleInputChange}
          //       placeholder="Enter POL Details "
          //     />
          //   </div>
          // </div>
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
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Update Country"
            ) : (
              "Create Country"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CountryForm;
