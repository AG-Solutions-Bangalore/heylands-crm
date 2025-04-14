import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function CTNDialogComponent({ invoiceData, setInvoiceData }) {
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);

  const handleCTNClick = () => {
    const hasEmptyCarton = invoiceData.some(
      (item) => !item.invoiceSub_ctns || item.invoiceSub_ctns.trim() === ""
    );

    if (hasEmptyCarton) {
      toast({
        title: "Error",
        description:
          "Please fill in the 'Cartons' for all items before generating CTN.",
        variant: "destructive",
      });
    } else {
      setConfirmOpen(true);
    }
  };

  const handleGenerate = () => {
    setConfirmOpen(false);
    setTableDialogOpen(true);
  };

  const handleSaveAndExit = () => {
    let start = 1;
    const updatedInvoiceData = invoiceData.map((row) => {
      const count = parseInt(row.invoiceSub_ctns, 10) || 0;
      const end = start + count - 1;
      const range = count > 0 ? `${start}-${end}` : "";

      const updatedRow = {
        ...row,
        invoiceSub_ct: range,
      };

      start = end + 1;
      return updatedRow;
    });
    setInvoiceData(updatedInvoiceData);
    setTableDialogOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        type="button"
        onClick={handleCTNClick}
        className={`mt-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
      >
        CTN No
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you need to generate?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            >
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table Dialog */}
      <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate CTN</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto border rounded max-h-[34rem] overflow-y-auto">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="p-1 text-center border font-medium whitespace-nowrap">
                    CTN
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  let cumulativeStart = 1;
                  return invoiceData.map((row, rowIndex) => {
                    const cartonCount = parseInt(row.invoiceSub_ctns, 10) || 0;
                    const rangeStart = cumulativeStart;
                    const rangeEnd = cumulativeStart + cartonCount - 1;
                    cumulativeStart = rangeEnd + 1;

                    return (
                      <TableRow key={rowIndex} className="hover:bg-gray-50">
                        <TableCell className="p-2 border text-center">
                          {`${rangeStart}-${rangeEnd}`}
                        </TableCell>
                      </TableRow>
                    );
                  });
                })()}
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTableDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAndExit}
              className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            >
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
