import {
  BankCreate,
  BankEdit,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BASE_URL from "@/config/BaseUrl";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useToast } from "@/hooks/use-toast";
import { useFetchCompanys } from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const BankForm = ({ mode = "create", bankId = null }) => {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    branch_short: "",
    bank_name: "",
    bank_details: "",
    bank_acc_no: "",
    bank_branch: "",
    bank_status: isEditMode ? "Active" : null,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const { data: branchData } = useFetchCompanys();
  const token = useApiToken();
  const fetchBankData = async () => {
    if (!bankId) return;
    setIsFetching(true);
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/panel-fetch-bank-by-id/${bankId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const bank = data.bank;
      setFormData({
        branch_short: bank.branch_short || "",
        bank_name: bank.bank_name,
        bank_details: bank.bank_details,
        bank_acc_no: bank.bank_acc_no,
        bank_branch: bank.bank_branch,
        bank_status: bank.bank_status || "Active",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch bank data",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (open && isEditMode) {
      fetchBankData();
    }
  }, [open]);

  const handleInputChange = (e, key = null, val = null) => {
    if (e?.target) {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (key) {
      setFormData((prev) => ({ ...prev, [key]: val }));
    }
  };

  const handleSubmit = async () => {
    const requiredFields = isEditMode
      ? {
          "Bank Name": "bank_name",
          "Bank Details": "bank_details",
          "Bank Acc No": "bank_acc_no",
          "Bank Branch": "bank_branch",
          "Bank Status": "bank_status",
        }
      : {
          "Company Name": "branch_short",
          "Bank Name": "bank_name",
          "Bank Details": "bank_details",
          "Bank Acc No": "bank_acc_no",
          "Bank Branch": "bank_branch",
        };
    const missingFields = Object.entries(requiredFields).filter(
      ([label, field]) =>
        !formData[field]?.trim() && (!isEditMode || field !== "branch_short")
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
            `${BASE_URL}/api/panel-update-bank/${bankId}`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        : await axios.post(`${BASE_URL}/api/panel-create-bank`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });

      if (response?.data.code === 200) {
        toast({ title: "Success", description: response.data.msg });
        await queryClient.invalidateQueries(["banks"]);
        setFormData({
          branch_short: "",
          bank_name: "",
          bank_details: "",
          bank_acc_no: "",
          bank_branch: "",
          bank_status: "Active",
        });
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
        description: error.response?.data?.message || "Operation failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isEditMode ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <BankEdit
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                />
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Bank</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <DialogTrigger asChild>
          {pathname === "/master/bank" ? (
            <div>
              <BankCreate
                className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              />
            </div>
          ) : pathname === "/create-contract" ? (
            <p className="text-xs text-yellow-700 ml-2 mt-1 w-32 hover:text-red-800 cursor-pointer">
              Create Banks
            </p>
          ) : null}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Bank" : "Create New Bank"}
          </DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {!isEditMode && (
              <div>
                <Label htmlFor="branch_short">Company Name</Label>
                <Select
                  value={formData.branch_short}
                  onValueChange={(val) =>
                    handleInputChange(null, "branch_short", val)
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {branchData?.branch?.map((b, i) => (
                      <SelectItem key={i} value={b.branch_short}>
                        {b.branch_short}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bank_details">Bank Details</Label>
              <Input
                id="bank_details"
                name="bank_details"
                value={formData.bank_details}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bank_acc_no">Bank A/C No</Label>
              <Input
                id="bank_acc_no"
                name="bank_acc_no"
                value={formData.bank_acc_no}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bank_branch">Bank Company</Label>
              <Input
                id="bank_branch"
                name="bank_branch"
                value={formData.bank_branch}
                onChange={handleInputChange}
              />
            </div>

            {isEditMode && (
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={formData.bank_status}
                  onValueChange={(val) =>
                    handleInputChange(null, "bank_status", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Update Bank"
            ) : (
              "Create Bank"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BankForm;
