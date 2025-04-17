import {
  MarkingCreate,
  MarkingEdit,
} from "@/components/buttonIndex/ButtonComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BASE_URL from "@/config/BaseUrl";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle, Loader2, SquarePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useApiToken from "@/components/common/useApiToken";

const MarkingForm = ({ markingId }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isEditMode = Boolean(markingId);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const [originalData, setOriginalData] = useState(null);
  const token = useApiToken();
  const [formData, setFormData] = useState({
    marking: "",
    marking_status: isEditMode ? "Active" : null,
  });

  const fetchMarketData = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-marking-by-id/${markingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const markingData = response?.data?.marking;
      setFormData({
        marking: markingData.marking || "",
        marking_status: markingData.marking_status || "Active",
      });
      setOriginalData({
        marking: markingData.marking || "",
        marking_status: markingData.marking_status || "Active",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch marking data",
        variant: "destructive",
      });
      setOpen(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (open && isEditMode) {
      fetchMarketData();
    }
  }, [open, isEditMode]);
  const handleSubmit = async () => {
    const requiredFields = isEditMode
      ? {
          Status: "marking_status",
        }
      : {
          Name: "marking",
        };
    const missingFields = Object.entries(requiredFields).filter(
      ([label, field]) => !formData[field]?.trim()
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
            `${BASE_URL}/api/panel-update-marking/${markingId}`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        : await axios.post(`${BASE_URL}/api/panel-create-marking`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });

      if (response?.data.code == 200) {
        toast({ title: "Success", description: response.data.msg });
        await queryClient.invalidateQueries(["shippers"]);

        if (!isEditMode) {
          setFormData({
            marking: "",
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
          error.response?.data?.message || "Failed to submit marking",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const hasChanges =
    originalData &&
    (formData.marking !== originalData.marking ||
      formData.marking_status !== originalData.marking_status);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {isEditMode ? (
          <div>
            <MarkingEdit />
          </div>
        ) : pathname === "/master/marking" ? (
          <div>
            <MarkingCreate
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            ></MarkingCreate>
          </div>
        ) : pathname === "/create-contract/new" ||
          pathname === "/create-invoice/new" ? (
          <p className="text-xs text-blue-600 hover:text-red-800 cursor-pointer">
            <span className="flex items-center flex-row gap-1">
              <SquarePlus className="w-4 h-4" /> <span>Add</span>
            </span>
          </p>
        ) : null}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        {isFetching ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">
                {" "}
                {isEditMode ? "Edit Marking" : "Create New Marking"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? "Update marking details"
                  : "Enter the details for the new marking"}
              </p>
            </div>
            <div className="grid gap-2">
              {!isEditMode ? (
                <Input
                  id="marking"
                  placeholder="Enter marking... "
                  value={formData.marking}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      marking: e.target.value,
                    }))
                  }
                />
              ) : (
                <div className="grid gap-1">
                  <label
                    htmlFor="marking_status"
                    className="text-sm font-medium"
                  >
                    Status
                  </label>
                  <Select
                    value={formData.marking_status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        marking_status: value,
                      }))
                    }
                  >
                    <SelectTrigger
                      className={hasChanges ? "border-blue-200" : ""}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                          Active
                        </div>
                      </SelectItem>
                      <SelectItem value="Inactive">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                          Inactive
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                  "Update Marking"
                ) : (
                  "Create Marking"
                )}
                {hasChanges && !isLoading && (
                  <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
                )}
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default MarkingForm;
