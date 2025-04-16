import BASE_URL from "@/config/BaseUrl";
import { getTodayDate } from "@/utils/currentDate";
import { Printer } from "lucide-react";
import moment from "moment";
import { toWords } from "number-to-words";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import logo from "../../../assets/invoice/globe.png";
import {
  WithoutErrorComponent,
  WithoutLoaderComponent,
} from "@/components/LoaderComponent/LoaderComponent";
import { decryptId } from "@/utils/encyrption/Encyrption";
import useApiToken from "@/components/common/useApiToken";
import { useFetchInvoice } from "@/hooks/useApi";
const InvoiceView = () => {
  const containerRef = useRef();
  const { id } = useParams();
  const decryptedId = decryptId(id);
  const token = useApiToken();
  const [invoiceData, setInvoiceData] = useState({});
  const [invoiceSubData, setInvoiceSubData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { data: fetchInvoiceData } = useFetchInvoice(decryptedId);
  useEffect(() => {
    setInvoiceData(fetchInvoiceData?.invoice);
    setInvoiceSubData(fetchInvoiceData?.invoiceSub);
  }, [fetchInvoiceData]);

  const handlPrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "invoice",
    pageStyle: `
                @page {
                size: A4 landscape;
                margin: 5mm;
                
              }
              @media print {
                body {
                  border: 0px solid #000;
                      font-size: 10px; 
                  margin: 0mm;
                  padding: 0mm;
                  min-height: 100vh;
                }
                   table {
                   font-size: 11px;
                 }
                .print-hide {
                  display: none;
                }
               
              }
              `,
  });

  if (loading) {
    return <WithoutLoaderComponent name="Invoice  Data" />;
  }

  if (error) {
    return (
      <WithoutErrorComponent
        message="Error Fetching Invoice Data"
        refetch={() => fetchInvoiceData}
      />
    );
  }

  return (
    <div>
      <div>
        <button
          onClick={handlPrintPdf}
          className="fixed top-5 right-10 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600"
        >
          <Printer className="h-4 w-4" />
        </button>
      </div>
      <div className="flex w-full p-2 gap-2 relative">
        <div ref={containerRef} className="w-full print-container">
          <table className="w-full table-fixed">
            <thead>
              <tr>
                <td colSpan="100%" className="text-center py-2">
                  <p className="font-bold">INVOICE</p>
                  <p className="font-bold">
                    SUPPLYMENT FOR EXPORT WITH PAYMENT OF IGST.
                  </p>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr className="print-section">
                <td className="print-body text-[12px]" colSpan="100%">
                  <div className="grid grid-cols-12 w-full gap-2 p-4">
                    {/* Left Side (col-span-7) */}
                    <div className="col-span-7 grid grid-rows-3 gap-y-4 pr-4">
                      {/* Row 1: Exporter & Logo */}
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-5 space-y-2">
                          <div className="font-bold text-sm">Exporter</div>
                          <img
                            src={logo}
                            alt="logo"
                            className="w-28 h-24 object-contain"
                          />
                          <div className="text-[11px] italic">
                            TRUST IS OUR ASSET
                          </div>
                        </div>
                        <div className="col-span-7 text-[11px] space-y-1 leading-snug">
                          <p>HEYLANDS EXPORTS PRIVATE LIMITED,</p>
                          <p>No. 8, PERIYA COLONY EXTN. ROAD,</p>
                          <p>ATHIPET, CHENNAI - 600 058.</p>
                          <p>CIN: U52110TN1987PTC015202</p>
                          <p>GST NO: 33AAACH2132D1ZF</p>
                          <p>EMAIL: admin@heylandsexports.com</p>
                        </div>
                      </div>

                      {/* Row 2: Bank Info */}
                      <div className="grid grid-cols-12 gap-2 text-[11px]">
                        <div className="col-span-12">
                          <p>
                            <span className="font-semibold">Bank:</span> HDFC
                            Bank, A/C No: XXXXXXX
                          </p>
                        </div>
                      </div>

                      {/* Row 3: State & PAN */}
                      <div className="grid grid-cols-12 gap-2 text-[11px]">
                        <div className="col-span-6">
                          <p>
                            <span className="font-semibold">State:</span> Tamil
                            Nadu
                          </p>
                        </div>
                        <div className="col-span-6">
                          <p>
                            <span className="font-semibold">PAN:</span>{" "}
                            ABCDE1234F
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Side (col-span-5) */}
                    <div className="col-span-5 flex flex-col justify-between text-[11px] space-y-4">
                      <div>
                        <p className="font-semibold">Inv. No. & Dt:</p>
                        <p>Exporter's Ref.: EX/LON/123/2025</p>
                      </div>

                      <div>
                        <p className="font-semibold">Buyer:</p>
                        <p>XYZ Traders Pvt. Ltd., Mumbai</p>
                      </div>

                      <div>
                        <p className="font-semibold">Destination:</p>
                        <p>London, United Kingdom</p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
