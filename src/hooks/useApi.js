import useApiToken from "@/components/common/useApiToken";
import BASE_URL from "@/config/BaseUrl";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const STALE_TIME = 5 * 60 * 1000;
const CACHE_TIME = 30 * 60 * 1000;

const fetchData = async (endpoint, token) => {
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error(`Failed to fetch data from ${endpoint}`);
  return response.json();
};

const createQueryConfig = (queryKey, endpoint, options = {}) => {
  const token = useApiToken();
  return {
    queryKey,
    queryFn: () => fetchData(endpoint, token),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    retry: 2,
    ...options,
  };
};

export const useFetchBuyers = () => {
  return useQuery(createQueryConfig(["buyer"], "/api/panel-fetch-buyer"));
};

export const useFetchCompanys = () => {
  return useQuery(createQueryConfig(["branch"], "/api/panel-fetch-branch"));
};
export const useFetchProduct = () => {
  return useQuery(createQueryConfig(["product"], "/api/panel-fetch-product"));
};

export const useFetchContractNos = (company_sort) => {
  const queryClient = useQueryClient();

  const query = useQuery(
    createQueryConfig(
      ["contractnoss", company_sort],
      `/api/panel-fetch-contract-no/${company_sort}`,
      {
        enabled: Boolean(company_sort),
      }
    )
  );

  const prefetchNextContractNos = async () => {
    if (company_sort) {
      await queryClient.prefetchQuery(
        createQueryConfig(
          ["contractnoss", company_sort],
          `/api/panel-fetch-contract-no/${company_sort}`
        )
      );
    }
  };

  return { ...query, prefetchNextContractNos };
};
export const useFetchProductNos = (company_sort) => {
  const queryClient = useQueryClient();

  const query = useQuery(
    createQueryConfig(
      ["productnoss", company_sort],
      `/api/panel-fetch-purchase-product-no/${company_sort}`,
      {
        enabled: Boolean(company_sort),
      }
    )
  );

  const prefetchNextProductNos = async () => {
    if (company_sort) {
      await queryClient.prefetchQuery(
        createQueryConfig(
          ["productnoss", company_sort],
          `/api/panel-fetch-purchase-product-no/${company_sort}`
        )
      );
    }
  };

  return { ...query, prefetchNextProductNos };
};

export const useFetchPortofLoadings = () => {
  return useQuery(
    createQueryConfig(["portofLoadings"], "/api/panel-fetch-portofLoading")
  );
};

export const useFetchContainerSizes = () => {
  return useQuery(
    createQueryConfig(["containersizes"], "/api/panel-fetch-container-size")
  );
};

// export const useFetchPaymentTerms = () => {
//   return useQuery(
//     createQueryConfig(["paymentTerms"], "/api/panel-fetch-paymentTermsC")
//   );
// };

export const useFetchPorts = () => {
  return useQuery(
    createQueryConfig(["ports"], "/api/panel-fetch-country-port")
  );
};

export const useFetchCountrys = () => {
  return useQuery(createQueryConfig(["country"], "/api/panel-fetch-country"));
};

export const useFetchMarkings = () => {
  return useQuery(createQueryConfig(["markings"], "/api/panel-fetch-marking"));
};

export const useFetchItemNames = () => {
  return useQuery(
    createQueryConfig(["itemNames"], "/api/panel-fetch-itemname")
  );
};
export const useFetchState = () => {
  return useQuery(createQueryConfig(["state"], "/api/panel-fetch-state"));
};
export const useFetchPreReceipt = () => {
  return useQuery(
    createQueryConfig(["preReceipt"], "/api/panel-fetch-prereceipts")
  );
};
export const useFetchScheme = () => {
  return useQuery(createQueryConfig(["scheme"], "/api/panel-fetch-scheme"));
};

export const useFetchDescriptionofGoods = () => {
  return useQuery(
    createQueryConfig(
      ["descriptionofGoodss"],
      "/api/panel-fetch-descriptionofGoods"
    )
  );
};

export const useFetchBagsTypes = () => {
  return useQuery(createQueryConfig(["bagTypes"], "/api/panel-fetch-bagType"));
};

//invoice apis

export const useFetchStatus = () => {
  return useQuery(
    createQueryConfig(["status"], "/api/panel-fetch-invoice-status")
  );
};
export const useFetchVessel = () => {
  return useQuery(createQueryConfig(["vessels"], "/api/panel-fetch-vessel"));
};
export const useFetchShipper = () => {
  return useQuery(createQueryConfig(["shippers"], "/api/panel-fetch-shipper"));
};

// payment edit invoice

export const useFetchPaymentAmount = () => {
  return useQuery(
    createQueryConfig(
      ["paymentamount"],
      "/api/panel-fetch-invoice-payment-amount"
    )
  );
};

