import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./app/auth/Login";
import ContractAdd from "./app/contract/ContractAdd";
import ContractList from "./app/contract/ContractList";
import ViewContract from "./app/contract/ViewContract";
import Home from "./app/home/Home";
import InvoiceAdd from "./app/invoice/InvoiceAdd";
import InvoiceDocumentEdit from "./app/invoice/InvoiceDocumentEdit";
import InvoiceList from "./app/invoice/InvoiceList";
import BagTypeList from "./app/master/bagType/BagTypeList";
import BankList from "./app/master/bank/BankList";
import BranchList from "./app/master/branch/BranchList";
import EditBranch from "./app/master/branch/EditBranch";
import ContainerSizeList from "./app/master/ContainerSize/ContainerSizeList";
import CountryList from "./app/master/country/CountryList";
import GrCodeList from "./app/master/grcode/GrCodeList";
import ItemList from "./app/master/item/ItemList";
import MarkingList from "./app/master/marking/MarkingList";
import PaymentTermCList from "./app/master/paymentTermC/PaymentTermCList";
import PortOfLoadingList from "./app/master/portofLoading/PortofLoadingList";
import PreReceiptList from "./app/master/preReceipt/PreReceiptList";
import ProductList from "./app/master/product/ProductList";
import QualityList from "./app/master/quality/QualityList";
import SchemeList from "./app/master/scheme/SchemeList";
import ShipperList from "./app/master/shipper/ShipperList";
import StateList from "./app/master/state/StateList";
import VesselList from "./app/master/vessel/VesselList";
import Buyer from "./app/reports/buyer/Buyer";
import SalesAccountForm from "./app/reports/salesAccount/SalesAccountForm";
import SalesAccountReport from "./app/reports/salesAccount/SalesAccountReport";
import CreateButton from "./app/userManagement/CreateButton";
import CreatePage from "./app/userManagement/CreatePage";
import ManagementDashboard from "./app/userManagement/ManagementDashboard";
import UserPage from "./app/userManagement/UserPage";
import UserTypeList from "./app/UserType/UserTypeList";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import { Toaster } from "./components/ui/toaster";
import BuyerList from "./app/master/buyer/BuyerList";
import CreateItemForm from "./app/master/item/CreateItem";
import ItemBoxList from "./app/master/itemBox/ItemBoxList";
import ItemCategoryList from "./app/master/itemCategory/ItemCategoryList";
import ItemPackingList from "./app/master/itemPacking/ItemPackingList";
import OrderTypeList from "./app/master/orderType/OrderTypeList";

import DrawBackForm from "./app/reports/drawBack/DrawBackForm";
import DrawBackReport from "./app/reports/drawBack/DrawBackReport";
import EditUserType from "./app/UserType/EditUserType";
import Maintenance from "./components/common/Maintenance";
import SessionTimeoutTracker from "./components/SessionTimeoutTracker/SessionTimeoutTracker";
import BASE_URL from "./config/BaseUrl";
import ValidationWrapper from "./utils/encyrption/ValidationWrapper";
import InvoiceTabs from "./app/invoice/InvoiceView/InvoiceTabs";
import { useSelector } from "react-redux";
import VersionCheck from "./components/common/VersionCheck";

function App() {
  const navigate = useNavigate();
  const time = useSelector((state) => state.auth.token_expire_time);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/panel-logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("Logout successful:", result);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <>
      <Toaster />
      <VersionCheck />
      {/* <DisableRightClick /> */}
      <SessionTimeoutTracker expiryTime={time} onLogout={handleLogout} />
      <ValidationWrapper>
        <Routes>
          {/* Login Page        */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/maintance-mode" element={<Maintenance />} />
          {/* Dashboard  */}
          <Route path="/home" element={<Home />} />
          {/* Contract  */}
          <Route path="/contract" element={<ContractList />} />
          <Route path="/create-contract/:id" element={<ContractAdd />} />
          <Route path="/view-contract/:id" element={<ViewContract />} />
          {/* Invoice  */}
          <Route path="/invoice" element={<InvoiceList />} />
          <Route path="/create-invoice/:id" element={<InvoiceAdd />} />
          <Route
            path="/document-edit-invoice/:id"
            element={<InvoiceDocumentEdit />}
          />
          <Route path="/view-invoice/:id" element={<InvoiceTabs />} />

          <Route path="/master/branch" element={<BranchList />} />
          <Route path="/edit-branch/:id" element={<EditBranch />} />

          {/* Master -State  */}
          <Route path="/master/state" element={<StateList />} />
          {/* Master -  Bank */}
          <Route path="/master/bank" element={<BankList />} />
          {/* master -buyer  */}
          <Route path="/master/buyer" element={<BuyerList />} />
          {/* Master Scheme  */}
          <Route path="/master/scheme" element={<SchemeList />} />

          {/* Master -Country */}
          <Route path="/master/country" element={<CountryList />} />
          {/* Master -ContainerSize */}
          <Route path="/master/containersize" element={<ContainerSizeList />} />
          {/* Master -Payment Term C */}
          <Route path="/master/paymentTermC" element={<PaymentTermCList />} />

          {/* Master -Bag List */}
          <Route path="/master/bagType" element={<BagTypeList />} />

          {/* Master -items */}
          <Route path="/master/item" element={<ItemList />} />
          {/* Master -create&edit */}
          <Route path="/master/item-form/:id" element={<CreateItemForm />} />
          {/* Master -marking */}
          <Route path="/master/marking" element={<MarkingList />} />

          {/* Master -Quality  */}
          <Route path="/master/quality" element={<QualityList />} />
          {/* Master -port of  loading   */}
          <Route path="/master/portofloading" element={<PortOfLoadingList />} />
          {/* Master -gr code */}
          <Route path="/master/grcode" element={<GrCodeList />} />
          {/* Master - Product */}
          <Route path="/master/product" element={<ProductList />} />
          {/* Master - OrderType */}
          <Route path="/master/order-type" element={<OrderTypeList />} />
          {/* Master - ItemCategory */}
          <Route path="/master/item-category" element={<ItemCategoryList />} />
          {/* Master - ItemPacking */}
          <Route path="/master/item-packing" element={<ItemPackingList />} />
          {/* Master - ItemBox */}
          <Route path="/master/item-box" element={<ItemBoxList />} />

          {/* Master - shipper */}
          <Route path="/master/shipper" element={<ShipperList />} />
          {/* Master - vessel */}
          <Route path="/master/vessel" element={<VesselList />} />
          {/* Master - prerecepits*/}
          <Route path="/master/prerecepits" element={<PreReceiptList />} />

          {/* Reports -Buyer  */}
          <Route path="/report/buyer-report" element={<Buyer />} />

          {/* report - sales account  */}
          <Route
            path="/report/sales-account-form"
            element={<SalesAccountForm />}
          />

          <Route
            path="/report/sales-account-report"
            element={<SalesAccountReport />}
          />

          {/* //drawback */}
          <Route path="/report/duty-drawback" element={<DrawBackForm />} />
          <Route
            path="/report/duty-drawback/view"
            element={<DrawBackReport />}
          />


          {/* //management */}
          <Route path="/userManagement" element={<UserPage />} />
          <Route
            path="/management-dashboard/:id"
            element={<ManagementDashboard />}
          />
          <Route path="/page-management" element={<CreatePage />} />
          <Route path="/button-management" element={<CreateButton />} />
          {/* //usertype */}
          <Route path="/user-type" element={<UserTypeList />} />
          <Route path="/edit-user-type/:id" element={<EditUserType />} />
        </Routes>
      </ValidationWrapper>
    </>
  );
}

export default App;
