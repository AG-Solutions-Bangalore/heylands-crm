import * as React from "react";
import {
  AudioWaveform,
  BadgeIndianRupee,
  Blocks,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  NotebookText,
  ReceiptText,
  Settings,
  Settings2,
  TicketPlus,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMainUser } from "./nav-main-user";
import { useSelector } from "react-redux";

const isItemAllowed = (item, pageControl, userId) => {
  if (!Array.isArray(pageControl)) return false;

  const itemUrl = item.url?.replace(/^\//, "").replace(/\\/g, "");

  return pageControl.some((control) => {
    const controlUrl = control.url?.replace(/^\//, "").replace(/\\/g, "");

    return (
      control.page === item.title &&
      controlUrl === itemUrl &&
      control.userIds.includes(userId) &&
      control.status === "Active"
    );
  });
};

const filterMenuItems = (items, pageControl, userId) => {
  if (!items) return [];

  return items.reduce((acc, item) => {
    if (item.items) {
      const filteredItems = filterMenuItems(item.items, pageControl, userId);
      if (filteredItems.length > 0) {
        acc.push({
          ...item,
          items: filteredItems,
        });
      }
    } else if (isItemAllowed(item, pageControl, userId)) {
      acc.push(item);
    } else {
    }
    return acc;
  }, []);
};

export function AppSidebar({ ...props }) {
  const nameL = useSelector((state) => state.auth.name);
  const emailL = useSelector((state) => state.auth.email);
  const companyName = useSelector((state) => state.auth.company_name);
  const userId = String(useSelector((state) => state.auth.id));

  const pageControlRaw = useSelector(
    (state) => state.permissions?.pagePermissions
  );

  const pageControl = React.useMemo(() => {
    try {
      if (typeof pageControlRaw !== "string" || !pageControlRaw.trim())
        return [];
      return JSON.parse(pageControlRaw);
    } catch (e) {
      console.error("Failed to parse pageControl:", e);
      return [];
    }
  }, [pageControlRaw]);

  const initialData = {
    user: {
      name: `${nameL}`,
      email: `${emailL}`,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: `${companyName}`,
        logo: GalleryVerticalEnd,
        plan: "",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/home",
        icon: Frame,
        isActive: false,
      },
      {
        title: "Master",
        url: "#",
        isActive: false,
        icon: Settings2,
        items: [
          {
            title: "Company",
            url: "/master/branch",
          },
          {
            title: "State",
            url: "/master/state",
          },
          {
            title: "Bank",
            url: "/master/bank",
          },
          {
            title: "Buyer",
            url: "/master/buyer",
          },
          {
            title: "Scheme",
            url: "/master/scheme",
          },
          {
            title: "Country",
            url: "/master/country",
          },
          {
            title: "Container Size",
            url: "/master/containersize",
          },
          {
            title: "Payment TermsC",
            url: "/master/paymentTermC",
          },

          {
            title: "Bag Type",
            url: "/master/bagType",
          },

          {
            title: "Item",
            url: "/master/item",
          },
          {
            title: "Marking",
            url: "/master/marking",
          },
          {
            title: "Port of Loading",
            url: "/master/portofloading",
          },
          {
            title: "GR Code",
            url: "/master/grcode",
          },
          {
            title: "Product",
            url: "/master/product",
          },

          {
            title: "Shipper",
            url: "/master/shipper",
          },
          {
            title: "Vessel",
            url: "/master/vessel",
          },
          {
            title: "Pre Recepits",
            url: "/master/prerecepits",
          },

          {
            title: "Order Type",
            url: "/master/order-type",
          },
          {
            title: "Item Category",
            url: "/master/item-category",
          },
          {
            title: "Item Packing",
            url: "/master/item-packing",
          },
          {
            title: "Item Box",
            url: "/master/item-box",
          },
        ],
      },
      {
        title: "Contract",
        url: "/contract",
        icon: Blocks,
        isActive: false,
      },
      {
        title: "Invoice",
        url: "/invoice",
        icon: NotebookText,
        isActive: false,
      },

      {
        title: "Reports",
        url: "#",
        icon: ReceiptText,
        isActive: false,
        items: [
          {
            title: "BuyerR",
            url: "/report/buyer-report",
          },

          {
            title: "Sales Accounts",
            url: "/report/sales-account-form",
          },
          {
            title: "DutyDrawBack",
            url: "/report/duty-drawback",
          },
        ],
      },
    ],

    userManagement: [
      {
        name: "User Management",
        url: "/userManagement",
        icon: Frame,
      },
      {
        name: "UserType",
        url: "/user-type",
        icon: Settings,
      },
    ],
  };

  const filteredNavMain = filterMenuItems(
    initialData.navMain,
    pageControl,
    userId
  );

  const filteredUserManagement = filterMenuItems(
    initialData.userManagement.map((p) => ({
      title: p.name,
      url: p.url,
    })),
    pageControl,
    userId
  ).map((p) => ({
    name: p.title,
    url: p.url,
    icon:
      initialData.userManagement.find((orig) => orig.name == p.title)?.icon ||
      Frame,
  }));

  const data = {
    ...initialData,
    navMain: filteredNavMain,
    userManagement: filteredUserManagement,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="sidebar-content">
        <NavMain items={data.navMain} />
        <NavMainUser projects={data.userManagement} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
