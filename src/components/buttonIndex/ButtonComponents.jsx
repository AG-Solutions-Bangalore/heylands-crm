import { Button } from "@/components/ui/button";
import {
  Download,
  Edit,
  Eye,
  FilePlus2,
  MinusCircle,
  Printer,
  SquarePlus,
  Trash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { checkPermission } from "./checkPermission";
import React, { forwardRef } from "react";
import { useSelector } from "react-redux";

// const getStaticPermissions = () => {
//   const buttonPermissions = useSelector(
//     (state) => state.permissions?.buttonPermissions
//   );
//   try {
//     return buttonPermissions ? JSON.parse(buttonPermissions) : [];
//   } catch (error) {
//     console.error(
//       "Error parsing StaticPermission data from localStorage",
//       error
//     );
//     return [];
//   }
// };
const getStaticPermissions = () => {
  const buttonPermissions = useSelector(
    (state) => state.permissions?.buttonPermissions
  );

  try {
    if (typeof buttonPermissions === "string" && buttonPermissions.trim()) {
      return JSON.parse(buttonPermissions);
    }
    return [];
  } catch (error) {
    console.error("Error parsing StaticPermission data from Database", error);
    return [];
  }
};

////////invoice
export const InvoiceCreate = ({ onClick, className }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "InvoiceCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Invoice
    </Button>
  );
};
InvoiceCreate.page = "Invoice";

export const InvoiceEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();

  if (!checkPermission(userId, "InvoiceEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});
InvoiceEdit.page = "Invoice";

// ===================== InvoiceView =====================
export const InvoiceView = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();

  if (!checkPermission(userId, "InvoiceView", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      title="View"
      variant="ghost"
      size="icon"
    >
      <Eye className="h-4 w-4 text-black" />
    </Button>
  );
});
InvoiceView.page = "Invoice";

// ===================== InvoiceDocument =====================
export const InvoiceDocument = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();

  if (!checkPermission(userId, "InvoiceDocument", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      title="Invoice Document"
      variant="ghost"
      size="icon"
    >
      <FilePlus2 className="h-4 w-4 text-black" />
    </Button>
  );
});
InvoiceDocument.page = "Invoice";

// ===================== InvoiceDelete =====================
export const InvoiceDelete = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();

  if (!checkPermission(userId, "InvoiceDelete", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      title="Invoice Delete"
      variant="ghost"
      size="icon"
    >
      <Trash className="h-4 w-4 text-red-500" />
    </Button>
  );
});
InvoiceDelete.page = "Invoice";
////////contract
export const ContractCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ContractCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Contract
    </Button>
  );
};
ContractCreate.page = "Contract";

// ===================== ContractEdit =====================
export const ContractEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();

  if (!checkPermission(userId, "ContractEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});
ContractEdit.page = "Contract";

// ===================== ContractView =====================
export const ContractView = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();

  if (!checkPermission(userId, "ContractView", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      title="View"
      variant="ghost"
      size="icon"
    >
      <Eye className="h-4 w-4 text-black" />
    </Button>
  );
});
ContractView.page = "Contract";

// ===================== ContractDelete =====================
export const ContractDelete = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();

  if (!checkPermission(userId, "ContractDelete", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      title="Contract Delete"
      variant="ghost"
      size="icon"
    >
      <Trash className="h-4 w-4 text-red-500" />
    </Button>
  );
});
ContractDelete.page = "Contract";
////////MASTER-BRANCH
// export const BranchCreate = ({ onClick, className }) => {
//   const navigate = useNavigate();
//   const userId = useSelector((state) => state.auth.id);
//   const staticPermissions = getStaticPermissions();
//   if (!checkPermission(userId, "BranchCreate", staticPermissions)) {
//     return null;
//   }

//   return (
//     <Button variant="default" className={className} onClick={onClick}>
//       <SquarePlus className="h-4 w-4" /> Company
//     </Button>
//   );
// };
// BranchCreate.page = "Branch";

export const CompanyEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();

  if (!checkPermission(userId, "CompanyEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

CompanyEdit.page = "Company";

////////MASTER-State
export const StateCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "StateCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> State
    </Button>
  );
};
StateCreate.page = "State";

export const StateEdit = ({ onClick, className }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "StateEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button onClick={onClick} className={className} variant="ghost" size="icon">
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
};
StateEdit.page = "State";
////////MASTER-Bank
export const BankCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "BankCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Bank
    </Button>
  );
};
BankCreate.page = "Bank";

