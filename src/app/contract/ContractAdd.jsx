import useApiToken from "@/components/common/useApiToken";
import { LoaderComponent } from "@/components/LoaderComponent/LoaderComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import BASE_URL from "@/config/BaseUrl";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useToast } from "@/hooks/use-toast";

import MemoizedProductSelect from "@/components/common/MemoizedProductSelect";
import MemoizedSelect from "@/components/common/MemoizedSelect";
import { ProgressBar } from "@/components/spinner/ProgressBar";
import {
  useFetchBagsTypes,
  useFetchBuyers,
  useFetchCompanys,
  useFetchContainerSizes,
  useFetchContractNos,
  useFetchCountrys,
  useFetchItemData,
  useFetchMarkings,
  useFetchOrderType,
  useFetchPaymentTerms,
  useFetchPortofLoadings,
  useFetchPorts,
  useFetchProduct,
  useFetchSiginData,
} from "@/hooks/useApi";
import { useCurrentYear } from "@/hooks/useCurrentYear";
import { getTodayDate } from "@/utils/currentDate";
import { decryptId } from "@/utils/encyrption/Encyrption";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { gsap } from "gsap";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Globe,
  Loader2,
  MinusCircle,
  Package,
  PlusCircle,
  SquarePlus,
  TestTubes,
  Trash2,
  Truck,
} from "lucide-react";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Currency from "../../components/json/contractCurrency.json";
import Insurance from "../../components/json/contractInsurance.json";
import Status from "../../components/json/contractstatus.json";
import Page from "../dashboard/page";
import BuyerForm from "../master/buyer/CreateBuyer";
import DeleteContract from "./DeleteContract";
import CreateOrderTypeForm from "../master/orderType/CreateOrderTypeForm";
import ContainerSizeForm from "../master/ContainerSize/CreateContainerSize";
import CreateProductForm from "../master/product/CreateProduct";
import PortofLoadingForm from "../master/portofLoading/CreatePortofLoading";
import CountryForm from "../master/country/CreateCountry";
import PaymentTermForm from "../master/paymentTermC/CreatePaymentTermC";
import MarkingForm from "../master/marking/CreateMarking";
import CreateItemPackingForm from "../master/itemPacking/CreateItemPackingForm";

