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
import CustomDescription from "./app/master/customDescription/CustomDescription";
import DescriptionGoodsList from "./app/master/descriptionGoods/DescriptionGoodsList";
import GrCodeList from "./app/master/grcode/GrCodeList";
import ItemList from "./app/master/item/ItemList";
import MarkingList from "./app/master/marking/MarkingList";
import PaymentTermCList from "./app/master/paymentTermC/PaymentTermCList";
import PortOfLoadingList from "./app/master/portofLoading/PortofLoadingList";
import PreReceiptList from "./app/master/preReceipt/PreReceiptList";
import ProductList from "./app/master/product/ProductList";
import ProductionDescriptionList from "./app/master/productDescription/ProductionDescriptionList";
import PurchaseProductList from "./app/master/purchaseProduct/PurchaseProductList";
import QualityList from "./app/master/quality/QualityList";
import SchemeList from "./app/master/scheme/SchemeList";
import ShipperList from "./app/master/shipper/ShipperList";
import StateList from "./app/master/state/StateList";
import TypeList from "./app/master/type/TypeList";
import CreateVendor from "./app/master/vendor/CreateVendor";
import VendorEdit from "./app/master/vendor/VendorEdit";
import VendorList from "./app/master/vendor/VendorList";
import VesselList from "./app/master/vessel/VesselList";
import CreatePurchaseOrder from "./app/purchaseOrder/CreatePurchaseOrder";
import PurchaseOrderList from "./app/purchaseOrder/PurchaseOrderList";
import Buyer from "./app/reports/buyer/Buyer";
import ContractForm from "./app/reports/contract/ContractForm";
import ContractReport from "./app/reports/contract/ContractReport";
import SalesAccountForm from "./app/reports/salesAccount/SalesAccountForm";
import SalesAccountReport from "./app/reports/salesAccount/SalesAccountReport";

import CreateButton from "./app/userManagement/CreateButton";
import CreatePage from "./app/userManagement/CreatePage";
import ManagementDashboard from "./app/userManagement/ManagementDashboard";
import UserPage from "./app/userManagement/UserPage";
import UserTypeList from "./app/UserType/UserTypeList";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import { Toaster } from "./components/ui/toaster";
import PaymentClose from "./payment/PaymentClose/PaymentClose";
import CreatePayment from "./payment/PaymentList/CreatePayment";
import EditPaymentList from "./payment/PaymentList/EditPaymentList";
import PaymentList from "./payment/PaymentList/PaymentList";
import PaymentView from "./payment/PaymentList/PaymentView";
import PaymentPending from "./payment/PaymentPending/PaymentPending";