export const BankEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();

  if (!checkPermission(userId, "BankEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

BankEdit.page = "Bank";
///////MASTER-Buyer
export const BuyerCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "BuyerCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Buyer
    </Button>
  );
};
BuyerCreate.page = "Buyer";

export const BuyerEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();

  if (!checkPermission(userId, "BuyerEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

BuyerEdit.page = "Buyer";
////////MASTER-Scheme
export const SchemeCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "SchemeCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Scheme
    </Button>
  );
};
SchemeCreate.page = "Scheme";

export const SchemeEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();

  if (!checkPermission(userId, "SchemeEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

SchemeEdit.page = "Scheme";
////////MASTER-Country
export const CountryCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "CountryCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Country
    </Button>
  );
};
CountryCreate.page = "Country";

export const CountryEdit = forwardRef(({ onClick, className }, ref) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();

  if (!checkPermission(userId, "CountryEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
});

CountryEdit.page = "Country";
////////MASTER-Container Size
export const ContainerSizeCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ContainerSizeCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Container Size
    </Button>
  );
};
ContainerSizeCreate.page = "Container Size";

export const ContainerSizeEdit = ({ onClick, className }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ContainerSizeEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button onClick={onClick} className={className} variant="ghost" size="icon">
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
};
ContainerSizeEdit.page = "Container Size";

////////MASTER-Payment TermsC
export const PaymentTermsCCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "PaymentTermsCCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Payment TermsC
    </Button>
  );
};
PaymentTermsCCreate.page = "Payment TermsC";

export const PaymentTermsCEdit = ({ onClick, className, ref }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "PaymentTermsCEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
};
PaymentTermsCEdit.page = "Payment TermsC";

////////MASTER-Bag Type
export const BagTypeCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "BagTypeCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Bag Type
    </Button>
  );
};
BagTypeCreate.page = "Bag Type";

export const BagTypeEdit = ({ onClick, className }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "BagTypeEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button onClick={onClick} className={className} variant="ghost" size="icon">
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
};
BagTypeEdit.page = "Bag Type";
////////MASTER-Item
export const ItemCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ItemCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Item
    </Button>
  );
};
ItemCreate.page = "Item";

export const ItemEdit = ({ onClick, className }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ItemEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button onClick={onClick} className={className} variant="ghost" size="icon">
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
};
ItemEdit.page = "Item";
////////MASTER-Marking
export const MarkingCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MarkingCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Marking
    </Button>
  );
};
MarkingCreate.page = "Marking";

export const MarkingEdit = ({ onClick, className }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MarkingEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button onClick={onClick} className={className} variant="ghost" size="icon">
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
};
MarkingEdit.page = "Marking";

//
////////MASTER-Port of Loading
export const PortofLoadingCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "PortofLoadingCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Port of Loading
    </Button>
  );
};
PortofLoadingCreate.page = "Port of Loading";

export const PortofLoadingEdit = ({ onClick, className }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "PortofLoadingEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button onClick={onClick} className={className} variant="ghost" size="icon">
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
};
PortofLoadingEdit.page = "Port of Loading";
////////MASTER-GR Code
export const GRCodeCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "GRCodeCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> GR Code
    </Button>
  );
};
GRCodeCreate.page = "GR Code";

export const GRCodeEdit = ({ onClick, className }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "GRCodeEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button onClick={onClick} className={className} variant="ghost" size="icon">
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
};
GRCodeEdit.page = "GR Code";
////////MASTER-Product
export const ProductCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ProductCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Product
    </Button>
  );
};
ProductCreate.page = "Product";

export const ProductEdit = ({ onClick, className, ref }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ProductEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
};
ProductEdit.page = "Product";
////////MASTER-Order Type
export const OrderTypeCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "OrderTypeCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Order Type
    </Button>
  );
};
OrderTypeCreate.page = "Order Type";

export const OrderTypeEdit = ({ onClick, className, ref }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "OrderTypeEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
};
OrderTypeEdit.page = "Order Type";
////////MASTER-Item Category
export const ItemCategoryCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ItemCategoryCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Item Category
    </Button>
  );
};
ItemCategoryCreate.page = "Item Category";

export const ItemCategoryEdit = ({ onClick, className, ref }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ItemCategoryEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
};
ItemCategoryEdit.page = "Item Category";
////////MASTER-Item Packing
export const ItemPackingCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ItemPackingCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Item Packing
    </Button>
  );
};
ItemPackingCreate.page = "Item Packing";