const ContractAdd = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const token = useApiToken();
  const { data: currentYear } = useCurrentYear();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const decryptedId = id !== "new" ? decryptId(id) : null;
  const mode = searchParams.get("mode");
  const isEditMode = mode === "edit";
  const [isFetching, setIsFetching] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const disabled = true;
  const [formData, setFormData] = useState({
    branch_short: "",
    branch_name: "",
    branch_address: "",
    contract_no: "",
    contract_year: currentYear,
    contract_date: getTodayDate(),
    contract_order_type: "",
    contract_ref: "",
    contract_pono: "",
    contract_buyer: "",
    contract_buyer_add: "",
    contract_consignee: "",
    contract_consignee_add: "",
    contract_container_size: "",
    contract_product: "",
    contract_loading_port: "",
    contract_loading_country: "",
    contract_destination_port: "",
    contract_destination_country: "",
    contract_payment_terms: "",
    contract_delivery_terms: "",
    contract_qty_inmt: "",
    contract_validity: "",
    contract_marking: "",
    contract_insurance: "",
    contract_pack_type: "",
    contract_packing: "0",
    contract_currency: "",
    contract_sign: "",
    contract_position: "",
    contract_currency_rate: "0",
    contract_status: isEditMode ? "" : null,
  });
  const [contractData, setContractData] = useState([
    {
      id: isEditMode ? "" : null,
      contractSub_item_code: "",
      contractSub_item_description: "",
      contractSub_item_packing: "",
      contractSub_item_packing_unit: "",
      contractSub_item_packing_no: "",
      contractSub_item_rate_per_pc: "",
      contractSub_item_box_size: "",
      contractSub_item_box_wt: "",
      contractSub_item_gross_wt: "",
      contractSub_item_barcode: "",
      contractSub_item_hsnCode: "",
      contractSub_ctns: "",
    },
  ]);
  const { data: buyerData } = useFetchBuyers();
  const { data: branchData } = useFetchCompanys();
  const { data: contractNoData } = useFetchContractNos(formData.branch_short);
  const { data: portofLoadingData } = useFetchPortofLoadings();
  const { data: containerSizeData } = useFetchContainerSizes();
  const { data: OrderTypeData } = useFetchOrderType();
  const { data: paymentTermsData } = useFetchPaymentTerms();
  const { data: bagTypeData } = useFetchBagsTypes();
  const { data: countryData } = useFetchCountrys();
  const { data: portsData } = useFetchPorts();
  const { data: productData } = useFetchProduct();
  const { data: itemData } = useFetchItemData();
  const { data: markingData } = useFetchMarkings();
  const { data: siginData } = useFetchSiginData();
  useEffect(() => {
    if (currentYear) {
      setFormData((prev) => ({
        ...prev,
        contract_year: currentYear,
      }));
    }
  }, [currentYear]);
  const fetchContractData = async () => {
    try {
      setIsFetching(true);

      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-contract-by-id/${decryptedId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const itemData = response?.data?.contract;
      const subItems = response?.data?.contractSub || [];

      if (itemData) {
        setFormData({
          branch_short: itemData.branch_short || "",
          branch_name: itemData.branch_name || "",
          branch_address: itemData.branch_address || "",
          contract_year: itemData.contract_year || currentYear,
          contract_no: itemData.contract_no || "",
          contract_date: itemData.contract_date || getTodayDate(),
          contract_order_type: itemData.contract_order_type || "",
          contract_ref: itemData.contract_ref || "",
          contract_pono: itemData.contract_pono || "",
          contract_buyer: itemData.contract_buyer || "",
          contract_buyer_add: itemData.contract_buyer_add || "",
          contract_consignee: itemData.contract_consignee || "",
          contract_consignee_add: itemData.contract_consignee_add || "",
          contract_container_size: itemData.contract_container_size || "",
          contract_product: itemData.contract_product || "",
          contract_loading_port: itemData.contract_loading_port || "",
          contract_loading_country: itemData.contract_loading_country || "",
          contract_destination_port: itemData.contract_destination_port || "",
          contract_destination_country:
            itemData.contract_destination_country || "",
          contract_payment_terms: itemData.contract_payment_terms || "",
          contract_delivery_terms: itemData.contract_delivery_terms || "",
          contract_qty_inmt: itemData.contract_qty_inmt || "",
          contract_validity: itemData.contract_validity || "",
          contract_marking: itemData.contract_marking || "",
          contract_insurance: itemData.contract_insurance || "",
          contract_pack_type: itemData.contract_pack_type || "",
          contract_packing: itemData.contract_packing || "",
          contract_currency: itemData.contract_currency || "",
          contract_sign: itemData.contract_sign || "",
          contract_position: itemData.contract_position || "",
          contract_currency_rate: itemData.contract_currency_rate || "",
          contract_status: itemData.contract_status || "",
        });
      }

      if (subItems.length > 0) {
        const mappedSubItems = subItems.map((item) => ({
          id: item.id || "",
          contractSub_item_code: item.contractSub_item_code || "",
          contractSub_item_description: item.contractSub_item_description || "",
          contractSub_item_packing: item.contractSub_item_packing || "",
          contractSub_item_packing_unit:
            item.contractSub_item_packing_unit || "",
          contractSub_item_packing_no: item.contractSub_item_packing_no || "",
          contractSub_item_rate_per_pc: item.contractSub_item_rate_per_pc || "",
          contractSub_item_box_size: item.contractSub_item_box_size || "",
          contractSub_item_box_wt: item.contractSub_item_box_wt || "",
          contractSub_item_gross_wt: item.contractSub_item_gross_wt || "",
          contractSub_item_barcode: item.contractSub_item_barcode || "",
          contractSub_item_hsnCode: item.contractSub_item_hsnCode || "",
          contractSub_ctns: item.contractSub_ctns || "",
        }));

        setContractData(mappedSubItems);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contract data",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchContractData();
    }
  }, [isEditMode]);
  const handleInputChange = useCallback((field, value) => {
    const numericFields = [
      "contract_qty_inmt",
      "contract_packing",
      "contract_currency_rate",
    ];

    if (numericFields.includes(field)) {
      const sanitizedValue = value.replace(/[^\d.]/g, "");
      const decimalCount = (sanitizedValue.match(/\./g) || []).length;

      // Prevent multiple dots
      if (decimalCount > 1) return;

      setFormData((prev) => ({
        ...prev,
        [field]: sanitizedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  }, []);

  const handleSelectChange = useCallback(
    (field, value) => {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };

        // --- Update on contract_buyer ---
        if (field === "contract_buyer") {
          const selectedBuyer = buyerData?.buyer?.find(
            (buyer) => buyer.buyer_name === value
          );
          if (selectedBuyer) {
            updated.contract_buyer_add = selectedBuyer.buyer_address;
            updated.contract_consignee = selectedBuyer.buyer_name;
            updated.contract_consignee_add = selectedBuyer.buyer_address;
            updated.contract_destination_port = selectedBuyer.buyer_port;
            updated.contract_destination_country = selectedBuyer.buyer_country;

            const selectedCompanySort = branchData?.branch?.find(
              (branch) => branch.branch_short === updated.branch_short
            );
            if (
              selectedCompanySort &&
              updated.contract_no &&
              updated.contract_year
            ) {
              updated.contract_ref = `${selectedCompanySort.branch_name_short}/${selectedBuyer.buyer_sort}/${updated.contract_no}/${updated.contract_year}`;
              updated.contract_pono = `${selectedCompanySort.branch_name_short}/${selectedBuyer.buyer_sort}/${updated.contract_no}/${updated.contract_year}`;
            }
          }
        }

        if (field === "branch_short") {
          const selectedBranch = branchData?.branch?.find(
            (branch) => branch.branch_short === value
          );
          if (selectedBranch) {
            updated.branch_name = selectedBranch.branch_name;
            updated.branch_address = selectedBranch.branch_address;
            updated.contract_loading_port =
              selectedBranch.branch_port_of_loading;

            const selectedPort = portofLoadingData?.portofLoading?.find(
              (portofLoading) =>
                portofLoading.portofLoading === updated.contract_loading_port
            );
            const selectedBuyer = buyerData?.buyer?.find(
              (buyer) => buyer.buyer_name === updated.contract_buyer
            );
            if (selectedBuyer && updated.contract_no && updated.contract_year) {
              updated.contract_ref = `${selectedBranch.branch_name_short}/${selectedBuyer.buyer_sort}/${updated.contract_no}/${updated.contract_year}`;
              updated.contract_pono = `${selectedBranch.branch_name_short}/${selectedBuyer.buyer_sort}/${updated.contract_no}/${updated.contract_year}`;
            }
            if (selectedPort) {
              updated.contract_loading_country =
                selectedPort.portofLoadingCountry;
            }
          }
        }

        if (field === "contract_loading_port") {
          const selectedPort = portofLoadingData?.portofLoading?.find(
            (portofLoading) =>
              portofLoading.portofLoading === updated.contract_loading_port
          );
          if (selectedPort) {
            updated.contract_loading_country =
              selectedPort.portofLoadingCountry;
          }
        }

        if (field === "contract_no") {
          const selectedBuyer = buyerData?.buyer?.find(
            (buyer) => buyer.buyer_name === updated.contract_buyer
          );
          const selectedBranch = branchData?.branch?.find(
            (branch) => branch.branch_short === updated.branch_short
          );
          if (selectedBuyer && selectedBranch && updated.contract_year) {
            updated.contract_ref = `${selectedBranch.branch_name_short}/${selectedBuyer.buyer_sort}/${value}/${updated.contract_year}`;
            updated.contract_pono = `${selectedBranch.branch_name_short}/${selectedBuyer.buyer_sort}/${value}/${updated.contract_year}`;
          }
        }

        if (field === "contract_year") {
          const selectedBuyer = buyerData?.buyer?.find(
            (buyer) => buyer.buyer_name === updated.contract_buyer
          );
          const selectedBranch = branchData?.branch?.find(
            (branch) => branch.branch_short === updated.branch_short
          );
          if (selectedBuyer && selectedBranch && updated.contract_no) {
            updated.contract_ref = `${selectedBranch.branch_name_short}/${selectedBuyer.buyer_sort}/${updated.contract_no}/${value}`;
            updated.contract_pono = `${selectedBranch.branch_name_short}/${selectedBuyer.buyer_sort}/${updated.contract_no}/${value}`;
          }
        }

        if (field === "contract_sign") {
          const selectedSigner = siginData?.branch?.find(
            (sigin) => sigin.branch_sign === value
          );
          if (selectedSigner) {
            updated.contract_position = selectedSigner.branch_sign_position;
          }
        }

        return updated;
      });
    },
    [buyerData, branchData, siginData]
  );

  const handleRowDataChange = useCallback(
    (rowIndex, field, value) => {
      const digitOnlyFields = [
        "contractSub_ctns",
        "contractSub_item_packing",
        "contractSub_item_packing_no",
        "contractSub_item_rate_per_pc",
        "contractSub_item_box_size",
      ];

      if (field === "contractSub_item_code") {
        const selectedItem = itemData?.item?.find(
          (item) => item.item_code === value
        );

        if (selectedItem) {
          setContractData((prev) => {
            const newData = [...prev];
            newData[rowIndex] = {
              ...newData[rowIndex],
              contractSub_item_code: selectedItem.item_code || "",
              contractSub_item_description: selectedItem.item_description || "",
              contractSub_item_packing: selectedItem.item_packing || "",
              contractSub_item_packing_unit:
                selectedItem.item_packing_unit || "",
              contractSub_item_packing_no: selectedItem.item_packing_no || "",
              contractSub_item_rate_per_pc: selectedItem.item_rate_per_pc || "",
              contractSub_item_box_size: selectedItem.item_box_size || "",
              contractSub_item_box_wt: selectedItem.item_box_weight || "",
              contractSub_item_gross_wt: selectedItem.item_gross_wt || "",
              contractSub_item_barcode: selectedItem.item_barcode || "",
              contractSub_item_hsnCode: selectedItem.item_hsnCode || "",
            };
            return newData;
          });
        }
        return;
      }

      if (digitOnlyFields.includes(field)) {
        const sanitizedValue = value.replace(/[^\d.]/g, "");
        const decimalCount = (sanitizedValue.match(/\./g) || []).length;
        if (decimalCount > 1) return;

        setContractData((prev) => {
          const newData = [...prev];
          newData[rowIndex] = {
            ...newData[rowIndex],
            [field]: sanitizedValue,
          };
          return newData;
        });
      } else {
        setContractData((prev) => {
          const newData = [...prev];
          newData[rowIndex] = {
            ...newData[rowIndex],
            [field]: value,
          };
          return newData;
        });
      }
    },
    [itemData]
  );
  const loadingData =
    !buyerData ||
    !branchData ||
    !portofLoadingData ||
    !containerSizeData ||
    !OrderTypeData ||
    !paymentTermsData ||
    !portsData ||
    !productData ||
    !bagTypeData ||
    !itemData ||
    !markingData ||
    isFetching;
  const addRow = useCallback(() => {
    setContractData((prev) => [
      ...prev,
      {
        contractSub_item_code: "",
        contractSub_item_description: "",
        contractSub_item_packing: "",
        contractSub_item_packing_unit: "",
        contractSub_item_packing_no: "",
        contractSub_item_rate_per_pc: "",
        contractSub_item_box_size: "",
        contractSub_item_box_wt: "",
        contractSub_item_gross_wt: "",
        contractSub_item_barcode: "",
        contractSub_item_hsnCode: "",
        contractSub_ctns: "",
      },
    ]);
  }, []);

  const removeRow = useCallback(
    (index) => {
      if (contractData.length > 1) {
        setContractData((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [contractData.length]
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const excludedFormKeys = [
      "contract_status",
      "contract_container_size",
      "contract_payment_terms",
      "contract_delivery_terms",
      "contract_validity",
      "contract_marking",
    ];

    const requiredFormFields = Object.keys(formData).filter(
      (key) => isEditMode || !excludedFormKeys.includes(key)
    );

    const requiredContractFields = Object.keys(contractData[0]).filter(
      (key) => !["id", "contractSub_item_barcode"].includes(key)
    );

    const missingFormFields = requiredFormFields.filter(
      (key) => !formData[key]?.toString().trim()
    );

    const missingContractFields = requiredContractFields.filter(
      (key) => !contractData[0]?.[key]?.toString().trim()
    );

    if (missingFormFields.length > 0 || missingContractFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: (
          <div className="flex flex-col gap-1 max-h-40 overflow-auto">
            {missingFormFields.map((field, idx) => (
              <div key={idx}>• {field.replace(/_/g, " ")}</div>
            ))}
            {missingContractFields.map((field, idx) => (
              <div key={idx + 100}>• {field.replace(/_/g, " ")}</div>
            ))}
          </div>
        ),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, contract_data: contractData };

      const response = isEditMode
        ? await axios.put(
            `${BASE_URL}/api/panel-update-contract/${decryptedId}`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        : await axios.post(`${BASE_URL}/api/panel-create-contract`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });

      if (response?.data.code == 200) {
        toast({ title: "Success", description: response.data.msg });

        if (!isEditMode) {
          setFormData({
            branch_short: "",
            branch_name: "",
            branch_address: "",
            contract_year: currentYear,
            contract_no: "",
            contract_date: getTodayDate(),
            contract_order_type: "",
            contract_pono: "",
            contract_buyer: "",
            contract_buyer_add: "",
            contract_consignee: "",
            contract_consignee_add: "",
            contract_container_size: "",
            contract_product: "",
            contract_loading_port: "",
            contract_loading_country: "",
            contract_destination_port: "",
            contract_destination_country: "",
            contract_payment_terms: "",
            contract_delivery_terms: "",
            contract_qty_inmt: "",
            contract_validity: "",
            contract_marking: "",
            contract_insurance: "",
            contract_pack_type: "",
            contract_packing: "",
            contract_currency: "",
            contract_sign: "",
            contract_position: "",
            contract_currency_rate: "",
          });
          setContractData([
            {
              contractSub_item_code: "",
              contractSub_item_description: "",
              contractSub_item_packing: "",
              contractSub_item_packing_unit: "",
              contractSub_item_packing_no: "",
              contractSub_item_rate_per_pc: "",
              contractSub_item_box_size: "",
              contractSub_item_box_wt: "",
              contractSub_item_gross_wt: "",
              contractSub_item_barcode: "",
              contractSub_item_hsnCode: "",
              contractSub_ctns: "",
            },
          ]);
        }
        navigate("/contract");
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRow = (id) => {
    setDeleteItemId(id);
    setDeleteConfirmOpen(true);
  };
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/panel-delete-contract-sub/${deleteItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.code == 200) {
        toast({
          title: "Success",
          description: response.data.msg,
          variant: "default",
        });
        fetchContractData();
        setDeleteItemId(null);
        setDeleteConfirmOpen(false);
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
        description: "Failed to delete contract.",
        variant: "destructive",
      });
    }
  };

  if (loadingData) {
    return <LoaderComponent name="Contract Data" />;
  }
  const CompactViewSection = ({ contractData }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const InfoItem = ({ icon: Icon, label, value }) => (
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-yellow-600 shrink-0" />
        <span className="text-sm text-gray-600">{label}:</span>
        <span className="text-sm font-medium">{value || "N/A"}</span>
      </div>
    );

    const toggleView = () => {
      const content = contentRef.current;

      if (isExpanded) {
        // Folding animation
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          transformOrigin: "top",
          transformStyle: "preserve-3d",
          rotateX: -90,
          onComplete: () => setIsExpanded(false),
        });
      } else {
        // Unfolding animation
        setIsExpanded(true);
        gsap.fromTo(
          content,
          {
            height: 0,
            opacity: 0,
            rotateX: -90,
          },
          {
            height: "auto",
            opacity: 1,
            duration: 0.5,
            ease: "power2.inOut",
            transformOrigin: "top",
            transformStyle: "preserve-3d",
            rotateX: 0,
          }
        );
      }
    };

    const TreatmentInfo = () =>
      formData?.branch_short && (
        <div className="mt-2 p-2 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <InfoItem
              icon={Globe}
              label="Country"
              value={formData?.contract_loading_country}
            />
            <div className=" col-span-2">
              <InfoItem
                icon={TestTubes}
                label="Company Add"
                value={formData?.branch_address}
              />
            </div>
          </div>
        </div>
      );

    return (
      <Card className="mb-2 " ref={containerRef}>
        <div
          className={`p-4 ${ButtonConfig.cardColor} flex items-center justify-between`}
        >
          <h2 className="text-lg font-semibold  flex items-center gap-2">
            <p className="flex gap-1 relative items-center">
              {" "}
              <FileText className="h-5 w-5" />
              {formData?.contract_ref} -
              <span className="text-sm uppercase">
                {formData?.branch_short}
              </span>
              <span className=" absolute top-4 left-6 text-[9px]  bg-inherit ">
                {formData?.branch_name}
              </span>
            </p>
          </h2>

          <div className="flex items-center gap-2">
            <span className=" flex items-center gap-2    text-xs font-medium  text-yellow-800 ">
              <MemoizedSelect
                className="bg-white"
                value={formData.contract_status}
                onChange={(value) =>
                  handleSelectChange("contract_status", value)
                }
                options={
                  Status?.map((status) => ({
                    value: status.value,
                    label: status.label,
                  })) || []
                }
                placeholder="Select Status"
              />
            </span>

            {isExpanded ? (
              <ChevronUp
                onClick={toggleView}
                className="h-5 w-5 cursor-pointer  text-yellow-600"
              />
            ) : (
              <ChevronDown
                onClick={toggleView}
                className="h-5 w-5 cursor-pointer  text-yellow-600"
              />
            )}
          </div>
        </div>
        <div
          ref={contentRef}
          className="transform-gpu"
          style={{ transformStyle: "preserve-3d" }}
        >
          <CardContent className="p-4">
            {/* Basic Info */}

            <div className="space-y-2 flex items-center justify-between">
              <InfoItem
                icon={FileText}
                label="Contract Ref"
                value={formData?.contract_ref}
              />
              <InfoItem
                icon={Package}
                label="Contract No"
                value={formData?.contract_no}
              />

              <InfoItem
                icon={TestTubes}
                label="Contract Date"
                value={moment(formData?.contract_date).format("DD-MM-YYYY")}
              />
              <InfoItem
                icon={Truck}
                label="PONO No"
                value={formData?.contract_pono}
              />
            </div>

            <TreatmentInfo />
          </CardContent>
        </div>
      </Card>
    );
  };
  return (
    <Page>
      {isEditMode && <CompactViewSection contractData={contractData} />}

      <form
        onSubmit={handleSubmit}
        className="w-full p-4 bg-blue-50/30 rounded-lg"
      >
        <Card className={`mb-6 ${ButtonConfig.cardColor} `}>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!isEditMode && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        Company <span className="text-red-500">*</span>
                      </label>
                      <MemoizedSelect
                        value={formData.branch_short}
                        onChange={(value) =>
                          handleSelectChange("branch_short", value)
                        }
                        options={
                          branchData?.branch?.map((branch) => ({
                            value: branch.branch_short,
                            label: branch.branch_short,
                          })) || []
                        }
                        placeholder="Select Company"
                      />
                    </div>
                  )}
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between`}
                    >
                      <span>
                        Buyer <span className="text-red-500">*</span>
                      </span>
                      <span>
                        <BuyerForm />
                      </span>
                    </label>
                    <MemoizedSelect
                      value={formData.contract_buyer}
                      onChange={(value) =>
                        handleSelectChange("contract_buyer", value)
                      }
                      options={
                        buyerData?.buyer?.map((buyer) => ({
                          value: buyer.buyer_name,
                          label: buyer.buyer_name,
                        })) || []
                      }
                      placeholder="Select Buyer"
                    />
                  </div>
                  {!isEditMode && (
                    <div
                      style={{ textAlign: "center" }}
                      className="bg-white rounded-md"
                    >
                      <span style={{ fontSize: "12px" }}>
                        {formData.branch_name}
                      </span>
                      <br />
                      <span style={{ fontSize: "9px", display: "block" }}>
                        {formData.branch_address}
                      </span>
                    </div>
                  )}
                  <div>
                    <Textarea
                      type="text"
                      placeholder="Enter Buyer Address"
                      value={formData.contract_buyer_add}
                      className=" text-[9px] bg-white border-none hover:border-none "
                      onChange={(e) =>
                        handleInputChange("contract_buyer_add", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between `}
                    >
                      <span>
                        {" "}
                        Consignee <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <MemoizedSelect
                      value={formData.contract_consignee}
                      onChange={(value) =>
                        handleSelectChange("contract_consignee", value)
                      }
                      options={
                        buyerData?.buyer?.map((buyer) => ({
                          value: buyer.buyer_name,
                          label: buyer.buyer_name,
                        })) || []
                      }
                      placeholder="Select Consignee"
                    />
                  </div>
                  <div>
                    <Textarea
                      type="text"
                      placeholder="Enter Consignee Address"
                      className=" text-[9px] bg-white border-none hover:border-none"
                      value={formData.contract_consignee_add}
                      onChange={(e) =>
                        handleInputChange(
                          "contract_consignee_add",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  {!isEditMode && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        Contract Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={formData.contract_date}
                        className="bg-white"
                        onChange={(e) =>
                          handleInputChange("contract_date", e.target.value)
                        }
                      />
                    </div>
                  )}
                  {!isEditMode && (
                    <>
                      <div>
                        <label
                          className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                        >
                          Contract No <span className="text-red-500">*</span>
                        </label>
                        <MemoizedSelect
                          value={formData?.contract_no}
                          onChange={(value) =>
                            handleSelectChange("contract_no", value)
                          }
                          options={
                            contractNoData?.contractNo?.map((contractNos) => ({
                              value: contractNos,
                              label: contractNos,
                            })) || []
                          }
                          placeholder="Select Contract No"
                        />
                      </div>
                      <div>
                        <label
                          className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                        >
                          Contract Ref. <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter Contract Ref"
                          value={formData.contract_ref}
                          key={formData.contract_ref}
                          disabled
                          className="bg-white"
                          onChange={(e) =>
                            handleInputChange("contract_ref", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label
                          className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between`}
                        >
                          <span>
                            Order Type <span className="text-red-500">*</span>
                          </span>
                          <span>
                            <CreateOrderTypeForm />
                          </span>
                        </label>
                        <MemoizedSelect
                          value={formData.contract_order_type}
                          onChange={(value) =>
                            handleSelectChange("contract_order_type", value)
                          }
                          options={
                            OrderTypeData?.orderType?.map((OrderType) => ({
                              value: OrderType.order_type,
                              label: OrderType.order_type,
                            })) || []
                          }
                          placeholder="Select OrderType"
                        />
                      </div>
                      <div>
                        <label
                          className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                        >
                          Contract PONO. <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter Contract PoNo"
                          value={formData.contract_pono}
                          className="bg-white"
                          onChange={(e) =>
                            handleInputChange("contract_pono", e.target.value)
                          }
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between`}
                    >
                      <span>Containers/Size</span>
                      <span>
                        <ContainerSizeForm />
                      </span>
                    </label>
                    <MemoizedSelect
                      value={formData.contract_container_size}
                      onChange={(value) =>
                        handleSelectChange("contract_container_size", value)
                      }
                      options={
                        containerSizeData?.containerSize?.map(
                          (containerSize) => ({
                            value: containerSize.containerSize,
                            label: containerSize.containerSize,
                          })
                        ) || []
                      }
                      placeholder="Select Containers/Size"
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between`}
                    >
                      <span>
                        Product <span className="text-red-500">*</span>
                      </span>
                      <span>
                        <CreateProductForm />
                      </span>
                    </label>
                    <MemoizedSelect
                      value={formData.contract_product}
                      onChange={(value) =>
                        handleSelectChange("contract_product", value)
                      }
                      options={
                        productData?.product?.map((product) => ({
                          value: product.product_name,
                          label: product.product_name,
                        })) || []
                      }
                      placeholder="Select Product"
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between`}
                    >
                      <span>
                        Port of Loading <span className="text-red-500">*</span>
                      </span>
                      <span>
                        <PortofLoadingForm />
                      </span>
                    </label>
                    <MemoizedSelect
                      value={formData.contract_loading_port}
                      onChange={(value) =>
                        handleSelectChange("contract_loading_port", value)
                      }
                      options={
                        portofLoadingData?.portofLoading?.map(
                          (portofLoading) => ({
                            value: portofLoading.portofLoading,
                            label: portofLoading.portofLoading,
                          })
                        ) || []
                      }
                      placeholder="Select Port of Loading"
                    />
                  </div>{" "}
                  {!isEditMode && (
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between `}
                      >
                        <span> Country</span>
                      </label>

                      <Input
                        className="bg-white"
                        disabled
                        value={formData.contract_loading_country}
                        onChange={(e) =>
                          handleInputChange(
                            "contract_loading_country",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between`}
                    >
                      <span>
                        Destination Port <span className="text-red-500">*</span>
                      </span>
                      <span>
                        <CountryForm />
                      </span>
                    </label>
                    <MemoizedSelect
                      value={formData.contract_destination_port}
                      onChange={(value) =>
                        handleSelectChange("contract_destination_port", value)
                      }
                      options={
                        portsData?.country?.map((country) => ({
                          value: country.country_port,
                          label: country.country_port,
                        })) || []
                      }
                      placeholder="Select Destination Port"
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between`}
                    >
                      <span>
                        {" "}
                        Dest. Country<span className="text-red-500">*</span>
                      </span>
                    </label>
                    <MemoizedSelect
                      value={formData.contract_destination_country}
                      onChange={(value) =>
                        handleSelectChange(
                          "contract_destination_country",
                          value
                        )
                      }
                      options={
                        countryData?.country?.map((country) => ({
                          value: country.country_name,
                          label: country.country_name,
                        })) || []
                      }
                      placeholder="Select Dest. Country"
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between`}
                    >
                      <span>Payment Terms</span>
                      <span>
                        <PaymentTermForm />
                      </span>
                    </label>
                    <MemoizedSelect
                      className="bg-white"
                      value={formData.contract_payment_terms}
                      onChange={(value) =>
                        handleSelectChange("contract_payment_terms", value)
                      }
                      options={
                        paymentTermsData?.paymentTerms?.map((paymentTerms) => ({
                          value: paymentTerms.paymentTerms,
                          label: paymentTerms.paymentTerms_short,
                        })) || []
                      }
                      placeholder="Select Payment Terms"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                      >
                        Delivery Terms
                      </label>
                      <Textarea
                        type="text"
                        className="bg-white"
                        placeholder="Enter Delivrey Term"
                        value={formData.contract_delivery_terms}
                        onChange={(e) =>
                          handleInputChange(
                            "contract_delivery_terms",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                    >
                      Quantity in MT <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className="bg-white"
                      value={formData.contract_qty_inmt}
                      onChange={(e) =>
                        handleInputChange("contract_qty_inmt", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                    >
                      Validatity
                    </label>
                    <Input
                      type="date"
                      className="bg-white"
                      value={formData.contract_validity}
                      onChange={(e) =>
                        handleInputChange("contract_validity", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between`}
                    >
                      <span>Marking</span>
                      <span>
                        <MarkingForm />
                      </span>
                    </label>
                    <MemoizedSelect
                      value={formData.contract_marking}
                      onChange={(value) =>
                        handleSelectChange("contract_marking", value)
                      }
                      options={
                        markingData?.marking?.map((marking) => ({
                          value: marking.marking,
                          label: marking.marking,
                        })) || []
                      }
                      placeholder="Select Marking"
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                    >
                      Insurance <span className="text-red-500">*</span>
                    </label>

                    <MemoizedSelect
                      value={formData.contract_insurance}
                      onChange={(value) =>
                        handleSelectChange("contract_insurance", value)
                      }
                      options={
                        Insurance?.map((insurance) => ({
                          value: insurance.value,
                          label: insurance.label,
                        })) || []
                      }
                      placeholder="Select Insurance"
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between`}
                    >
                      <span>
                        Packing Type<span className="text-red-500">*</span>
                      </span>
                      <span>
                        <CreateItemPackingForm />
                      </span>
                    </label>

                    <MemoizedSelect
                      className="bg-white"
                      value={formData.contract_pack_type}
                      onChange={(value) =>
                        handleSelectChange("contract_pack_type", value)
                      }
                      options={
                        bagTypeData?.bagType?.map((bagType) => ({
                          value: bagType.bagType,
                          label: bagType.bagType,
                        })) || []
                      }
                      placeholder="Select Packing Type"
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                    >
                      Packing <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className="bg-white"
                      value={formData.contract_packing}
                      onChange={(e) =>
                        handleInputChange("contract_packing", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                    >
                      Currency <span className="text-red-500">*</span>
                    </label>
                    <MemoizedSelect
                      className="bg-white"
                      value={formData.contract_currency}
                      onChange={(value) =>
                        handleSelectChange("contract_currency", value)
                      }
                      options={
                        Currency?.map((Currency) => ({
                          value: Currency.value,
                          label: Currency.label,
                        })) || []
                      }
                      placeholder="Select Packing Type"
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                    >
                      Currency Rate <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className="bg-white"
                      value={formData.contract_currency_rate}
                      onChange={(e) =>
                        handleInputChange(
                          "contract_currency_rate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                    >
                      Sigin
                    </label>
                    <MemoizedSelect
                      className="bg-white"
                      value={formData.contract_sign}
                      onChange={(value) =>
                        handleSelectChange("contract_sign", value)
                      }
                      options={
                        siginData?.branch?.map((sigin) => ({
                          value: sigin.branch_sign,
                          label: sigin.branch_sign,
                        })) || []
                      }
                      placeholder="Select Sigin"
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                    >
                      Position
                    </label>
                    <Input
                      className="bg-white"
                      value={formData.contract_position}
                      onChange={(e) =>
                        handleInputChange("contract_position", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="mb-2">
                  <h2 className="text-base font-semibold">Products</h2>
                </div>

                <div className="overflow-x-auto border rounded max-h-[34rem] overflow-y-auto">
                  <Table className="text-xs">
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead className="p-1 text-center border font-medium whitespace-nowrap">
                          <div
                            className="flex items-center justify-center gap-1 text-blue-600 hover:text-red-800 cursor-pointer"
                            onClick={() => {
                              navigate(`/master/item-form/new?mode=create`);
                            }}
                          >
                            <span>Item (Code - Desc)</span>
                          </div>
                        </TableHead>

                        {["Packing", "Mes", "Unit", "Rate", "Carton"].map(
                          (title, i) => (
                            <TableHead
                              key={i}
                              className="p-1 text-center border font-medium whitespace-nowrap"
                            >
                              {title}
                            </TableHead>
                          )
                        )}

                        <TableHead className="p-1 text-center border font-medium whitespace-nowrap">
                          <Button
                            type="button"
                            onClick={addRow}
                            className={`h-8 px-3 text-xs flex items-center gap-1 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {contractData.map((row, rowIndex) => (
                        <TableRow key={rowIndex} className="hover:bg-gray-50">
                          {/* Item Code + Desc */}
                          <TableCell className="p-1 border w-60">
                            <MemoizedProductSelect
                              value={row.contractSub_item_code}
                              onChange={(value) => {
                                const selected = itemData?.item?.find(
                                  (i) => i.item_code === value
                                );
                                handleRowDataChange(
                                  rowIndex,
                                  "contractSub_item_code",
                                  value
                                );
                                handleRowDataChange(
                                  rowIndex,
                                  "contractSub_item_description",
                                  selected?.item_description || ""
                                );
                              }}
                              options={
                                itemData?.item?.map((i) => ({
                                  value: i.item_code,
                                  label: `${i.item_code} - ${i.item_description}`,
                                })) || []
                              }
                              placeholder="Item"
                            />
                          </TableCell>

                          {/* Packing */}
                          <TableCell className="p-1 border w-32">
                            <Input
                              value={row.contractSub_item_packing}
                              onChange={(e) =>
                                handleRowDataChange(
                                  rowIndex,
                                  "contractSub_item_packing",
                                  e.target.value
                                )
                              }
                              placeholder="Pack"
                              className="bg-white h-8 px-2"
                            />
                          </TableCell>

                          {/* Measurement (e.g., Nos) */}
                          <TableCell className="p-1 border w-28">
                            {" "}
                            <Input
                              value={row.contractSub_item_packing_unit}
                              onChange={(e) =>
                                handleRowDataChange(
                                  rowIndex,
                                  "contractSub_item_packing_unit",
                                  e.target.value
                                )
                              }
                              placeholder="Mes"
                              className="bg-white h-8 px-2"
                            />
                          </TableCell>

                          {/* Unit */}
                          <TableCell className="p-1 border w-24">
                            <Input
                              value={row.contractSub_item_packing_no}
                              onChange={(e) =>
                                handleRowDataChange(
                                  rowIndex,
                                  "contractSub_item_packing_no",
                                  e.target.value
                                )
                              }
                              placeholder="Unit"
                              className="bg-white h-8 px-2"
                            />
                          </TableCell>

                          {/* Rate */}
                          <TableCell className="p-1 border w-24">
                            <Input
                              value={row.contractSub_item_rate_per_pc}
                              onChange={(e) =>
                                handleRowDataChange(
                                  rowIndex,
                                  "contractSub_item_rate_per_pc",
                                  e.target.value
                                )
                              }
                              placeholder="Rate"
                              className="bg-white h-8 px-2"
                            />
                          </TableCell>

                          {/* Carton */}
                          <TableCell className="p-1 border w-24">
                            <Input
                              value={row.contractSub_ctns}
                              onChange={(e) =>
                                handleRowDataChange(
                                  rowIndex,
                                  "contractSub_ctns",
                                  e.target.value
                                )
                              }
                              placeholder="Carton"
                              className="bg-white h-8 px-2"
                            />
                          </TableCell>

                          {/* Remove Button */}
                          <TableCell className="p-1 border">
                            {row.id ? (
                              <Button
                                variant="ghost"
                                onClick={() => handleDeleteRow(row.id)}
                                className="text-red-500"
                                type="button"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                onClick={() => removeRow(rowIndex)}
                                disabled={contractData.length === 1}
                                className="text-red-500 "
                                type="button"
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end  gap-2">
          {loading && <ProgressBar progress={70} />}
          <Button
            type="submit"
            disabled={loading}
            className={`mt-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} $`}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Update Contract"
            ) : (
              "Create Contract"
            )}
            {loading && (
              <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
            )}
          </Button>{" "}
        </div>
      </form>

      <DeleteContract
        title={"Contract"}
        deleteConfirmOpen={deleteConfirmOpen}
        setDeleteConfirmOpen={setDeleteConfirmOpen}
        handleDelete={handleDelete}
      />
    </Page>
  );
};

export default ContractAdd;
