import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
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
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { ButtonConfig } from "@/config/ButtonConfig";
import {
  SchemeCreate,
  SchemeEdit,
} from "@/components/buttonIndex/ButtonComponents";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import useApiToken from "@/components/common/useApiToken";

const CreateScheme = ({ isEdit = false, schemeId = null }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const token = useApiToken();

  const [formData, setFormData] = useState({
    scheme_short: isEdit ? null : "",
    scheme_description: "",
    scheme_tax: "",
    scheme_status: isEdit ? "Active" : null,
  });

  const fetchSchemeData = async () => {
    if (!schemeId) return;
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-scheme-by-id/${schemeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const schemeData = response.data.scheme;
      setFormData({
        scheme_short: schemeData.scheme_short || "",
        scheme_description: schemeData.scheme_description || "",
        scheme_tax: schemeData.scheme_tax || "",
        scheme_status: schemeData.scheme_status || "",
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
    if (open && isEdit && schemeId) {
      fetchSchemeData();
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "scheme_tax") {
      if (!/^\d*$/.test(value)) return;
    }

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
    const requiredFields = isEdit
      ? {
          Description: "scheme_description",
          Tax: "scheme_tax",
          Status: "scheme_tax",
        }
      : {
          Short: "scheme_short",
          Description: "scheme_description",
          Tax: "scheme_tax",
        };
    const missingFields = Object.entries(requiredFields).filter(
      ([label, field]) => {
        const value = formData[field];

        // Check for empty string or undefined/null
        return (
          ((typeof value === "string" && value.trim() === "") ||
            value === undefined ||
            value === null) &&
          (!isEdit || field !== "scheme_short")
        );
      }
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
      const response = isEdit
        ? await axios.put(
            `${BASE_URL}/api/panel-update-scheme/${schemeId}`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        : await axios.post(`${BASE_URL}/api/panel-create-scheme`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });

      if (response?.data.code == 200) {
        toast({ title: "Success", description: response.data.msg });
        await queryClient.invalidateQueries(["schemes"]);

        if (!isEdit) {
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
        description: error.response?.data?.message || "Failed to submit scheme",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <SchemeEdit />
        ) : pathname === "/master/scheme" ? (
          <div>
            <SchemeCreate
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            />
          </div>
        ) : pathname === "/create-contract" ? (
          <p className="text-xs text-yellow-700 ml-2 mt-1 w-32 hover:text-red-800 cursor-pointer">
            Create Scheme
          </p>
        ) : null}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Update Scheme" : "Create New Scheme"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {!isEdit && (
            <div className="grid gap-2">
              <Label htmlFor="scheme_short">Scheme Short Name</Label>
              <Input
                id="scheme_short"
                name="scheme_short"
                value={formData.scheme_short}
                onChange={handleInputChange}
                placeholder="Enter Scheme short name"
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="scheme_description">Scheme Description</Label>
            <textarea
              id="scheme_description"
              name="scheme_description"
              value={formData.scheme_description}
              onChange={handleInputChange}
              placeholder="Enter Scheme Description"
              className="w-full p-1 border border-gray-300 rounded-sm"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="scheme_tax">Tax</Label>
            <Input
              id="scheme_tax"
              name="scheme_tax"
              value={formData.scheme_tax}
              onChange={handleInputChange}
              placeholder="Enter scheme tax details"
            />
          </div>
          {isEdit && (
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
          )}
        </div>

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
              "Update Scheme"
            ) : (
              "Create Scheme"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateScheme;