export const ItemPackingEdit = ({ onClick, className, ref }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ItemPackingEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
};
ItemPackingEdit.page = "Item Packing";
////////MASTER-Item Box
export const ItemBoxCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ItemBoxCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Item Box
    </Button>
  );
};
ItemBoxCreate.page = "Item Box";

export const ItemBoxEdit = ({ onClick, className, ref }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ItemBoxEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button
      ref={ref}
      onClick={onClick}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
};
ItemBoxEdit.page = "Item Box";

////////MASTER-Shipper
export const ShipperCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ShipperCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Shipper
    </Button>
  );
};
ShipperCreate.page = "Shipper";

export const ShipperEdit = ({ onClick, className }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ShipperEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button onClick={onClick} className={className} variant="ghost" size="icon">
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
};
ShipperEdit.page = "Shipper";
////////MASTER-Vessel
export const VesselCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "VesselCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Vessel
    </Button>
  );
};
VesselCreate.page = "Vessel";

export const VesselEdit = ({ onClick, className }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "VesselEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button onClick={onClick} className={className} variant="ghost" size="icon">
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
};
VesselEdit.page = "Vessel";
////////MASTER-Pre Recepits
export const PreRecepitsCreate = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "PreRecepitsCreate", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <SquarePlus className="h-4 w-4" /> Pre Receipt
    </Button>
  );
};
PreRecepitsCreate.page = "Pre Recepits";

export const PreRecepitsEdit = ({ onClick, className }) => {
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "PreRecepitsEdit", staticPermissions)) {
    return null;
  }

  return (
    <Button onClick={onClick} className={className} variant="ghost" size="icon">
      <Edit className="h-4 w-4 text-black" />
    </Button>
  );
};
PreRecepitsEdit.page = "Pre Recepits";
////////REPORT-BuyerR
export const BuyerRDownload = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "BuyerRDownload", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <Download className="h-4 w-4" /> Download
    </Button>
  );
};
BuyerRDownload.page = "BuyerR";
export const BuyerRPrint = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "BuyerRPrint", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <Printer className="h-4 w-4" /> Print
    </Button>
  );
};
BuyerRPrint.page = "BuyerR";
////////REPORT-"SalesAccount"

export const SalesAccountDownload = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "SalesAccountDownload", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <Download className="h-4 w-4" /> Download
    </Button>
  );
};
SalesAccountDownload.page = "Sales Accounts";
export const SalesAccountView = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "SalesAccountView", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      Open Report
    </Button>
  );
};
SalesAccountView.page = "Sales Accounts";

////////REPORT-"DutuDrawBack"

export const DutyDrawBackDownload = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "DutyDrawBackDownload", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      <Download className="h-4 w-4" /> Download
    </Button>
  );
};
DutyDrawBackDownload.page = "DutyDrawBack";
export const DutyDrawBackView = ({ onClick, className }) => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "DutyDrawBackView", staticPermissions)) {
    return null;
  }

  return (
    <Button variant="default" className={className} onClick={onClick}>
      Open Report
    </Button>
  );
};
DutyDrawBackView.page = "DutyDrawBack";
export default {
  InvoiceCreate,
  InvoiceEdit,
  InvoiceView,
  InvoiceDocument,
  InvoiceDelete,
  ContractCreate,
  ContractEdit,
  ContractView,
  ContractDelete,
  CompanyEdit,
  StateCreate,
  StateEdit,
  BankCreate,
  BankEdit,
  BuyerCreate,
  BuyerEdit,
  SchemeCreate,
  SchemeEdit,
  CountryCreate,
  CountryEdit,
  ContainerSizeCreate,
  ContainerSizeEdit,
  PaymentTermsCCreate,
  PaymentTermsCEdit,
  BagTypeCreate,
  BagTypeEdit,
  ItemCreate,
  ItemEdit,
  MarkingCreate,
  MarkingEdit,
  PortofLoadingCreate,
  PortofLoadingEdit,
  GRCodeCreate,
  GRCodeEdit,
  ProductCreate,
  ProductEdit,
  OrderTypeCreate,
  OrderTypeEdit,
  ItemCategoryCreate,
  ItemCategoryEdit,
  ItemPackingCreate,
  ItemBoxCreate,
  ItemBoxEdit,
  ItemPackingEdit,
  ShipperCreate,
  ShipperEdit,
  VesselCreate,
  VesselEdit,
  PreRecepitsCreate,
  PreRecepitsEdit,
  BuyerRDownload,
  BuyerRPrint,
  SalesAccountDownload,
  SalesAccountView,
  DutyDrawBackDownload,
};
