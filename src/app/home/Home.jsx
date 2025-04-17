import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import {
  FileText,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import Page from "../dashboard/page";
import BASE_URL from "@/config/BaseUrl";
import {
  ErrorComponent,
  LoaderComponent,
} from "@/components/LoaderComponent/LoaderComponent";
import useApiToken from "@/components/common/useApiToken";

const StatCard = ({ title, value, icon: Icon, className }) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-yellow-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </CardContent>
  </Card>
);

const EnquiryTable = ({ enquiries }) => (
  <Card className="mt-6">
    <CardHeader>
      <CardTitle className="text-lg">Recent Enquiries</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-yellow-500">
            <TableRow>
              <TableHead className="font-medium text-black">Customer</TableHead>
              <TableHead className="font-medium text-black">Branch</TableHead>
              <TableHead className="font-medium text-black">
                Reference
              </TableHead>
              <TableHead className="font-medium text-black">Date</TableHead>
              <TableHead className="font-medium text-black">Products</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.map((enquiry, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {enquiry.customer_name}
                </TableCell>
                <TableCell>{enquiry.branch_short}</TableCell>
                <TableCell>{enquiry.enquiry_ref}</TableCell>
                <TableCell>{enquiry.enquiry_date}</TableCell>
                <TableCell>{enquiry.product_names}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

const Home = () => {
  const token = useApiToken();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/panel-fetch-dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      return response.json();
    },
  });

  if (isLoading) {
    return <LoaderComponent name="dashboard Data" />; // ✅ Correct prop usage
  }

  // Render error state
  if (isError) {
    return <ErrorComponent message="Error Fetching dashboard  Data" />;
  }

  return (
    <Page>
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Contract"
            value={data.contract_count}
            icon={FileText}
          />
          <StatCard
            title="Invoice"
            value={data.invoice_count}
            icon={ClipboardCheck}
          />
          {/* <StatCard
            title="Confirmed"
            value={data.confirmed_count}
            icon={CheckCircle}
          />
          <StatCard
            title="Closed"
            value={data.closed_count}
            icon={XCircle}
          /> */}
        </div>

        {/* <EnquiryTable enquiries={data.enquiry} /> */}
      </div>
    </Page>
  );
};

export default Home;
