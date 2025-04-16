import BASE_URL from "@/config/BaseUrl";
import { getTodayDate } from "@/utils/currentDate";
import { Printer } from "lucide-react";
import moment from "moment";
import { toWords } from "number-to-words";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import logo from "../../../assets/invoice/globe.png";
import fssai from "../../../assets/invoice/fssai.png";
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
                size: A4;
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
                <td
                  className="print-body text-[10px] border border-black"
                  colSpan="100%"
                >
                  <div className="grid grid-cols-12 w-full">
                    <div className="col-span-6 grid grid-cols-12   border-r  border-black ">
                      <div className="col-span-5">
                        <div className="p-1 font-bold">Exporter</div>
                        <div className="p-1 py-4">
                          <img src={logo} alt="logo" className="w-30 h-24" />
                        </div>
                        <div>TRUST IS OUR ASSET</div>
                      </div>

                      <div className="col-span-7 ">
                        <div className="p-1 space-y-3">
                          <p> HEYLANDS EXPORTS PRIVATE LIMITED,</p>
                          <p>No. 8, PERIYA COLONY EXTN. ROAD,</p>
                          <p>ATHIPET, CHENNAI - 600 058.</p>
                          <p>CIN: U52110TN1987PTC015202</p>
                          <p>GST NO: 33AAACH2132D1ZF</p>
                          <p>EMAIL: admin@heylandsexports.com</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-6  border-black text-[10px]">
                      <div className="grid grid-cols-12 border-b border-black">
                        <div className="col-span-5 border-r border-black p-1">
                          <p className="font-semibold">Invoice No. & Date</p>
                          <p>NEL/06/2025/08.01.2025</p>
                        </div>
                        <div className="col-span-7 p-1">
                          <p className="font-semibold">Exporter's Ref.</p>
                          <p>EX/LON/123/2025</p>
                        </div>
                      </div>

                      <div className="border-b border-black p-1">
                        <p className="font-semibold">
                          Buyer's Order No. & Date
                        </p>
                        <p>NEL/06/2025/08.01.2025</p>
                      </div>

                      <div className="p-1">
                        <p className="font-semibold">Other Reference(s)</p>
                        <p>NEL/06/2025/08.01.2025</p>

                        <div className="grid grid-cols-12 mt-1">
                          <div className="col-span-7">
                            <p className="font-semibold">
                              IEC NO. : 0489011098
                            </p>
                            <p className="font-semibold mt-1">RBI NO.:000598</p>
                          </div>
                          <div className="col-span-5 flex items-center space-x-2">
                            <img
                              src={fssai}
                              alt="fssai"
                              className="w-10 h-auto object-contain"
                            />
                            <p>No: 0127623763</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="print-section">
                <td
                  className="print-body text-[10px] border border-black"
                  colSpan="100%"
                >
                  {" "}
                  <div className="grid grid-cols-2">
                    <div>
                      <div className="border-r border-black p-1 space-y-2">
                        <p>Consignee</p>
                        <p> M/S. NIRU (EUROPE) LIMITED</p>
                        <p> UNIT 11, MITCHAM INDL.ESTATE,</p>
                        <p> 85, STREATHAM ROAD, MITCHAM SURREY,</p>
                        <p> CR4 2AP,</p>
                        <p> UNITED KINGDOM</p>
                      </div>
                    </div>
                    <div>
                      <p className=" p-1">Buyer (if other than consignee)</p>
                      <p className="flex justify-center items-center min-h-16">
                        SAME AS CONSIGNEE
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="print-section">
                <td
                  className="print-body text-[10px] border border-black"
                  colSpan="100%"
                >
                  {" "}
                  <div className="grid grid-cols-2">
                    <div className="grid grid-cols-2">
                      <div className="border-r border-black p-1 ">
                        <p className="font-bold">Pre-Carriage by</p>
                        <p className="font-bold text-center mt-1"></p>
                      </div>
                      <div className="border-r border-black p-1 ">
                        <p>Place of Receipt by Pre-Carrier</p>
                        <p className="font-bold text-center mt-1">CHENNAI</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="border-r border-black p-1 ">
                        <p className="font-bold">Country of Origin of Goods</p>
                        <p className="font-bold text-center mt-2">
                          {" "}
                          <p className="font-bold text-center mt-1">INDIA</p>
                        </p>
                      </div>
                      <div className=" p-1 ">
                        <p>Country of Final Destination</p>
                        <p className="font-bold text-center mt-1">
                          UNITED KINGDOM
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr className="print-section">
                <td
                  className="print-body text-[10px] border border-black"
                  colSpan="100%"
                >
                  {" "}
                  <div className="grid grid-cols-2">
                    <div>
                      <div className="grid grid-cols-2 border-b border-black">
                        <div className="border-r border-black p-1 ">
                          <p className="font-bold">Vessel / Flight No.</p>
                          <p className="font-bold text-center mt-1"></p>
                        </div>
                        <div className="border-r border-black p-1 ">
                          <p>Port of Loading</p>
                          <p className="font-bold text-center mt-1">CHENNAI</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="border-r border-black p-1 ">
                          <p className="font-bold">Port of Discharge</p>
                          <p className="font-bold text-center mt-1"></p>
                        </div>
                        <div className="border-r border-black p-1 ">
                          <p>Final Destination</p>
                          <p className="font-bold text-center mt-1">LONDON</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className=" p-1 ">
                        <p className="font-bold">
                          Terms of Delivery and Payment
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-center mt-1">C & I</p>
                        <p className="font-bold text-center mt-1">
                          D/P TERMS ON SIGHT{" "}
                        </p>
                        <p className="font-bold text-center mt-1">
                          EXCHANGE RATE USD 86.05
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              {/* <tr className="print-section">
                <td
                  className="print-body text-[10px] border border-black p-0"
                  colSpan="100%"
                >
                  <table className="min-w-full text-xs text-center ">
                    <thead>
                      <tr>
                        <th>
                          <p className="border-b border-black text-[8px] p-0">
                            Marks & Nos. /No. & Kind of Pkgs.
                          </p>
                          <p> TOTAL PACKAGES :- 1075</p>
                        </th>
                        <th className="border-r border-black p-0">
                          <p className="border-b border-black  text-[8px]">
                            Description
                          </p>
                          <p> TOTAL PACKAGES :- 1075</p>
                        </th>
                        <th className=" px-1">Pack</th>
                        <th className="border-r border-black px-1">HSN</th>
                        <th className="border-r border-black px-1">Qty (kg)</th>
                        <th className="border-r border-black px-1">Rate</th>
                        <th className="border-r border-black px-1">USD</th>
                        <th className="border-r border-black px-1">INR</th>
                        <th className="border-r border-black px-1">Tax 5%</th>
                        <th className=" px-1">Total INR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [
                          "1-50",
                          "SURYAA ROASTED CURRY POWDER EXT.HOT",
                          "4X3 KG",
                          "09109100",
                          600,
                          0.5,
                          300,
                          25815,
                          1290.75,
                          27105.75,
                        ],
                        [
                          "51-150",
                          "SURYAA ROASTED CURRY POWDER EXT.HOT",
                          "12X500 GM",
                          "09109100",
                          600,
                          0.5,
                          300,
                          25815,
                          1290.75,
                          27105.75,
                        ],
                        [
                          "151-250",
                          "SURYAA ROASTED CURRY POWDER HOT",
                          "12X500 GM",
                          "09109100",
                          600,
                          0.5,
                          300,
                          25815,
                          1290.75,
                          27105.75,
                        ],
                        [
                          "251-500",
                          "RUS-C ROASTED RICE FLOUR",
                          "20X1 KG",
                          "11029090",
                          5000,
                          0.5,
                          2500,
                          215125,
                          10756.25,
                          225881.25,
                        ],
                        [
                          "501-700",
                          "RUS-C ROASTED RICE FLOUR",
                          "10X2 KG",
                          "11029090",
                          4000,
                          0.5,
                          2000,
                          172100,
                          8605,
                          180705,
                        ],
                        [
                          "701-800",
                          "NIRU ROASTED RED RICE FLOUR",
                          "6X3.6 KG",
                          "11029090",
                          2160,
                          0.5,
                          1080,
                          92934,
                          4646.7,
                          97580.7,
                        ],
                        [
                          "801-950",
                          "NIRU SEMIA",
                          "40X200 GM",
                          "19024090",
                          1200,
                          0.5,
                          600,
                          51630,
                          2581.5,
                          54211.5,
                        ],
                        [
                          "951-1025",
                          "NIRU VADAGAM",
                          "55X75 GM",
                          "19059090",
                          309.375,
                          0.5,
                          154.69,
                          13310.86,
                          665.54,
                          13976.4,
                        ],
                        [
                          "1026-1075",
                          "NIRU RICE FLAKES WHITE",
                          "28X400 GM",
                          "19041090",
                          560,
                          0.5,
                          280,
                          24094,
                          1204.7,
                          25298.7,
                        ],
                      ].map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className="border-t border-black py-0.5"
                            >
                              {typeof cell === "number"
                                ? cell.toLocaleString("en-IN")
                                : cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="font-semibold ">
                        <td
                          colSpan={4}
                          className="border-t border-black px-1 py-0.5 text-right"
                        >
                          Total
                        </td>
                        <td className="border-r border-t border-black px-1">
                          15,029.375
                        </td>
                        <td className="border-r border-t border-black px-1">
                          —
                        </td>
                        <td className="border-r border-t border-black px-1">
                          7,514.688
                        </td>
                        <td className="border-r border-t border-black px-1">
                          6,46,638.859
                        </td>
                        <td className="border-r border-t border-black px-1">
                          32,331.943
                        </td>
                        <td className=" border-t border-black px-1">
                          6,78,970.802
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr> */}
              <tr className="print-section">
                <td
                  colSpan="100%"
                  className="border border-black text-[10px] p-0"
                >
                  <table className="min-w-full text-[10px] text-center border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th>
                          <p className="border-b border-black text-[8px]">
                            Marks & Nos. / No. & Kind of Pkgs.
                          </p>
                          <p className="text-[10px] font-semibold">
                            TOTAL PACKAGES: 1075
                          </p>
                        </th>
                        <th>
                          <p className="border-b border-black text-[8px]">
                            Description
                          </p>
                          <p className="text-[10px] font-semibold">
                            TOTAL PACKAGES: 1075
                          </p>
                        </th>
                        <th className="border border-black px-1 py-0.5">
                          Pack
                        </th>
                        <th className="border border-black px-1 py-0.5">HSN</th>
                        <th className="border border-black px-1 py-0.5">
                          Qty (kg)
                        </th>
                        <th className="border border-black px-1 py-0.5">
                          Rate
                        </th>
                        <th className="border border-black px-1 py-0.5">USD</th>
                        <th className="border border-black px-1 py-0.5">INR</th>
                        <th className="border border-black px-1 py-0.5">
                          Tax 5%
                        </th>
                        <th className="border border-black px-1 py-0.5">
                          Total INR
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [
                          "1-50",
                          "SURYAA ROASTED CURRY POWDER EXT.HOT",
                          "4X3 KG",
                          "09109100",
                          600,
                          0.5,
                          300,
                          25815,
                          1290.75,
                          27105.75,
                        ],
                        [
                          "51-150",
                          "SURYAA ROASTED CURRY POWDER EXT.HOT",
                          "12X500 GM",
                          "09109100",
                          600,
                          0.5,
                          300,
                          25815,
                          1290.75,
                          27105.75,
                        ],
                        [
                          "151-250",
                          "SURYAA ROASTED CURRY POWDER HOT",
                          "12X500 GM",
                          "09109100",
                          600,
                          0.5,
                          300,
                          25815,
                          1290.75,
                          27105.75,
                        ],
                        [
                          "251-500",
                          "RUS-C ROASTED RICE FLOUR",
                          "20X1 KG",
                          "11029090",
                          5000,
                          0.5,
                          2500,
                          215125,
                          10756.25,
                          225881.25,
                        ],
                        [
                          "501-700",
                          "RUS-C ROASTED RICE FLOUR",
                          "10X2 KG",
                          "11029090",
                          4000,
                          0.5,
                          2000,
                          172100,
                          8605,
                          180705,
                        ],
                        [
                          "701-800",
                          "NIRU ROASTED RED RICE FLOUR",
                          "6X3.6 KG",
                          "11029090",
                          2160,
                          0.5,
                          1080,
                          92934,
                          4646.7,
                          97580.7,
                        ],
                        [
                          "801-950",
                          "NIRU SEMIA",
                          "40X200 GM",
                          "19024090",
                          1200,
                          0.5,
                          600,
                          51630,
                          2581.5,
                          54211.5,
                        ],
                        [
                          "951-1025",
                          "NIRU VADAGAM",
                          "55X75 GM",
                          "19059090",
                          309.375,
                          0.5,
                          154.69,
                          13310.86,
                          665.54,
                          13976.4,
                        ],
                        [
                          "1026-1075",
                          "NIRU RICE FLAKES WHITE",
                          "28X400 GM",
                          "19041090",
                          560,
                          0.5,
                          280,
                          24094,
                          1204.7,
                          25298.7,
                        ],
                      ].map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className="border-b border-black px-1 py-0.5"
                            >
                              {typeof cell === "number"
                                ? cell.toLocaleString("en-IN")
                                : cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="font-semibold bg-gray-200">
                        <td
                          colSpan={4}
                          className="border border-black text-right px-1 py-0.5"
                        >
                          Total
                        </td>
                        <td className="border border-black px-1">15,029.375</td>
                        <td className="border border-black px-1">—</td>
                        <td className="border border-black px-1">7,514.688</td>
                        <td className="border border-black px-1">
                          6,46,638.859
                        </td>
                        <td className="border border-black px-1">32,331.943</td>
                        <td className="border border-black px-1">
                          6,78,970.802
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