import CostingList from "./app/costing/CostingList";
import CreateCosting from "./app/costing/CreateCosting";
import EditCosting from "./app/costing/EditCosting";
import ViewCosting from "./app/costing/ViewCosting";
import DutyDrawBackPending from "./app/dutydrawback/pending/DutyDrawBackPending";
import DutyDrawBackReceived from "./app/dutydrawback/received/DutyDrawBackReceived";
import BuyerList from "./app/master/buyer/BuyerList";
import CreateItemForm from "./app/master/item/CreateItem";
import ItemBoxList from "./app/master/itemBox/ItemBoxList";
import ItemCategoryList from "./app/master/itemCategory/ItemCategoryList";
import ItemPackingList from "./app/master/itemPacking/ItemPackingList";
import OrderTypeList from "./app/master/orderType/OrderTypeList";
import CreateMarketDispatch from "./app/purchase/market-dispatch/CreateMarketDispatch";
import EditMarketDispatch from "./app/purchase/market-dispatch/EditMarketDispatch";
import MarketDispatch from "./app/purchase/market-dispatch/MarketDispatch";
import CreateMarketProcessing from "./app/purchase/marketProcessing/CreateMarketProcessing";
import EditMarketProcessing from "./app/purchase/marketProcessing/EditMarketProcessing";
import MarketProcessing from "./app/purchase/marketProcessing/MarketProcessing";
import CreateMarketProduction from "./app/purchase/marketProduction/CreateMarketProduction";
import EditMarketProduction from "./app/purchase/marketProduction/EditMarketProduction";
import MarketProduction from "./app/purchase/marketProduction/MarketProduction";
import CreateMarketOrder from "./app/purchase/marketPurchase/CreateMarketOrder";
import EditMarketOrder from "./app/purchase/marketPurchase/EditMarketOrder";
import MarketPurchase from "./app/purchase/marketPurchase/MarketPurchase";
import StockView from "./app/purchase/stock/StockView";
import EditPurchaseOrder from "./app/purchaseOrder/EditPurchaseOrder";
import ViewPurchaseOrder from "./app/purchaseOrder/ViewPurchaseOrder";
import DrawBackForm from "./app/reports/drawBack/DrawBackForm";
import DrawBackReport from "./app/reports/drawBack/DrawBackReport";
import MonthwisePurchaseForm from "./app/reports/monthwisePurchase/MonthwisePurchaseForm";
import MonthwisePurchaseReport from "./app/reports/monthwisePurchase/MonthwisePurchaseReport";
import MonthwisePurchaseSellerReport from "./app/reports/monthwisePurchase/MonthwisePurchaseSellerReport";
import ProductStock from "./app/reports/productStock/ProductStock";
import ProductStockView from "./app/reports/productStock/ProductStockView";
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

          {/* purchase   */}
          {/* pruchase - purchase order  */}
          <Route path="/purchase-order" element={<PurchaseOrderList />} />
          <Route
            path="/create-purchase-order"
            element={<CreatePurchaseOrder />}
          />
          <Route
            path="/view-purchase-order/:id"
            element={<ViewPurchaseOrder />}
          />
          <Route
            path="/edit-purchase-order/:id"
            element={<EditPurchaseOrder />}
          />

          {/* purchase -market purchase  */}
          <Route
            path="/purchase/market-purchase"
            element={<MarketPurchase />}
          />
          <Route path="/create-market-order" element={<CreateMarketOrder />} />
          <Route path="/edit-market-order/:id" element={<EditMarketOrder />} />

          {/* purchase -market production */}
          <Route
            path="/purchase/market-production"
            element={<MarketProduction />}
          />

          <Route
            path="/create-market-production"
            element={<CreateMarketProduction />}
          />

          <Route
            path="/edit-market-production/:id"
            element={<EditMarketProduction />}
          />

          {/* purchase -market processing  */}
          <Route
            path="/purchase/market-processing"
            element={<MarketProcessing />}
          />
          <Route
            path="/purchase/market-processing/createProcessing"
            element={<CreateMarketProcessing />}
          />
          <Route
            path="/purchase/market-processing/editProcessing/:id"
            element={<EditMarketProcessing />}
          />
          {/* purchase -market dispatch  */}

          <Route
            path="/purchase/market-dispatch/createDispatch"
            element={<CreateMarketDispatch />}
          />
          <Route
            path="/purchase/market-dispatch/editDispatch/:id"
            element={<EditMarketDispatch />}
          />
          <Route
            path="/purchase/market-dispatch"
            element={<MarketDispatch />}
          />
          <Route path="/purchase/stock" element={<StockView />} />

          {/* Master - Branch  */}

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
          {/* Master -Description of Goods */}
          <Route
            path="/master/descriptionGoods"
            element={<DescriptionGoodsList />}
          />
          {/* Master -Bag List */}
          <Route path="/master/bagType" element={<BagTypeList />} />
          {/* Master -customdescription */}
          <Route
            path="/master/customdescription"
            element={<CustomDescription />}
          />
          {/* Master -items */}
          <Route path="/master/item" element={<ItemList />} />
          {/* Master -create&edit */}
          <Route path="/master/item-form/:id" element={<CreateItemForm />} />
          {/* Master -marking */}
          <Route path="/master/marking" element={<MarkingList />} />
          {/* Master -typelist */}
          <Route path="/master/type" element={<TypeList />} />
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
          {/* Master - productdescription */}
          <Route
            path="/master/productdescription"
            element={<ProductionDescriptionList />}
          />
          {/* Master - shipper */}
          <Route path="/master/shipper" element={<ShipperList />} />
          {/* Master - vessel */}
          <Route path="/master/vessel" element={<VesselList />} />
          {/* Master - prerecepits*/}
          <Route path="/master/prerecepits" element={<PreReceiptList />} />
          {/* master - v */}
          <Route path="/master/vendor" element={<VendorList />} />
          <Route
            path="/master/vendor/create-vendor"
            element={<CreateVendor />}
          />
          <Route
            path="/master/vendor/edit-vendor/:id"
            element={<VendorEdit />}
          />

          {/* master purchase product  */}
          <Route
            path="/master/purchase-product"
            element={<PurchaseProductList />}
          />

          {/* Reports -Buyer  */}
          <Route path="/report/buyer-report" element={<Buyer />} />
          <Route path="/report/contract-form" element={<ContractForm />} />
          <Route path="/report/contract-report" element={<ContractReport />} />

          {/* report - sales account  */}
          <Route
            path="/report/sales-account-form"
            element={<SalesAccountForm />}
          />

          <Route
            path="/report/sales-account-report"
            element={<SalesAccountReport />}
          />

          {/* report monthwise purchase  */}
          <Route
            path="/report/monthwise-purchase-form"
            element={<MonthwisePurchaseForm />}
          />
          <Route
            path="/report/monthwise-purchase-report"
            element={<MonthwisePurchaseReport />}
          />
          <Route
            path="/report/monthwise-purchase-seller-report"
            element={<MonthwisePurchaseSellerReport />}
          />
          {/* //productstock */}
          <Route path="/report/product-stock" element={<ProductStock />} />
          <Route
            path="/report/product-stock/view"
            element={<ProductStockView />}
          />
          {/* //drawback */}
          <Route path="/report/duty-drawback" element={<DrawBackForm />} />
          <Route
            path="/report/duty-drawback/view"
            element={<DrawBackReport />}
          />

          {/* //payment */}
          <Route path="/payment-payment-list" element={<PaymentList />} />
          <Route path="/payment-view/:id" element={<PaymentView />} />
          <Route path="/payment-create" element={<CreatePayment />} />
          <Route path="/payment-edit/:id" element={<EditPaymentList />} />
          <Route path="/payment-payment-pending" element={<PaymentPending />} />
          <Route path="/payment-payment-close" element={<PaymentClose />} />
          {/* //dutydrawback */}
          {/* -------------Pending------------ */}
          <Route
            path="/dutydrawback/pending"
            element={<DutyDrawBackPending />}
          />
          {/* -------------Received------------ */}

          <Route path="/costing" element={<CostingList />} />
          <Route path="/costing-create" element={<CreateCosting />} />
          <Route path="/costing-edit/:id" element={<EditCosting />} />
          <Route path="/costing-view/:id" element={<ViewCosting />} />
          {/* //costing */}
          <Route
            path="/dutydrawback/received"
            element={<DutyDrawBackReceived />}
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
