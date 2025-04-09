import Page from "@/app/dashboard/page";
import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "@/components/spinner/ProgressBar";
import { ButtonConfig } from "@/config/ButtonConfig";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchProduct, useFetchState } from "@/hooks/useApi";
import BASE_URL from "@/config/BaseUrl";


// Validation Schema
const branchFormSchema = z.object({
    vendor_alias: z.string().min(1, "Alias is required"),
    vendor_prefix: z.string().min(1, "Prefix is required"),
    vendor_name: z.string().min(1, "Name is required"),
    vendor_address: z.string().min(1, "Address is required"),
    vendor_city: z.string().min(1, "City is required"),
    vendor_state: z.string().min(1, "State is required"),
    vendor_pincode: z.string().min(1, "Pincode is required"),
    vendor_contact_person: z.string().min(1, "Contact person is required"),
    vendor_mobile1: z.string().min(1, "Mobile 1 is required"),
    vendor_mobile2: z.string().optional(),
    vendor_landline: z.string().optional(),
    vendor_fax: z.string().optional(),
    vendor_remarks: z.string().optional(),
    vendor_bank: z.string().optional(),
    vendor_branch: z.string().optional(),
    vendor_account_name: z.string().optional(),
    vendor_account_no: z.string().optional(),
    vendor_ifscode: z.string().optional(),
    vendor_tin_no: z.string().optional(),
    vendor_gst_no: z.string().optional(),
    vendor_product: z.string().optional(),
 
});

const BranchHeader = ({ progress }) => {
  return (
    <div
      className={`flex sticky top-0 z-10 border border-gray-200 rounded-lg justify-between items-start gap-8 mb-2 ${ButtonConfig.cardheaderColor} p-4 shadow-sm`}
    >
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-800">Create Vendor</h1>
        <p className="text-gray-600 mt-2">
          Add a new vendor to your organization
        </p>
      </div>

      <div className="flex-1 pt-2">
        <div className="sticky top-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Basic Details</span>
            <span className="text-sm font-medium">Additional Details</span>
          </div>

          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-yellow-500 h-full rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-medium text-yellow-600">
              {progress}% Complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const createBranch = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
  
    const response = await fetch(`${BASE_URL}/api/panel-create-vendor`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) throw new Error("Failed to create vendor");
    return response.json();
  };
  
const CreateVendor = () => {
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
       
      });
      const [progress, setProgress] = useState(0);
   
      const { data: stateData } = useFetchState();
      const { data: productData } = useFetchProduct();
      const createBranchMutation = useMutation({
        mutationFn: createBranch,
    
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
    
      useEffect(() => {
        const calculateProgress = () => {
          const totalFields = Object.keys(formData).length;
          const filledFields = Object.values(formData).filter(
            (value) => value.toString().trim() !== ""
          ).length;
          const percentage = Math.round((filledFields / totalFields) * 100);
          setProgress(percentage);
        };
    
        calculateProgress();
      }, [formData]);
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const validatedData = branchFormSchema.parse(formData);
          createBranchMutation.mutate(validatedData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map((err) => {
              const field = err.path.join(".");
              return ` ${err.message}`;
            });
    
            toast({
              title: "Validation Error",
              description: (
                <div>
                  <ul className="list-disc pl-5">
                    {errorMessages.map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                </div>
              ),
              variant: "destructive",
            });
            return;
          }
    
          toast({
            title: "Error",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
        }
      };
  return (
  <Page>
     <form onSubmit={handleSubmit} className="w-full p-4">
             <BranchHeader progress={progress} />
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
                       Vendor Name <span className="text-red-500">*</span>
                     </label>
                     <Input
                       className="bg-white"
                       value={formData.vendor_name}
                       onChange={(e) => handleInputChange(e, "vendor_name")}
                       placeholder="Enter vendor name"
                     />
                   </div>
                 
     
                   <div>
                     <label
                       className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                     >
                       Vendor Prefix <span className="text-red-500">*</span>
                     </label>
                     <Input
                       className="bg-white"
                       value={formData.vendor_prefix}
                       onChange={(e) => handleInputChange(e, "vendor_prefix")}
                       placeholder="Enter vendor prefix"
                     />
                   </div>


                   <div>
                     <label
                       className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                     >
                       Alias <span className="text-red-500">*</span>
                     </label>
                     <Input
                       className="bg-white"
                       value={formData.vendor_alias}
                       onChange={(e) => handleInputChange(e, "vendor_alias")}
                       placeholder="Enter vednor alias  "
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
                       onChange={(e) => handleInputChange(e, "vendor_contact_person")}
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

                   <div className="col-span-1 lg:col-span-3">
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
                   </div> */}
               
     







































                   
     
                 </div>
               </CardContent>
             </Card>
     
             {/* Submit Button */}
             <div className="flex flex-col items-end">
               {createBranchMutation.isPending && <ProgressBar progress={70} />}
               <Button
                 type="submit"
                 className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex items-center mt-2`}
                 disabled={createBranchMutation.isPending}
               >
                 {createBranchMutation.isPending ? "Submitting..." : "Create Vendor"}
               </Button>
             </div>
           </form>
  </Page>
  )
}

export default CreateVendor