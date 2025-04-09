import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ProgressBar } from "@/components/spinner/ProgressBar";

import { Loader2 } from "lucide-react";
import Page from "@/app/dashboard/page";
import { ButtonConfig } from "@/config/ButtonConfig";
import { Textarea } from "@/components/ui/textarea";
import {
  useFetchPortofLoadings,
  useFetchProduct,
  useFetchScheme,
  useFetchState,
} from "@/hooks/useApi";
import { z } from "zod";
import BASE_URL from "@/config/BaseUrl";

const branchFormSchema = z.object({
  vendor_alias: z.string().min(1, "Branch short name is required"),
  vendor_prefix: z.string().min(1, "Branch name is required"),
  vendor_name: z.string().min(1, "Branch short name is required"),
  vendor_address: z.string().min(1, "Branch address is required"),
  vendor_city: z.string().optional(),
  vendor_state: z.string().min(1, "IEC code is required"),
  vendor_pincode: z.string().optional(),
  vendor_contact_person: z.string().min(1, "GST number is required"),
  vendor_mobile1: z.string().min(1, "State is required"),
  vendor_mobile2: z.string().min(1, "State Code is required"),
  vendor_landline: z.string().min(1, "State Short is required"),
  vendor_fax: z.string().optional(),
  vendor_remarks: z.string().min(1, "PAN number is required"),
  vendor_bank: z.string().optional(),
  vendor_branch: z.string().optional(),
  vendor_account_name: z.string().optional(),
  vendor_account_no: z.string().optional(),
  vendor_ifscode: z.string().optional(),
  vendor_tin_no: z.string().optional(),
  vendor_gst_no: z.string().optional(),
  vendor_product: z.string().optional(),
});
// Header Component
const BranchHeader = ({ vendorDetails }) => {
  return (
    <div
      className={`flex sticky top-0 z-10 border border-gray-200 rounded-lg justify-between items-start gap-8 mb-2 ${ButtonConfig.cardheaderColor} p-4 shadow-sm`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800">
            {vendorDetails?.vendor?.vendor_name}
          </h1>
          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded">
            {vendorDetails?.vendor?.vendor_status || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-gray-600 mt-2">Update vendor/company details</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-end gap-2 text-sm">
          <span className="font-medium">
            Prefix : {vendorDetails?.vendor?.vendor_prefix || "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-end gap-2 text-sm">
          <span className="font-medium">
            Alias: {vendorDetails?.vendor?.vendor_alias || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

const updateBranch = async ({ id, data }) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(`${BASE_URL}/api/panel-update-vendor/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update vendor");
  return response.json();
};

const VendorEdit = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vendor_alias: "",
    vendor_prefix: "",
    vendor_name: "",
    vendor_address: "",
    vendor_city: "",
    vendor_state: "",
    vendor_pincode: "",
    vendor_contact_person: "",
    vendor_mobile1: "",
    vendor_mobile2: "",
    vendor_landline: "",
    vendor_fax: "",
    vendor_remarks: "",
    vendor_bank: "",
    vendor_branch: "",
    vendor_account_name: "",
    vendor_account_no: "",
    vendor_ifscode: "",
    vendor_tin_no: "",
    vendor_gst_no: "",
    vendor_product: "",
    vendor_status: "Active",
  });

  // Fetch branch data by ID
  const {
    data: vendorDetails,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["vendor", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/panel-fetch-vendor-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch branch");
      return response.json();
    },
  });

  const { data: stateData } = useFetchState();
  const { data: productData } = useFetchProduct();
  useEffect(() => {
    if (vendorDetails) {
      setFormData({
        vendor_name: vendorDetails?.vendor.vendor_name,
        vendor_prefix: vendorDetails?.vendor.vendor_prefix,
        vendor_alias: vendorDetails.vendor.vendor_alias,
        vendor_state: vendorDetails.vendor.vendor_state,

        vendor_address: vendorDetails.vendor.vendor_address,
        vendor_city: vendorDetails.vendor.vendor_city,
        vendor_pincode: vendorDetails.vendor.vendor_pincode,
        vendor_contact_person: vendorDetails.vendor.vendor_contact_person,
        vendor_mobile1: vendorDetails.vendor.vendor_mobile1,
        vendor_mobile2: vendorDetails.vendor.vendor_mobile2,
        vendor_landline: vendorDetails.vendor.vendor_landline,
        vendor_fax: vendorDetails.vendor.vendor_fax,
        vendor_remarks: vendorDetails.vendor.vendor_remarks,
        vendor_bank: vendorDetails.vendor.vendor_bank,
        vendor_branch: vendorDetails.vendor.vendor_branch,
        vendor_account_name: vendorDetails.vendor.vendor_account_name,
        vendor_account_no: vendorDetails.vendor.vendor_account_no,
        vendor_ifscode: vendorDetails.vendor.vendor_ifscode,
        vendor_tin_no: vendorDetails.vendor.vendor_tin_no,
        vendor_gst_no: vendorDetails.vendor.vendor_gst_no,
        vendor_product: vendorDetails.vendor.vendor_product,

        vendor_status: vendorDetails.vendor.vendor_status,
      });
    }
  }, [vendorDetails]);

  // Update branch mutation
  const updateBranchMutation = useMutation({
    mutationFn: updateBranch,
    onSuccess: (response) => {
      if (response.code == 200) {
        toast({
          title: "Success",
          description: response.msg,
        });
        navigate("/master/vendor");
      } else {
        toast({
          title: "Error",
          description: response.msg,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBranchMutation.mutate({ id, data: formData });
  };

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading vendor Data
          </Button>
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardContent>
            <div className="text-destructive text-center">
              Error Fetching vendor Data
            </div>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </Page>
    );
  }
  return (
    <Page>
      <form onSubmit={handleSubmit} className="w-full p-4">
        <BranchHeader vendorDetails={vendorDetails} />

        <Card className={`mb-6 ${ButtonConfig.cardColor}`}>
          <CardContent className="p-6">
            {/* Branch Details Section */}
            <div className="grid grid-cols-4 gap-6">
              <div className="col-span-1  row-span-2">
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Vendor Address <span className="text-red-500">*</span>
                </label>
                <Textarea
                  className="bg-white"
                  value={formData.vendor_address}
                  onChange={(e) => handleInputChange(e, "vendor_address")}
                  placeholder="Enter vendor address"
                  rows={5}
                />
              </div>
             

              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  City <span className="text-red-500">*</span>
                </label>
                <Input
                  className="bg-white"
                  value={formData.vendor_city}
                  onChange={(e) => handleInputChange(e, "vendor_city")}
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  State <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.vendor_state}
                  onValueChange={(value) =>
                    handleInputChange({ target: { value } }, "vendor_state")
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Enter state" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {stateData?.state?.map((item) => (
                      <SelectItem value={item.state_name} key={item.state_name}>
                        {item.state_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Pincode <span className="text-red-500">*</span>
                </label>
                <Input
                  className="bg-white"
                  value={formData.vendor_pincode}
                  onChange={(e) => handleInputChange(e, "vendor_pincode")}
                  placeholder="Enter pincode"
                />
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Gst No
                </label>
                <Input
                  className="bg-white"
                  value={formData.vendor_gst_no}
                  onChange={(e) => handleInputChange(e, "vendor_gst_no")}
                  placeholder="Enter gst no"
                />
              </div>

              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <Input
                  className="bg-white"
                  value={formData.vendor_contact_person}
                  onChange={(e) =>
                    handleInputChange(e, "vendor_contact_person")
                  }
                  placeholder="Enter contact person"
                />
              </div>

              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Mobile 1 <span className="text-red-500">*</span>
                </label>
                <Input
                  className="bg-white"
                  value={formData.vendor_mobile1}
                  onChange={(e) => handleInputChange(e, "vendor_mobile1")}
                  placeholder="Enter mobile 1"
                />
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Mobile 2 <span className="text-red-500">*</span>
                </label>
                <Input
                  className="bg-white"
                  value={formData.vendor_mobile2}
                  onChange={(e) => handleInputChange(e, "vendor_mobile2")}
                  placeholder="Enter mobile 2"
                />
              </div>

              {/* <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Landline
                </label>
                <Input
                  className="bg-white"
                  value={formData.vendor_landline}
                  onChange={(e) => handleInputChange(e, "vendor_landline")}
                  placeholder="Enter landline"
                />
              </div>

              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Fax
                </label>
                <Input
                  className="bg-white"
                  value={formData.vendor_fax}
                  onChange={(e) => handleInputChange(e, "vendor_fax")}
                  placeholder="Enter fax"
                />
              </div> */}

<div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Product
                </label>
                <Select
                  value={formData.vendor_product}
                  onValueChange={(value) =>
                    handleInputChange({ target: { value } }, "vendor_product")
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Enter product" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {productData?.product?.map((item) => (
                      <SelectItem
                        value={item.product_name}
                        key={item.product_name}
                      >
                        {item.product_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1 lg:col-span-2">
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Remark
                </label>
                <Input
                  className="bg-white"
                  value={formData.vendor_remarks}
                  onChange={(e) => handleInputChange(e, "vendor_remarks")}
                  placeholder="Enter remark"
                />
              </div>
              <div className=" col-span-4 lg:col-span-4">
                    <h1 className="border-b-2 border-white text-xl">Bank Details</h1>
                   </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Bank
                </label>
                <Input
                  className="bg-white"
                  value={formData.vendor_bank}
                  onChange={(e) => handleInputChange(e, "vendor_bank")}
                  placeholder="Enter bank"
                />
              </div>

              {/* <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Branch
                </label>
                <Input
                  className="bg-white"
                  value={formData.vendor_branch}
                  onChange={(e) => handleInputChange(e, "vendor_branch")}
                  placeholder="Enter branch"
                />
              </div> */}
 <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Account No
                </label>
                <Input
                  className="bg-white"
                  value={formData.vendor_account_no}
                  onChange={(e) => handleInputChange(e, "vendor_account_no")}
                  placeholder="Enter account no"
                />
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Account Name
                </label>
                <Input
                  className="bg-white"
                  value={formData.vendor_account_name}
                  onChange={(e) => handleInputChange(e, "vendor_account_name")}
                  placeholder="Enter account name"
                />
              </div>

             
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Ifs Code
                </label>
                <Input
                  className="bg-white"
                  value={formData.vendor_ifscode}
                  onChange={(e) => handleInputChange(e, "vendor_ifscode")}
                  placeholder="Enter ifscode"
                />
              </div>

              {/* <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Tin No
                </label>
                <Input
                  className="bg-white"
                  value={formData.vendor_tin_no}
                  onChange={(e) => handleInputChange(e, "vendor_tin_no")}
                  placeholder="Enter tin no"
                />
              </div>
         */}
             

              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Status <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.vendor_status}
                  onValueChange={(value) =>
                    handleInputChange({ target: { value } }, "vendor_status")
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex flex-col items-end">
          {updateBranchMutation.isPending && <ProgressBar progress={70} />}
          <Button
            type="submit"
            className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex items-center mt-2`}
            disabled={updateBranchMutation.isPending}
          >
            {updateBranchMutation.isPending ? "Updating..." : "Update Vendor"}
          </Button>
        </div>
      </form>
    </Page>
  );
};

export default VendorEdit;
