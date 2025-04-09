import Page from "@/app/dashboard/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BASE_URL from "@/config/BaseUrl";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { ArrowUpDown, ChevronDown, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonConfig } from "@/config/ButtonConfig";
import moment from "moment";
import DutyDrawBackEdit from "./DutyDrawBackEdit";
import {
  ErrorComponent,
  LoaderComponent,
} from "@/components/LoaderComponent/LoaderComponent";

const DutyDrawBackPending = () => {
  const {
    data: pending,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["pending"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-duty-drawback-list/Pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.dutyDrawback;
    },
  });

  // State for table management
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  // Define columns for the table
  const columns = [
    {
      accessorKey: "index",
      header: "Sl No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "branch_short",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("branch_short")}</div>,
    },

    {
      accessorKey: "invoice_date",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("invoice_date");
        return date ? moment(date).format("DD-MMM-YYYY") : "";
      },
    },
    {
      accessorKey: "invoice_no",
      header: "Invoice No",
      cell: ({ row }) => <div>{row.getValue("invoice_no")}</div>,
    },
    {
      accessorKey: "invoice_bl_no",
      header: "Bl No",
      cell: ({ row }) => <div>{row.getValue("invoice_bl_no")}</div>,
    },

    {
      accessorKey: "invoice_bl_date",
      header: "Bl Date",
      cell: ({ row }) => {
        const date = row.getValue("invoice_bl_date");
        return date ? moment(date).format("DD-MMM-YYYY") : "";
      },
    },
    {
      accessorKey: "invoice_sb_no",
      header: "SB No",
      cell: ({ row }) => <div>{row.getValue("invoice_sb_no")}</div>,
    },

    {
      accessorKey: "invoice_sb_date",
      header: "SB Date",
      cell: ({ row }) => {
        const date = row.getValue("invoice_sb_date");
        return date ? moment(date).format("DD-MMM-YYYY") : "";
      },
    },

    {
      accessorKey: "invoice_status",
      header: "Invoice Status",
      cell: ({ row }) => <div>{row.getValue("invoice_status")}</div>,
    },
    {
      accessorKey: "invoice_dd_scroll_no",
      header: "DD Scrool No",
      cell: ({ row }) => <div>{row.getValue("invoice_dd_scroll_no")}</div>,
    },
    {
      accessorKey: "invoice_dd_date",
      header: "DD Date",
      cell: ({ row }) => {
        const date = row.getValue("invoice_dd_date");
        return date ? moment(date).format("DD-MMM-YYYY") : "";
      },
    },

    {
      accessorKey: "invoice_dd_status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("invoice_dd_status");

        return (
          <span
            className={`px-2 py-1 rounded text-xs ${
              status == "Active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const pendingId = row.original.id;

        return (
          <div className="flex flex-row">
            <DutyDrawBackEdit pendingId={pendingId} />
          </div>
        );
      },
    },
  ];

  // Create the table instance
  const table = useReactTable({
    data: pending || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
  });

  // Render loading state
  if (isLoading) {
    return <LoaderComponent name="Pending Data" />; // ✅ Correct prop usage
  }

  // Render error state
  if (isError) {
    return <ErrorComponent message="Error Pending Data" refetch={refetch} />;
  }

  return (
    <Page>
      <div className="flex text-left text-2xl text-gray-800 font-[400]">
        Pending List
      </div>

      {/* searching and column filter  */}
      <div className="flex items-center py-4">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search pending..."
            value={table.getState().globalFilter || ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="pl-8 bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto ">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full p-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={` ${ButtonConfig.tableHeader} ${ButtonConfig.tableLabel}`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* row slection and pagintaion button  */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Total Pending : &nbsp;
            {table.getFilteredRowModel().rows.length}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default DutyDrawBackPending;
