import MemoizedProductSelect from "@/components/common/MemoizedProductSelect";
import MemoizedSelect from "@/components/common/MemoizedSelect";
import useApiToken from "@/components/common/useApiToken";
import { LoaderComponent } from "@/components/LoaderComponent/LoaderComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  useFetchBagsTypes,
  useFetchBuyers,
  useFetchCompanys,
  useFetchContainerSizes,
  useFetchContractRef,
  useFetchCountrys,
  useFetchGrCode,
  useFetchItemData,
  useFetchLutCode,
  useFetchMarkings,
  useFetchPaymentTerms,
  useFetchPortofLoadings,
  useFetchPorts,
  useFetchPreReceipt,
  useFetchProduct,
  useFetchSiginData,
} from "@/hooks/useApi";
import { useCurrentYear } from "@/hooks/useCurrentYear";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  MinusCircle,
  Package,
  PlusCircle,
  TestTubes,
  Trash2,
  Truck,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Currency from "../../components/json/contractCurrency.json";
import Insurance from "../../components/json/contractInsurance.json";
import Page from "../dashboard/page";
import GenerateCTN from "./GenerateCTN";
import moment from "moment";
import { gsap } from "gsap";
const fetchContractData = async (value, token) => {
  if (!value) {
    throw new Error("Invalid value provided");
  }
  if (!token) throw new Error("No authentication token found in ref");
  const response = await fetch(`${BASE_URL}/api/panel-fetch-contract-by-ref`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contract_ref: value }),
  });

  if (!response.ok) throw new Error("Failed to fetch contract data");
  return response.json();
};

