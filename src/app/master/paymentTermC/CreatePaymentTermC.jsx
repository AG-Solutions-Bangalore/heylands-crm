import {
  BankCreate,
  BankEdit,
  PaymentTermsCCreate,
  PaymentTermsCEdit,
} from "@/components/buttonIndex/ButtonComponents";
import useApiToken from "@/components/common/useApiToken";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { AlertCircle, Loader2, SquarePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentTermForm = ({ paymentId = null }) => {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isEditMode = Boolean(paymentId);
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    paymentTerms_short: isEditMode ? null : "",
    paymentTerms: "",
    paymentTerms_dp: "",
    paymentTerms_da: "",
    paymentTerms_lc: "",
    paymentTerms_advance: "",
    paymentTerms_status: isEditMode ? "Active" : null,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const token = useApiToken();
  const fetchBankData = async () => {
    if (!paymentId) return;
    setIsFetching(true);
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/panel-fetch-payment-terms-by-id/${paymentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const paymentTerms = data.paymentTerms;
      setFormData({
        paymentTerms: paymentTerms.paymentTerms || "",
        paymentTerms_dp: paymentTerms.paymentTerms_dp || "",
        paymentTerms_da: paymentTerms.paymentTerms_da || "",
        paymentTerms_lc: paymentTerms.paymentTerms_lc || "",
        paymentTerms_advance: paymentTerms.paymentTerms_advance || "",
        paymentTerms_status: paymentTerms.paymentTerms_status || "Active",
      });
      setOriginalData({
        paymentTerms: paymentTerms.paymentTerms || "",
        paymentTerms_dp: paymentTerms.paymentTerms_dp || "",
        paymentTerms_da: paymentTerms.paymentTerms_da || "",
        paymentTerms_lc: paymentTerms.paymentTerms_lc || "",
        paymentTerms_advance: paymentTerms.paymentTerms_advance || "",
        paymentTerms_status: paymentTerms.paymentTerms_status || "Active",
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
  }, [open, isEditMode]);
  const handleInputChange = (e, key = null, val = null) => {
    const decimalAllowedFields = [
      "paymentTerms_dp",
      "paymentTerms_da",
      "paymentTerms_lc",
      "paymentTerms_advance",
      "short",
    ];

    const isValidDecimal = (input) => /^(\d+)?(\.\d*)?$/.test(input);

    if (e?.target) {
      const { name, value } = e.target;

      if (decimalAllowedFields.includes(name) && !isValidDecimal(value)) return;

      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (key) {
      if (decimalAllowedFields.includes(key) && !isValidDecimal(val)) return;

      setFormData((prev) => ({ ...prev, [key]: val }));
    }
  };

  const handleSubmit = async () => {
    const requiredFields = isEditMode
      ? {
          Term: "paymentTerms",
          DP: "paymentTerms_dp",
          DA: "paymentTerms_da",
          LC: "paymentTerms_lc",
          Advanace: "paymentTerms_advance",
          Status: "paymentTerms_status",
        }
      : {
          Short: "paymentTerms_short",
          Term: "paymentTerms",
          DP: "paymentTerms_dp",
          DA: "paymentTerms_da",
          LC: "paymentTerms_lc",
          Advanace: "paymentTerms_advance",
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
            `${BASE_URL}/api/panel-update-payment-terms/${paymentId}`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        : await axios.post(
            `${BASE_URL}/api/panel-create-payment-terms`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

      if (response?.data.code === 200) {
        toast({ title: "Success", description: response.data.msg });
        await queryClient.invalidateQueries(["paymentterm"]);
        setOpen(false);
        if (
          !isEditMode &&
          setFormData({
            paymentTerms_short: "",
            paymentTerms: "",
            paymentTerms_dp: "",
            paymentTerms_da: "",
            paymentTerms_lc: "",
            paymentTerms_advance: "",
          })
        );
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
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const hasChanges =
    isEditMode &&
    originalData &&
    (formData.paymentTerms !== originalData.paymentTerms ||
      formData.paymentTerms_dp !== originalData.paymentTerms_dp ||
      formData.paymentTerms_da !== originalData.paymentTerms_da ||
      formData.paymentTerms_lc !== originalData.paymentTerms_lc ||
      formData.paymentTerms_advance !== originalData.paymentTerms_advance ||
      formData.paymentTerms_status !== originalData.paymentTerms_status);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isEditMode ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <PaymentTermsCEdit
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                />
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Payment</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <DialogTrigger asChild>
          {pathname === "/master/paymentTermC" ? (
            <div>
              <PaymentTermsCCreate
                className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} `}
              ></PaymentTermsCCreate>
            </div>
          ) : pathname === "/create-contract/new" ||
            pathname === "/create-invoice/new" ? (
            <p className="text-xs text-blue-600  hover:text-red-800 cursor-pointer">
              <span className="flex items-center flex-row gap-1">
                <SquarePlus className="w-4 h-4" /> <span>Add</span>
              </span>
            </p>
          ) : null}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Payment" : "Create New Payment"}
          </DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {!isEditMode && (
              <div className="grid gap-2">
                <Label htmlFor="paymentTerms_short">Short</Label>
                <Input
                  id="paymentTerms_short"
                  name="paymentTerms_short"
                  value={formData.paymentTerms_short}
                  onChange={handleInputChange}
                  placeholder="Enter Short"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="paymentTerms">Terms</Label>
              <textarea
                id="paymentTerms"
                placeholder="Enter payment term c"
                className="w-full p-1 border border-gray-300 rounded-sm "
                value={formData.paymentTerms}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentTerms: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="paymentTerms_dp">DP</Label>
                <Input
                  id="paymentTerms_dp"
                  name="paymentTerms_dp"
                  value={formData.paymentTerms_dp}
                  onChange={handleInputChange}
                  placeholder="Enter DP"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="paymentTerms_da">DA</Label>
                <Input
                  id="paymentTerms_da"
                  name="paymentTerms_da"
                  value={formData.paymentTerms_da}
                  onChange={handleInputChange}
                  placeholder="Enter DA"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentTerms_lc">LC</Label>
                <Input
                  id="paymentTerms_lc"
                  name="paymentTerms_lc"
                  value={formData.paymentTerms_lc}
                  onChange={handleInputChange}
                  placeholder="Enter LC"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentTerms_advance">Advance</Label>
                <Input
                  id="paymentTerms_advance"
                  name="paymentTerms_advance"
                  value={formData.paymentTerms_advance}
                  onChange={handleInputChange}
                  placeholder="Enter Advance"
                />
              </div>
            </div>

            {isEditMode && (
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={formData.paymentTerms_status}
                  onValueChange={(val) =>
                    handleInputChange(null, "paymentTerms_status", val)
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
        {hasChanges && (
          <Alert className="bg-blue-50 border-blue-200 mt-2">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-600 text-sm">
              You have unsaved changes
            </AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || (isEditMode && !hasChanges)}
            className={`mt-2 ${ButtonConfig.backgroundColor} ${
              ButtonConfig.hoverBackgroundColor
            } ${ButtonConfig.textColor} ${
              hasChanges ? "relative overflow-hidden" : ""
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Update Payment"
            ) : (
              "Create Payment"
            )}
            {hasChanges && !isLoading && (
              <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentTermForm;