//create Team

export const useFetchCompanies = () => {
  return useQuery(createQueryConfig(["companies"], "/api/panel-fetch-company"));
};
export const useFetchUserType = () => {
  return useQuery(
    createQueryConfig(["usertype"], "/api/panel-fetch-usertypes")
  );
};

// create purchase order

export const useFetchVendor = () => {
  return useQuery(createQueryConfig(["vendor"], "/api/panel-fetch-vendor"));
};

export const useFetchPurchaseProduct = () => {
  return useQuery(
    createQueryConfig(
      ["purchaseproduct"],
      "/api/panel-fetch-purchase-order-product"
    )
  );
};

//create markting order

export const useFetchGoDownMarketPurchase = () => {
  return useQuery(
    createQueryConfig(["godownmarket"], "/api/panel-fetch-godown")
  );
};

//  purchase dorpdown

export const useFetchGoDown = () => {
  return useQuery(createQueryConfig(["godown"], "/api/panel-fetch-godown"));
};
export const useFetchDispatchDcNo = () => {
  return useQuery(
    createQueryConfig(["dispatchDcNo"], "/api/panel-fetch-market-dispatch-dcno")
  );
};

// //packing
export const useFetchPacking = () => {
  return useQuery(
    createQueryConfig(["packing"], "/api/panel-fetch-ItemPacking")
  );
};
// //country
export const useFetchCountry = () => {
  return useQuery(createQueryConfig(["country"], "/api/panel-fetch-country"));
};
// //country
export const useFetchBox = () => {
  return useQuery(createQueryConfig(["itembox"], "/api/panel-fetch-ItemBox"));
};
// //country
export const useFetchItemCategory = () => {
  return useQuery(
    createQueryConfig(["itemcategory"], "/api/panel-fetch-ItemCategory")
  );
};
//order type fpr contract
export const useFetchOrderType = () => {
  return useQuery(
    createQueryConfig(["orderType"], "/api/panel-fetch-orderType")
  );
};
//fetch payment terms in contarct
export const useFetchPaymentTerms = () => {
  return useQuery(
    createQueryConfig(["paymentTerms"], "/api/panel-fetch-payment-terms")
  );
};
//fetch payment terms in contarct
export const useFetchItemData = () => {
  return useQuery(createQueryConfig(["itemData"], "/api/panel-fetch-item"));
};
//fetch payment terms in contarct
export const useFetchSiginData = () => {
  return useQuery(
    createQueryConfig(["siginData"], "/api/panel-fetch-branches-sign-name")
  );
};
//fetch contract ref terms in invoive
export const useFetchContractRef = () => {
  return useQuery(
    createQueryConfig(["contractRef"], "/api/panel-fetch-contract-ref")
  );
};
//fetch contract ref terms in invoive
export const useFetchInvoiceStatus = () => {
  return useQuery(
    createQueryConfig(["status"], "/api/panel-fetch-invoice-status")
  );
};

// //lut code  in invoice
export const useFetchLutCode = (value) => {
  const queryClient = useQueryClient();

  const query = useQuery(
    createQueryConfig(
      ["lutcode", value],
      `/api/panel-fetch-scheme-by-value/${value}`,
      {
        enabled: Boolean(value),
      }
    )
  );

  const prefetchNextLutCode = async () => {
    if (value) {
      await queryClient.prefetchQuery(
        createQueryConfig(
          ["lutcode", value],
          `/api/panel-fetch-scheme-by-value/${value}`
        )
      );
    }
  };

  return { ...query, prefetchNextLutCode };
};
// //gr code  in invoice
export const useFetchGrCode = (value) => {
  const queryClient = useQueryClient();

  const query = useQuery(
    createQueryConfig(["grcode", value], `/api/panel-fetch-grcode/${value}`, {
      enabled: Boolean(value),
    })
  );

  const prefetchNextGrCode = async () => {
    if (value) {
      await queryClient.prefetchQuery(
        createQueryConfig(["grcode", value], `/api/panel-fetch-grcode/${value}`)
      );
    }
  };

  return { ...query, prefetchNextGrCode };
};
// //gr code  in invoice
export const useFetchInvoice = (value) => {
  const queryClient = useQueryClient();

  const query = useQuery(
    createQueryConfig(
      ["invoice", value],
      `/api/panel-fetch-invoice-by-id/${value}`,
      {
        enabled: Boolean(value),
      }
    )
  );

  const prefetchNextInvoice = async () => {
    if (value) {
      await queryClient.prefetchQuery(
        createQueryConfig(
          ["invoice", value],
          `/api/panel-fetch-invoice-by-id/${value}`
        )
      );
    }
  };

  return { ...query, prefetchNextInvoice };
};