const InvoiceAdd = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const token = useApiToken();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [invoiceData, setInvoiceData] = useState([
    {
      invoiceSub_item_code: "",
      invoiceSub_item_description: "",
      invoiceSub_item_packing: "",
      invoiceSub_item_packing_unit: "",
      invoiceSub_item_packing_no: "",
      invoiceSub_item_rate_per_pc: "",
      invoiceSub_item_box_size: "",
      invoiceSub_item_box_wt: "",
      invoiceSub_item_gross_wt: "",
      invoiceSub_item_barcode: "",
      invoiceSub_item_hsnCode: "",
      invoiceSub_ctns: "",
      invoiceSub_ct: "",
      invoiceSub_packings: 0,
    },
  ]);

  const { data: currentYear } = useCurrentYear();
  useEffect(() => {
    if (currentYear) {
      setFormData((prev) => ({
        ...prev,
        invoice_year: currentYear,
      }));
    }
  }, [currentYear]);
  const [formData, setFormData] = useState({
    branch_short: "",
    branch_name: "",
    branch_address: "",
    invoice_year: currentYear,
    invoice_date: "",
    invoice_no: "",
    invoice_ref: "",
    contract_date: "",
    contract_ref: "",
    contract_pono: "",

    invoice_buyer: "",
    invoice_buyer_add: "",
    invoice_consignee: "",
    invoice_consignee_add: "",
    invoice_container_size: "",
    invoice_product: "",
    invoice_product_cust_des: "",
    invoice_gr_code: "",
    invoice_lut_code: "",
    invoice_prereceipts: "",
    invoice_loading_port: "",
    invoice_loading_country: "",
    invoice_destination_port: "",
    invoice_destination_country: "",
    invoice_payment_terms: "",
    invoice_delivery_terms: "",

    //new
    invoice_qty_inmt: "",
    invoice_validity: "",
    invoice_pack_type: "",
    invoice_marking: "",
    invoice_insurance: "",
    invoice_packing: "",
    invoice_currency: "",
    invoice_sign: "",
    invoice_position: "",
    invoice_precarriage: "",
  });

  const checkInvoiceRef = async (invoiceRef) => {
    try {
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${BASE_URL}/api/panel-check-invoice-ref`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invoice_ref: invoiceRef }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.code == 400) {
        setDialogMessage(
          data.msg || "This reference number is already created."
        );
        setIsDialogOpen(true);
      }

      return data;
    } catch (error) {
      console.error("Error checking invoice reference:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (formData.invoice_ref) {
      checkInvoiceRef(formData.invoice_ref)
        .then((data) => {
          console.log("Invoice reference is valid:", data);
        })
        .catch((error) => {
          console.error("Error checking invoice reference:", error);
        });
    }
  }, [formData.invoice_ref]);

  const { data: branchData } = useFetchCompanys();
  const selectedBranch = branchData?.branch?.find(
    (branch) => branch.branch_short === formData.branch_short
  );
  const { data: buyerData } = useFetchBuyers();
  const { data: portofLoadingData } = useFetchPortofLoadings();
  const { data: paymentTermsData } = useFetchPaymentTerms();
  const { data: countryData } = useFetchCountrys();
  const { data: markingData } = useFetchMarkings();
  const { data: bagTypeData } = useFetchBagsTypes();
  const { data: containerSizeData } = useFetchContainerSizes();
  const { data: siginData } = useFetchSiginData();
  const { data: portsData } = useFetchPorts();
  const { data: itemData } = useFetchItemData();
  const { data: productData } = useFetchProduct();
  const { data: prereceiptsData } = useFetchPreReceipt();
  const { data: contractRefsData } = useFetchContractRef();
  const { data: lutData } = useFetchLutCode(selectedBranch?.branch_scheme);
  const { data: grcodeData } = useFetchGrCode(formData?.invoice_product);

  const handleInputChange = (e, field) => {
    let value;
    value = e.target.value;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [field]: value };
      if (field === "invoice_no" || field === "branch_short") {
        const selectedCompanySort = branchData?.branch?.find(
          (branch) => branch.branch_short === updatedFormData.branch_short
        );

        if (
          selectedCompanySort &&
          updatedFormData.invoice_no &&
          updatedFormData.invoice_year
        ) {
          const invoiceRef = `${selectedCompanySort.branch_name_short}${updatedFormData.invoice_no}/${updatedFormData.invoice_year}`;
          updatedFormData.invoice_ref = invoiceRef;
        }
      }

      return updatedFormData;
    });
  };
  const handleSelectChange = useCallback(
    (field, value) => {
      setFormData((prev) => {
        const updatedFormData = { ...prev, [field]: value };
        if (field === "invoice_buyer") {
          const selectedBuyer = buyerData?.buyer?.find(
            (buyer) => buyer.buyer_name === value
          );
          if (selectedBuyer) {
            updatedFormData.invoice_buyer_add = selectedBuyer.buyer_address;
          }
        }
        if (field === "invoice_consignee") {
          const selectedConsignee = buyerData?.buyer?.find(
            (buyer) => buyer.buyer_name === value
          );
          if (selectedConsignee) {
            updatedFormData.invoice_consignee_add =
              selectedConsignee.buyer_address;
          }
        }

        if (field === "contract_ref") {
          fetchContractData(value, token).then((data) => {
            const { contract, contractSub } = data;

            // Update form data with contract details
            const updatedFormDataWithContract = {
              ...updatedFormData,
              branch_short: contract.branch_short,
              branch_name: contract.branch_name,
              branch_address: contract.branch_address,
              invoice_year: contract.contract_year,
              contract_date: contract.contract_date,
              contract_pono: contract.contract_pono,
              invoice_no: contract.contract_no,
              invoice_ref: contract.invoice_ref,
              invoice_buyer: contract.contract_buyer,
              invoice_buyer_add: contract.contract_buyer_add,
              invoice_consignee: contract.contract_consignee,
              invoice_consignee_add: contract.contract_consignee_add,
              invoice_container_size: contract.contract_container_size,
              invoice_product: contract.contract_product,
              invoice_product_cust_des: contract.contract_product_cust_des,
              invoice_gr_code: contract.contract_gr_code,
              invoice_lut_code: contract.contract_lut_code,
              invoice_prereceipts: contract.contract_prereceipts,
              invoice_loading_port: contract.contract_loading_port,
              invoice_loading_country: contract.contract_loading_country,
              invoice_destination_port: contract.contract_destination_port,
              invoice_destination_country:
                contract.contract_destination_country,
              invoice_payment_terms: contract.contract_payment_terms,
              invoice_delivery_terms: contract.contract_delivery_terms,
              invoice_qty_inmt: contract.contract_qty_inmt.toString(),
              invoice_validity: contract.contract_validity,
              invoice_pack_type: contract.contract_pack_type,
              invoice_marking: contract.contract_marking,
              invoice_insurance: contract.contract_insurance,
              invoice_packing: contract.contract_packing,

              invoice_precarriage: contract.contract_position,
              invoice_currency: contract.contract_currency,
              invoice_sign: contract.contract_sign,
              invoice_position: contract.contract_position,
            };
            if (
              contract.branch_short &&
              updatedFormDataWithContract.invoice_no &&
              updatedFormDataWithContract.invoice_year
            ) {
              const selectedCompanySort = branchData?.branch?.find(
                (branch) => branch.branch_short === contract.branch_short
              );
              if (selectedCompanySort) {
                const invoiceRef = `${selectedCompanySort.branch_name_short}${updatedFormDataWithContract.invoice_no}/${updatedFormDataWithContract.invoice_year}`;
                updatedFormDataWithContract.invoice_ref = invoiceRef;
              }
            }

            // Update the form data state
            setFormData(updatedFormDataWithContract);

            // Map and set invoice data
            const mappedInvoiceData = contractSub.map((sub) => ({
              invoiceSub_item_code: sub.contractSub_item_code || "",
              invoiceSub_item_description:
                sub.contractSub_item_description || "",
              invoiceSub_item_packing: sub.contractSub_item_packing || "",
              invoiceSub_item_packing_unit:
                sub.contractSub_item_packing_unit || "",
              invoiceSub_item_packing_no: sub.contractSub_item_packing_no || "",
              invoiceSub_item_rate_per_pc:
                sub.contractSub_item_rate_per_pc || "",
              invoiceSub_item_box_size: sub.contractSub_item_box_size || "",
              invoiceSub_item_box_wt: sub.contractSub_item_box_wt || "",
              invoiceSub_item_gross_wt: sub.contractSub_item_gross_wt || "",
              invoiceSub_item_barcode: sub.contractSub_item_barcode || "",
              invoiceSub_item_hsnCode: sub.contractSub_item_hsnCode || "",
              invoiceSub_ctns: sub.contractSub_ctns || "",
              invoiceSub_ct: "",
            }));

            setInvoiceData(mappedInvoiceData);
          });
        }
        if (field === "branch_short") {
          const selectedCompanySort = branchData?.branch?.find(
            (branch) => branch.branch_short === value
          );
          if (selectedCompanySort) {
            updatedFormData.branch_name = selectedCompanySort.branch_name;
            updatedFormData.branch_address = selectedCompanySort.branch_address;
            updatedFormData.invoice_prereceipts =
              selectedCompanySort.branch_prereceipts;

            const selectedBuyer = buyerData?.buyer?.find(
              (buyer) => buyer.buyer_name == prev.invoice_buyer
            );
            if (selectedBuyer) {
              const invoiceRef = `${selectedCompanySort.branch_name_short}${prev.invoice_no}/${prev.invoice_year}`;
              updatedFormData.invoice_ref = invoiceRef;
            }
          }
        }
        if (field == "invoice_no") {
          if (updatedFormData.branch_short && updatedFormData.invoice_year) {
            const selectedCompanySort = branchData?.branch?.find(
              (branch) => branch.branch_short === updatedFormData.branch_short
            );
            console.log(selectedCompanySort, "selectedCompanySort");
            if (selectedCompanySort) {
              const invoiceRef = `${selectedCompanySort.branch_name_short}${updatedFormData.invoice_no}/${updatedFormData.invoice_year}`;
              updatedFormData.invoice_ref = invoiceRef;
            }
          }
        }
        if (field === "contract_sign") {
          const selectedSigner = siginData?.branch?.find(
            (sigin) => sigin.branch_sign === value
          );
          if (selectedSigner) {
            updated.invoice_position = selectedSigner.branch_sign_position;
          }
        }

        return updatedFormData;
      });
    },
    [
      branchData,
      buyerData,
      formData.invoice_no,
      formData.invoice_buyer,
      formData,
    ]
  );
  console.log(formData.invoice_ref);
  //done
  const handleRowDataChange = useCallback(
    (rowIndex, field, value) => {
      const digitOnlyFields = [
        "invoiceSub_ctns",
        "invoiceSub_item_packing",
        "invoiceSub_item_packing_no",
        "invoiceSub_item_rate_per_pc",
        "invoiceSub_item_box_size",
        "invoiceSub_packings",
      ];

      if (field === "invoiceSub_item_code") {
        const selectedItem = itemData?.item?.find(
          (item) => item.item_code === value
        );

        if (selectedItem) {
          setInvoiceData((prev) => {
            const newData = [...prev];
            newData[rowIndex] = {
              ...newData[rowIndex],
              invoiceSub_item_code: selectedItem.item_code || "",
              invoiceSub_item_description: selectedItem.item_description || "",
              invoiceSub_item_packing: selectedItem.item_packing || "",
              invoiceSub_item_packing_unit:
                selectedItem.item_packing_unit || "",
              invoiceSub_item_packing_no: selectedItem.item_packing_no || "",
              invoiceSub_item_rate_per_pc: selectedItem.item_rate_per_pc || "",
              invoiceSub_item_box_size: selectedItem.item_box_size || "",
              invoiceSub_item_box_wt: selectedItem.item_box_weight || "",
              invoiceSub_item_gross_wt: selectedItem.item_gross_wt || "",
              invoiceSub_item_barcode: selectedItem.item_barcode || "",
              invoiceSub_item_hsnCode: selectedItem.item_hsnCode || "",
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

        setInvoiceData((prev) => {
          const newData = [...prev];
          newData[rowIndex] = {
            ...newData[rowIndex],
            [field]: sanitizedValue,
          };
          return newData;
        });
      } else {
        setInvoiceData((prev) => {
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
  //crt
  const addRow = useCallback(() => {
    setInvoiceData((prev) => [
      ...prev,
      {
        invoiceSub_item_code: "",
        invoiceSub_item_description: "",
        invoiceSub_item_packing: "",
        invoiceSub_item_packing_unit: "",
        invoiceSub_item_packing_no: "",
        invoiceSub_item_rate_per_pc: "",
        invoiceSub_item_box_size: "",
        invoiceSub_item_box_wt: "",
        invoiceSub_item_gross_wt: "",
        invoiceSub_item_barcode: "",
        invoiceSub_item_hsnCode: "",
        invoiceSub_ctns: "",
        invoiceSub_ct: "",
        invoiceSub_packings: 0,
      },
    ]);
  }, []);
  //crt
  const removeRow = useCallback(
    (index) => {
      if (invoiceData.length > 1) {
        setInvoiceData((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [invoiceData.length]
  );
  const loadingData =
    !buyerData ||
    !branchData ||
    !portofLoadingData ||
    !containerSizeData ||
    !paymentTermsData ||
    !portsData ||
    !productData ||
    !bagTypeData ||
    !itemData ||
    !markingData ||
    !countryData ||
    !siginData ||
    !prereceiptsData ||
    !contractRefsData;
  if (loadingData) {
    return <LoaderComponent name="Invoice Data" />;
  }
  const CompactViewSection = ({ invoiceDatas }) => {
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
      invoiceDatas?.invoice?.branch_short && (
        <div className="mt-2 p-2 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <InfoItem
              icon={Clock}
              label="Invoice Date"
              value={
                <Input
                  type="date"
                  value={formData.invoice_date}
                  className="bg-white"
                  onChange={(e) => handleInputChange(e, "invoice_date")}
                />
              }
            />
            <div className=" col-span-2">
              <InfoItem
                icon={TestTubes}
                label="Branch Add"
                value={invoiceDatas.invoice?.branch_address}
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
              {invoiceDatas?.invoice?.invoice_ref} -
              <span className="text-sm uppercase">
                {invoiceDatas?.invoice?.branch_short}
              </span>
              <span className=" absolute top-4 left-6 text-[9px]  bg-inherit ">
                {invoiceDatas?.invoice?.branch_name}
              </span>
            </p>
          </h2>

          <div className="flex items-center gap-2">
            <span className=" flex items-center gap-2    text-xs font-medium  text-yellow-800 ">
              {/* {invoiceDatas?.invoice?.invoice_status} */}
              {/* <MemoizedSelect
                value={formData?.invoice_product}
                onChange={(value) =>
                  handleSelectChange("invoice_product", value)
                }
                // options={
                //   productData?.product?.map((product) => ({
                //     value: product.product_name,
                //     label: product.product_name,
                //   })) || []
                // }
                placeholder="Select Product"
              />
              <MemoizedSelect
                value={formData.invoice_status}
                onChange={(value) =>
                  handleSelectChange("invoice_status", value)
                }
                // options={
                //   statusData?.invoiceStatus?.map((status) => ({
                //     value: status.invoice_status,
                //     label: status.invoice_status,
                //   })) || []
                // }
                placeholder="Select Status"
              /> */}
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
                value={invoiceDatas?.invoice?.contract_ref}
              />
              <InfoItem
                icon={Package}
                label="Invoice No"
                value={invoiceDatas?.invoice?.invoice_no}
              />

              <InfoItem
                icon={TestTubes}
                label="Contract Date"
                value={moment(invoiceDatas?.invoice?.contract_date).format(
                  "DD-MM-YYYY"
                )}
              />
              <InfoItem
                icon={Truck}
                label="Contract PONO"
                value={invoiceDatas?.invoice?.contract_pono}
              />
            </div>

            {/* <TreatmentInfo /> */}

            {/* Products Table */}
          </CardContent>
        </div>
      </Card>
    );
  };
  return (
    <Page>
      <CompactViewSection invoiceDatas={invoiceData} />

      <form
        // onSubmit={handleSubmit}
        className="w-full p-4 bg-blue-50/30 rounded-lg"
      >
        <Card className={`mb-6 ${ButtonConfig.cardColor}`}>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Contract Ref. <span className="text-red-500">*</span>
                    </label>
                    <MemoizedSelect
                      value={formData.contract_ref}
                      onChange={(value) =>
                        handleSelectChange("contract_ref", value)
                      }
                      options={
                        contractRefsData?.contractRef?.map((contractRef) => ({
                          value: contractRef.contract_ref,
                          label: contractRef.contract_ref,
                        })) || []
                      }
                      placeholder="Select Contract Ref."
                    />
                  </div>
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

                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Invoice No <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter Invoice No"
                      className="bg-white"
                      value={formData.invoice_no}
                      onChange={(e) => handleInputChange(e, "invoice_no")}
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Invoice Date <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={formData.invoice_date}
                      className="bg-white"
                      onChange={(e) => handleInputChange(e, "invoice_date")}
                    />
                  </div>
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

                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Contract Ref. <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      className="bg-white"
                      placeholder="Enter Contract Ref"
                      value={formData.contract_ref}
                      disabled
                      onChange={(e) => handleInputChange(e, "contract_ref")}
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
                      className="bg-white"
                      placeholder="Enter Contract PoNo"
                      value={formData.contract_pono}
                      disabled
                      onChange={(e) => handleInputChange(e, "contract_pono")}
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Contract Date <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      className="bg-white"
                      value={formData.contract_date}
                      onChange={(e) => handleInputChange(e, "contract_date")}
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Invoice Ref. <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter Invoice Ref"
                      className="bg-white"
                      value={formData.invoice_ref}
                      disabled
                      onChange={(e) => handleInputChange(e, "invoice_ref")}
                    />
                  </div>

                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between`}
                    >
                      <span>
                        Buyer <span className="text-red-500">*</span>
                      </span>
                    </label>

                    <MemoizedSelect
                      value={formData.invoice_buyer}
                      onChange={(value) =>
                        handleSelectChange("invoice_buyer", value)
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
                      value={formData.invoice_consignee}
                      onChange={(value) =>
                        handleSelectChange("invoice_consignee", value)
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
                      placeholder="Enter Buyer Address"
                      value={formData.invoice_buyer_add}
                      className=" text-[9px] bg-white border-none hover:border-none"
                      onChange={(e) =>
                        handleInputChange(e, "invoice_buyer_add")
                      }
                    />
                  </div>
                  <div>
                    <Textarea
                      type="text"
                      placeholder="Enter Consignee Address"
                      value={formData.invoice_consignee_add}
                      className=" text-[9px] bg-white border-none hover:border-none"
                      onChange={(e) =>
                        handleInputChange(e, "invoice_consignee_add")
                      }
                    />
                  </div>

                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Pre-Receipts <span className="text-red-500">*</span>
                    </label>
                    <MemoizedSelect
                      value={formData.invoice_prereceipts}
                      onChange={(value) =>
                        handleSelectChange("invoice_prereceipts", value)
                      }
                      options={
                        prereceiptsData?.prereceipts?.map((prereceipts) => ({
                          value: prereceipts.prereceipts_name,
                          label: prereceipts.prereceipts_name,
                        })) || []
                      }
                      placeholder="Select Pre Receipts"
                    />
                  </div>

                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between`}
                    >
                      <span>
                        {" "}
                        Port of Loading <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <MemoizedSelect
                      value={formData.invoice_loading_port}
                      onChange={(value) =>
                        handleSelectChange("invoice_loading", value)
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
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between`}
                    >
                      <span>
                        {" "}
                        Destination Port <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <MemoizedSelect
                      value={formData.invoice_destination_port}
                      onChange={(value) =>
                        handleSelectChange("invoice_destination_port", value)
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
                        Dest. Country <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <MemoizedSelect
                      value={formData.invoice_destination_country}
                      onChange={(value) =>
                        handleSelectChange("invoice_destination_country", value)
                      }
                      options={
                        countryData?.country?.map((country) => ({
                          value: country.country_name,
                          label: country.country_name,
                        })) || []
                      }
                      placeholder="Select Dest. Country "
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Containers/Size <span className="text-red-500">*</span>
                    </label>
                    <MemoizedSelect
                      value={formData.invoice_container_size}
                      onChange={(value) =>
                        handleSelectChange("invoice_container_size", value)
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
                    </label>
                    <MemoizedSelect
                      key={formData.invoice_product}
                      value={formData.invoice_product}
                      onChange={(value) =>
                        handleSelectChange("invoice_product", value)
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
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Custom Des <span className="text-red-500">*</span>
                    </label>

                    <Input
                      className="bg-white"
                      value={formData.invoice_product_cust_des}
                      onChange={(e) =>
                        handleInputChange(
                          "invoice_product_cust_des",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Precarriage
                    </label>
                    <Input
                      type="text"
                      className="bg-white"
                      placeholder="Enter Precarriage"
                      value={formData.invoice_precarriage}
                      onChange={(e) =>
                        handleInputChange(e, "invoice_precarriage")
                      }
                    />
                  </div>

                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Containers/Size <span className="text-red-500">*</span>
                    </label>
                    <MemoizedSelect
                      value={formData.invoice_container_size}
                      onChange={(value) =>
                        handleSelectChange("invoice_container_size", value)
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
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Precarriage
                    </label>
                    <Input
                      type="text"
                      className="bg-white"
                      placeholder="Enter Precarriage"
                      value={formData.invoice_precarriage}
                      onChange={(e) =>
                        handleInputChange(e, "invoice_precarriage")
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      LUT Code <span className="text-red-500">*</span>
                    </label>
                    <MemoizedSelect
                      value={formData.invoice_lut_code}
                      onChange={(value) =>
                        handleSelectChange("invoice_lut_code", value)
                      }
                      options={
                        lutData?.scheme
                          ? [
                              {
                                value: lutData.scheme.scheme_description,
                                label: lutData.scheme.scheme_description,
                              },
                            ]
                          : []
                      }
                      placeholder="Select LUT Code"
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      GR Code <span className="text-red-500">*</span>
                    </label>
                    <MemoizedSelect
                      value={formData.invoice_gr_code}
                      onChange={(value) =>
                        handleSelectChange("invoice_gr_code", value)
                      }
                      options={
                        grcodeData?.grcode?.map((grcode) => ({
                          value: grcode.gr_code_des,
                          label: grcode.gr_code_des,
                        })) || []
                      }
                      placeholder="Select GR Code"
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium flex items-center justify-between`}
                    >
                      <span>Payment Terms</span>
                    </label>
                    <MemoizedSelect
                      value={formData.invoice_payment_terms}
                      onChange={(value) =>
                        handleSelectChange("invoice_payment_terms", value)
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
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Delivery Term
                    </label>
                    <Textarea
                      type="text"
                      className="  bg-white border-none hover:border-none"
                      placeholder="Enter Remarks"
                      value={formData.invoice_delivery_terms}
                      onChange={(e) =>
                        handleInputChange(e, "invoice_delivery_terms")
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Quantity INMT
                    </label>
                    <Input
                      className="bg-white"
                      value={formData.invoice_qty_inmt}
                      onChange={(e) =>
                        handleInputChange("invoice_qty_inmt", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      Validatity
                    </label>
                    <Input
                      type="date"
                      className="bg-white"
                      value={formData.invoice_validity}
                      onChange={(e) =>
                        handleInputChange("invoice_validity", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-xs mb-[2px] font-medium `}
                    >
                      <span>
                        {" "}
                        Marking <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <MemoizedSelect
                      value={formData.invoice_marking}
                      onChange={(value) =>
                        handleSelectChange("invoice_marking", value)
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
                      value={formData.invoice_insurance}
                      onChange={(value) =>
                        handleSelectChange("invoice_insurance", value)
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
                      className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                    >
                      <span>Packing Type</span>
                    </label>
                    <MemoizedSelect
                      className="bg-white"
                      value={formData.invoice_pack_type}
                      onChange={(value) =>
                        handleSelectChange("invoice_pack_type", value)
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
                      Packing
                    </label>
                    <Input
                      className="bg-white"
                      value={formData.invoice_packing}
                      onChange={(e) =>
                        handleInputChange("invoice_packing", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                    >
                      <span>Currency</span>
                    </label>
                    <MemoizedSelect
                      className="bg-white"
                      value={formData.invoice_currency}
                      onChange={(value) =>
                        handleSelectChange("invoice_currency", value)
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
                      <span>Sigin</span>
                    </label>
                    <MemoizedSelect
                      className="bg-white"
                      value={formData.invoice_sign}
                      onChange={(value) =>
                        handleSelectChange("invoice_sign", value)
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
                      value={formData.invoice_position}
                      onChange={(e) =>
                        handleInputChange("invoice_position", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-800">
                    Products
                  </h2>

                  <GenerateCTN
                    invoiceData={invoiceData}
                    setInvoiceData={setInvoiceData}
                  />
                </div>

                <div className="overflow-x-auto border rounded max-h-[34rem] overflow-y-auto">
                  <Table className="text-xs">
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        {[
                          "Item (Code - Desc)",
                          "Pack",
                          "Mes",
                          "Unit",
                          "Rate",
                          "Carton",
                          "Packing",
                          "Ct No",
                        ].map((title, i) => (
                          <TableHead
                            key={i}
                            className="p-1 text-center border font-medium whitespace-nowrap"
                          >
                            {title}
                          </TableHead>
                        ))}

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
                      {invoiceData.map((row, rowIndex) => (
                        <TableRow key={rowIndex} className="hover:bg-gray-50">
                          {/* Item Code + Desc */}
                          <TableCell className="p-1 border w-60">
                            <MemoizedProductSelect
                              value={row.invoiceSub_item_code}
                              onChange={(value) => {
                                const selected = itemData?.item?.find(
                                  (i) => i.item_code === value
                                );
                                handleRowDataChange(
                                  rowIndex,
                                  "invoiceSub_item_code",
                                  value
                                );
                                handleRowDataChange(
                                  rowIndex,
                                  "invoiceSub_item_description",
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
                              value={row.invoiceSub_item_packing}
                              onChange={(e) =>
                                handleRowDataChange(
                                  rowIndex,
                                  "invoiceSub_item_packing",
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
                              value={row.invoiceSub_item_packing_unit}
                              onChange={(e) =>
                                handleRowDataChange(
                                  rowIndex,
                                  "invoiceSub_item_packing_unit",
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
                              value={row.invoiceSub_item_packing_no}
                              onChange={(e) =>
                                handleRowDataChange(
                                  rowIndex,
                                  "invoiceSub_item_packing_no",
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
                              value={row.invoiceSub_item_rate_per_pc}
                              onChange={(e) =>
                                handleRowDataChange(
                                  rowIndex,
                                  "invoiceSub_item_rate_per_pc",
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
                              value={row.invoiceSub_ctns}
                              onChange={(e) =>
                                handleRowDataChange(
                                  rowIndex,
                                  "invoiceSub_ctns",
                                  e.target.value
                                )
                              }
                              placeholder="Carton"
                              className="bg-white h-8 px-2"
                            />
                          </TableCell>
                          <TableCell className="p-1 border w-24">
                            <Input
                              value={row.invoiceSub_packings}
                              onChange={(e) =>
                                handleRowDataChange(
                                  rowIndex,
                                  "invoiceSub_packings",
                                  e.target.value
                                )
                              }
                              placeholder="Packing"
                              className="bg-white h-8 px-2"
                            />
                          </TableCell>

                          <TableCell className="p-1 border w-24">
                            <Input
                              value={row.invoiceSub_ct}
                              onChange={(e) =>
                                handleRowDataChange(
                                  rowIndex,
                                  "invoiceSub_ct",
                                  e.target.value
                                )
                              }
                              placeholder="Ct No"
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
                                disabled={invoiceData.length === 1}
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

        <div className="flex items-center justify-end  gap-2"></div>
      </form>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Entry</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="bg-yellow-500 text-black hover:bg-red-600"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  );
};

export default InvoiceAdd;
