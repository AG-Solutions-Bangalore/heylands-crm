import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ItemTop from "../../../components/json/ItemTop.json";
import barCode from "../../../components/json/barCode.json";

import Page from "@/app/dashboard/page";
import useApiToken from "@/components/common/useApiToken";
import { Textarea } from "@/components/ui/textarea";
import { ButtonConfig } from "@/config/ButtonConfig";
import {
  useFetchBox,
  useFetchCountry,
  useFetchItemCategory,
  useFetchPacking,
} from "@/hooks/useApi";
import { decryptId } from "@/utils/encyrption/Encyrption";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  ErrorComponent,
  LoaderComponent,
} from "@/components/LoaderComponent/LoaderComponent";
import { Loader2 } from "lucide-react";
import BASE_URL from "@/config/BaseUrl";
import axios from "axios";
import { ProgressBar } from "@/components/spinner/ProgressBar";

const CreateItemForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const decryptedId = id !== "new" ? decryptId(id) : null;
  const mode = searchParams.get("mode");
  const isEditMode = mode === "edit";
  const { toast } = useToast();
  const navigate = useNavigate();
  const token = useApiToken();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [formData, setFormData] = useState({
    item_code: isEditMode ? null : "",
    item_description: "",
    item_buyer: "",
    item_gsp: "",
    item_packing_id: "",
    item_country: "",
    item_rate_per_pc: "",
    item_box_id: "",
    item_board: "",
    item_barcode: "",
    item_gross_wt: "",
    item_category: "",
    item_top: "",
    item_hsnCode: "",
    item_note: "",
    item_status: isEditMode ? "Active" : null,
  });
  const { data: PackingData } = useFetchPacking();
  const { data: CountryData } = useFetchCountry();
  const { data: BoxData } = useFetchBox();
  const { data: ItemCategory } = useFetchItemCategory();
  const fetchItemData = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-item-by-id/${decryptedId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const itemData = response?.data?.item;
      setFormData({
        item_description: itemData.item_description || "",
        item_buyer: itemData.item_buyer || "",
        item_gsp: itemData.item_gsp || "",
        item_packing_id: itemData.item_packing_id || "",
        item_country: itemData.item_country || "",
        item_rate_per_pc: itemData.item_rate_per_pc || "",
        item_box_id: itemData.item_box_id || "",
        item_board: itemData.item_board || "",
        item_barcode: itemData.item_barcode || "",
        item_gross_wt: itemData.item_gross_wt || "",
        item_category: itemData.item_category || "",
        item_top: itemData.item_top || "",
        item_hsnCode: itemData.item_hsnCode || "",
        item_note: itemData.item_note || "",
        item_status: itemData.item_status || "Active",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch Pre Receipt data",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchItemData();
    }
  }, [isEditMode]);
  const loadingData =
    !PackingData || !CountryData || !BoxData || !ItemCategory || isFetching;

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    const digitDotOnly = /^\d*\.?\d*$/;
    if (
      (field === "item_rate_per_pc" || field === "item_gross_wt") &&
      !digitDotOnly.test(value)
    ) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectedBarcodes =
    typeof formData.item_board === "string"
      ? formData.item_board.split(",").filter(Boolean)
      : [];

  const handleBarcodeChange = (value) => {
    const updatedArray = selectedBarcodes.includes(value)
      ? selectedBarcodes.filter((v) => v !== value)
      : [...selectedBarcodes, value];

    const updatedString = updatedArray.filter(Boolean).join(",");

    handleInputChange({ target: { value: updatedString } }, "item_board");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = isEditMode
      ? {
          Description: "item_description",
          "Packing Id": "item_packing_id",
          "Rate Per Pc": "item_rate_per_pc",
          "Box Id": "item_box_id",
          "Gross Wt": "item_gross_wt",
          Category: "item_category",
          Top: "item_top",
          HSN: "item_hsnCode",
          Status: "item_status",
        }
      : {
          Item: "item_code",
          Description: "item_description",
          "Packing Id": "item_packing_id",
          "Rate Per Pc": "item_rate_per_pc",
          "Box Id": "item_box_id",
          "Gross Wt": "item_gross_wt",
          Category: "item_category",
          Top: "item_top",
          HSN: "item_hsnCode",
        };
    const missingFields = Object.entries(requiredFields).filter(
      ([label, field]) => !String(formData[field] ?? "").trim()
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
            `${BASE_URL}/api/panel-update-item/${decryptedId}`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        : await axios.post(`${BASE_URL}/api/panel-create-item`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
      console.log(response);
      if (response?.data.code == 200) {
        toast({ title: "Success", description: response.data.msg });
        // await queryClient.invalidateQueries(["items"]);
        if (!isEditMode) {
          setFormData({
            item_code: "",
            item_description: "",
            item_buyer: "",
            item_gsp: "",
            item_packing_id: "",
            item_country: "",
            item_rate_per_pc: "",
            item_box_id: "",
            item_board: [],
            item_barcode: "",
            item_gross_wt: "",
            item_category: "",
            item_top: "",
            item_hsnCode: "",
            item_note: "",
          });
        }
        navigate("/master/item");
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
        description: error.response?.data?.message || "Failed to submit item",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  if (loadingData) {
    return <LoaderComponent name="Item Data" />;
  }
  // if (isError) {
  //   return (
  //     <ErrorComponent message="Error Fetching Company Data" refetch={refetch} />
  //   );
  // }
  return (
    <Page>
      <form onSubmit={handleSubmit} className="w-full p-4">
        <Card className={`mb-6 ${ButtonConfig.cardColor}`}>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {!isEditMode && (
                <div>
                  <label
                    className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                  >
                    Item Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    className="bg-white"
                    value={formData.item_code}
                    onChange={(e) => handleInputChange(e, "item_code")}
                    placeholder="Enter Item Code details"
                  />
                </div>
              )}
              <div className="col-span-1 row-span-2">
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  className="bg-white"
                  rows={5}
                  value={formData.item_description}
                  onChange={(e) => handleInputChange(e, "item_description")}
                  placeholder="Enter  Description"
                />
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Buyer
                </label>
                <Input
                  className="bg-white"
                  value={formData.item_buyer}
                  onChange={(e) => handleInputChange(e, "item_buyer")}
                  placeholder="Enter Buyer"
                />
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  GSP
                </label>
                <Input
                  className="bg-white"
                  value={formData.item_gsp}
                  onChange={(e) => handleInputChange(e, "item_gsp")}
                  placeholder="Enter GSP"
                />
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Packing Id<span className="text-red-500">*</span>
                </label>

                <Select
                  key={formData.item_packing_id}
                  value={formData.item_packing_id}
                  onValueChange={(value) =>
                    handleInputChange({ target: { value } }, "item_packing_id")
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Enter Packing Id" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {PackingData?.itemPacking?.map((item) => (
                      <SelectItem value={item.id} key={item.id}>
                        {item.item_packing}-{item.item_packing_unit}-
                        {item.item_packing_no}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Country
                </label>

                <Select
                  key={formData.item_country}
                  value={formData.item_country}
                  onValueChange={(value) =>
                    handleInputChange({ target: { value } }, "item_country")
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Enter Country" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {CountryData?.country?.map((item) => (
                      <SelectItem
                        value={item.country_name}
                        key={item.country_name}
                      >
                        {item.country_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Rate Per PC<span className="text-red-500">*</span>
                </label>
                <Input
                  className="bg-white"
                  value={formData.item_rate_per_pc}
                  onChange={(e) => handleInputChange(e, "item_rate_per_pc")}
                  placeholder="Enter Rate Per PC"
                />
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Box Id<span className="text-red-500">*</span>
                </label>

                <Select
                  key={formData.item_box_id}
                  value={formData.item_box_id}
                  onValueChange={(value) =>
                    handleInputChange({ target: { value } }, "item_box_id")
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Enter  Box Id" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {BoxData?.itemBox?.map((item) => (
                      <SelectItem value={item.id} key={item.id}>
                        {item.item_box_size}-{item.item_box_weight}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Barcode
                </label>
                <Input
                  className="bg-white"
                  value={formData.item_barcode}
                  onChange={(e) => handleInputChange(e, "item_barcode")}
                  placeholder="Enter Barcode"
                />
              </div>{" "}
              <div>
                <label
                  className={`block ${ButtonConfig.cardLabel} text-sm mb-2 font-medium`}
                >
                  Board
                </label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white"
                    >
                      {selectedBarcodes.length > 0
                        ? selectedBarcodes.join(", ")
                        : "Select Board"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="bg-white"
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    style={{ width: "var(--radix-popover-trigger-width)" }}
                  >
                    <div className="flex flex-col gap-2">
                      {barCode?.map((item) => (
                        <label
                          key={item.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedBarcodes.includes(item.value)}
                            onCheckedChange={() =>
                              handleBarcodeChange(item.value)
                            }
                          />
                          <span className="text-sm">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Gross Wt<span className="text-red-500">*</span>
                </label>
                <Input
                  className="bg-white"
                  value={formData.item_gross_wt}
                  onChange={(e) => handleInputChange(e, "item_gross_wt")}
                  placeholder="Enter Gross Wt"
                />
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Category<span className="text-red-500">*</span>
                </label>

                <Select
                  key={formData.item_category}
                  value={formData.item_category}
                  onValueChange={(value) =>
                    handleInputChange({ target: { value } }, "item_category")
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Enter  Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {ItemCategory?.itemCategory?.map((item) => (
                      <SelectItem
                        value={item.item_category}
                        key={item.item_category}
                      >
                        {item.item_category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Top<span className="text-red-500">*</span>
                </label>

                <Select
                  key={formData.item_top}
                  value={formData.item_top}
                  onValueChange={(value) =>
                    handleInputChange({ target: { value } }, "item_top")
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Enter Top" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {ItemTop?.map((item) => (
                      <SelectItem value={item.value} key={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  HSN Code<span className="text-red-500">*</span>
                </label>
                <Input
                  className="bg-white"
                  value={formData.item_hsnCode}
                  onChange={(e) => handleInputChange(e, "item_hsnCode")}
                  placeholder="Enter HSN Code"
                />
              </div>
              <div>
                <label
                  className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                >
                  Item Note
                </label>

                <Textarea
                  className="bg-white"
                  rows={2}
                  value={formData.item_note}
                  onChange={(e) => handleInputChange(e, "item_note")}
                  placeholder="Enter Item Note"
                />
              </div>
              {isEditMode && (
                <div>
                  <label
                    className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                  >
                    Status <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.item_status}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "item_status")
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
              )}
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col items-end">
          {isLoading && <ProgressBar progress={70} />}
          <Button
            // onClick={handleSubmit}
            type="submit"
            disabled={isLoading || isFetching}
            className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} `}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Update Item"
            ) : (
              "Create Item"
            )}
          </Button>
        </div>
      </form>
    </Page>
  );
};

export default CreateItemForm;
