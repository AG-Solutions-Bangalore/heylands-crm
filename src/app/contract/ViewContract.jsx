import { LoaderComponent } from "@/components/LoaderComponent/LoaderComponent";
import useApiToken from "@/components/common/useApiToken";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import BASE_URL, { getImageUrl, LetterHead } from "@/config/BaseUrl";
import { decryptId } from "@/utils/encyrption/Encyrption";
import html2pdf from "html2pdf.js";
import { File, Printer } from "lucide-react";
import moment from "moment";
import { toWords } from "number-to-words";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import white from "../../../public/letterHead/white.png";
import Page from "../dashboard/page";
import LetterImage from "../../../public/letterHead/NEL.png";
const ViewContract = () => {
  const containerRef = useRef();
  const [includeHeader, setIncludeHeader] = useState(false);
  const { id } = useParams();
  const decryptedId = decryptId(id);
  const token = useApiToken();
  const [contractData, setContractData] = useState({});
  const [contractDataSubData, setContractDataSubData] = useState([]);
  const [branchData, setBranchData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPurchaseData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/panel-fetch-contract-by-id/${decryptedId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch contract data");
        }

        const data = await response.json();
        console.log(data?.branch?.branch_letter_head);
        if (!data?.branch?.branch_letter_head) {
          setLoading(true);
          setError("Letter head data is missing");
          return;
        }
        setContractData(data.contract);
        setContractDataSubData(data.contractSub);
        setBranchData(data.branch);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPurchaseData();
  }, [decryptedId]);
  const totalAmount = contractDataSubData?.reduce((total, item) => {
    return (
      total +
      Number(item?.contractSub_item_packing_no) *
        Number(item?.contractSub_ctns) *
        Number(item?.contractSub_item_rate_per_pc)
    );
  }, 0);

  const [rupees, paise] = totalAmount.toFixed(2).split(".");

  const totalInWords = `${toWords(Number(rupees))} Rupees${
    paise !== "00" ? ` and ${toWords(Number(paise))} Paise` : ""
  }`;

  const handlePrint = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "invoice",
    pageStyle: `
    @media print {
      /* Ensure header repeats */
      thead { display: table-header-group; }
      
      .print-header {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        padding: 10px 0;
        background: white;
        // border-bottom: 2px solid black;
      }

      /* Push content down to avoid overlap */
      .print-container {
        margin-top: 20px;
      }

      .print-body {
        margin-top: 10px;
        page-break-inside: avoid;
      }

      .print-section {
        margin-bottom: 20px;
      }

      /* Ensure second page starts with margin-top: 100px */
      .page-margin {
        margin-top: 100px !important;
      }

      .page-break {
        page-break-before: always;
      }

      @page {
        size: A4;
        margin: 5mm;
      }
    }
  `,
  });
  const PrintHeader = ({ includeHeader }) => {
    return (
      <div className="print-header hidden print:block">
        {includeHeader && (
          <>
            <div className="hidden print:block">
              <img
                src={`${LetterHead}/${branchData?.branch_letter_head}`}
                alt="logo"
                className="w-full max-h-[120px] object-contain"
              />

              <h1 className="text-center text-[15px] font-bold mt-2 ">
                ORDER CONFIRMATION
              </h1>
            </div>
          </>
        )}
        {!includeHeader && (
          <div>
            {" "}
            <img src={white} alt="logo" className="w-full" />
            <h1 className="text-center text-[15px] font-bold ">
              ORDER CONFIRMATION
            </h1>
          </div>
        )}
      </div>
    );
  };
  const handleSaveAsPdf1 = async () => {
    if (!containerRef.current) return;

    const opt = {
      margin: 10,
      filename: "contract.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(containerRef.current).set(opt).save();
  };
  if (loading) {
    return <LoaderComponent name="Contract Data" />;
  }
  if (error) {
    return <ErrorComponent message="Error Fetching Contract Data" />;
  }

  return (
    <Page>
      <div className=" flex w-full p-2 gap-2 relative ">
        <div className="w-[85%]">
          <div ref={containerRef} className="print-container">
            <table>
              <thead>
                <tr>
                  <td colSpan="2">
                    <div className="print:hidden">
                      <div>
                        {includeHeader && (
                          <>
                            <img
                              src={
                                getImageUrl(branchData?.branch_letter_head) ||
                                `${LetterImage}`
                              }
                              alt="logo"
                            />
                            <h1 className="text-center text-[15px] font-bold ">
                              ORDER CONFIRMATION
                            </h1>
                          </>
                        )}
                      </div>
                      <div>
                        {!includeHeader && (
                          <div>
                            {" "}
                            <img src={white} className="w-full" />
                            <h1 className="text-center text-[15px] font-bold">
                              ORDER CONFIRMATION
                            </h1>
                          </div>
                        )}
                      </div>
                    </div>
                    <PrintHeader includeHeader={includeHeader} />
                  </td>
                </tr>
              </thead>

              <tbody>
                <tr className={`print-section`}>
                  <td className="print-body text-[12px]">
                    <div>
                      <div className="mx-4">
                        <div className="w-full mx-auto grid grid-cols-2 gap-4">
                          <div>
                            <p>Ref: {contractData?.contract_ref}</p>
                          </div>
                          <div className="text-right">
                            <p>
                              DATE:{" "}
                              {contractData?.contract_date
                                ? moment(contractData.contract_date).format(
                                    "DD-MM-YYYY"
                                  )
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        {" "}
                        <table className="w-full border border-black border-collapse table-auto my-4 text-[11px]">
                          <thead className="bg-gray-100">
                            <tr className="border-b border-black">
                              <th className="border-r border-black p-2 text-center w-[35%]">
                                ITEM
                              </th>
                              <th className="border-r border-black p-2 text-center w-[24%]">
                                PACKING{" "}
                                <p>EACH {contractData?.contract_pack_type}</p>
                              </th>
                              <th className="border-r border-black p-2 text-center w-[13%]">
                                QUANTITY PC
                              </th>
                              <th className="border-r border-black p-2 text-center w-[13%]">
                                RATE PC
                              </th>
                              <th className="p-2 text-center w-[15%]">TOTAL</th>
                            </tr>
                          </thead>

                          <tbody>
                            {contractDataSubData?.map((item, index) => (
                              <tr
                                key={item.id}
                                className="border-b border-black"
                              >
                                <td className="border-r border-black p-2">
                                  {item.contractSub_item_description}
                                </td>

                                <td className="border-r border-black p-0">
                                  <div className="grid grid-cols-3 divide-x divide-black text-center">
                                    <span className="p-2">
                                      {Number(
                                        item.contractSub_item_packing_no
                                      ).toFixed(0)}
                                    </span>

                                    <span className="p-2">
                                      {Number(
                                        item.contractSub_item_packing
                                      ).toFixed(0)}
                                    </span>

                                    <span className="p-2">
                                      {item.contractSub_item_packing_unit}
                                    </span>
                                  </div>
                                </td>

                                <td className="border-r border-black p-2 text-center">
                                  {item.contractSub_item_packing_no *
                                    item.contractSub_ctns}
                                </td>

                                <td className="border-r border-black p-2 text-right">
                                  {item.contractSub_item_rate_per_pc}
                                </td>

                                <td className="p-2 text-right">
                                  {(
                                    Number(item.contractSub_item_packing_no) *
                                    Number(item.contractSub_ctns) *
                                    Number(item.contractSub_item_rate_per_pc)
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            ))}

                            <tr className="font-bold">
                              <td className=" p-2 text-right">Total</td>
                              <td className="border-r border-black p-2 "></td>

                              <td className="border-r border-black p-2 text-center">
                                {contractDataSubData
                                  ?.reduce((total, item) => {
                                    return (
                                      total +
                                      Number(item.contractSub_item_packing_no) *
                                        Number(item.contractSub_ctns)
                                    );
                                  }, 0)
                                  .toFixed(0)}
                              </td>
                              <td className="border-r border-black p-2"></td>
                              <td className="border-r border-black p-2 text-right">
                                {contractDataSubData
                                  ?.reduce((total, item) => {
                                    return (
                                      total +
                                      Number(item.contractSub_item_packing_no) *
                                        Number(item.contractSub_ctns) *
                                        Number(
                                          item.contractSub_item_rate_per_pc
                                        )
                                    );
                                  }, 0)
                                  .toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div>
                        <p className="font-bold">
                          TOTAL {contractData?.contract_delivery_terms} IN{" "}
                          {contractData?.contract_currency} {totalInWords}
                          <span className=" font-semibold ml-3"></span>
                        </p>
                        <p className="font-bold">
                          NOTE :
                          <span>
                            {" "}
                            Items/quantity may vary according to the requirement
                            on or before Shipment.
                          </span>{" "}
                        </p>
                      </div>
                    </div>
                    <div className="page-break mt-4 font-bold p-2">
                      <table className="w-full table-fixed ">
                        <tbody>
                          <tr>
                            <td className="font-semibold p-2 w-1/4">
                              SUPPLIER NAME
                            </td>
                            <td className="p-2">
                              {contractData?.branch_name}{" "}
                              <p> {contractData?.branch_address}</p>
                            </td>
                          </tr>
                          <tr>
                            <td className="font-semibold p-2 ">VALIDITY</td>
                            <td className="p-2">
                              {" "}
                              {/* {contractData?.contract_validity} */}
                              {contractData?.contract_validity
                                ? moment(
                                    contractData?.contract_validity
                                  ).format("DD-MM-YYYY")
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-semibold p-2 ">INSURANCE</td>
                            <td className="p-2">
                              {" "}
                              {contractData?.contract_insurance}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-semibold p-2 ">
                              PAYMENT TERMS
                            </td>
                            <td className="p-2">
                              {" "}
                              {contractData?.contract_payment_terms}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-semibold p-2">
                              MARKS & NUMBERS
                            </td>
                            <td className="p-2">
                              {" "}
                              {contractData?.contract_marking}
                            </td>
                          </tr>

                          <tr>
                            <td className="font-semibold p-2">BANKER'S NAME</td>
                            <td className="p-2"></td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="space-y-10 mt-10">
                        <p>
                          WE HEREBY CERTIFY THAT WE ARE NOT REQUIRING PRE
                          INSPECTION CERTIFICATE FROM ANY GOVERNMENT OFFICIAL
                          CONCERNS IN INDIA IN RESPECT OF ABOVE IMPORT ORDER.
                          FURTHER WE CONFIRM THAT WE ARE WILLING TO FOREGO ANY
                          CLAIMS IN THIS RESPECT.
                        </p>

                        <p>FOR :{contractData?.contract_consignee}</p>
                        <p>AUTHORISED SIGNATORY</p>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="fixed w-[13%] flex flex-col right-0 bottom-10  border border-gray-200   rounded-lg  p-2 ">
          <Tabs defaultValue="header" className="w-full ">
            <TabsContent value="header">
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  onClick={handlePrint}
                  className="w-full bg-yellow-200 text-black hover:bg-yellow-500 flex items-center justify-start gap-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print</span>
                </Button>
                <Button
                  onClick={handleSaveAsPdf1}
                  className="w-full bg-yellow-200 text-black hover:bg-yellow-500 flex items-center justify-start gap-2"
                >
                  <File className="h-4 w-4" />
                  <span>Pdf</span>
                </Button>
              </div>

              <div className="flex mt-3">
                <div className="mb-2">
                  <input
                    type="checkbox"
                    checked={includeHeader}
                    onChange={(e) => setIncludeHeader(e.target.checked)}
                    className="mr-2"
                  />
                  <label className="font-semibold mr-2 text-sm">With LH</label>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Page>
  );
};

export default ViewContract;
