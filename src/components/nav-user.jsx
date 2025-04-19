import {
  ArrowRight,
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "@/config/BaseUrl";
import useApiToken from "./common/useApiToken";
import axios from "axios";
import { logout } from "@/redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { persistor } from "@/redux/store/store";
import { useToast } from "@/hooks/use-toast";
import { setShowUpdateDialog } from "@/redux/slice/versionSlice";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const user_position = useSelector((state) => state.auth.user_position);
  const token = useApiToken();
  const localVersion = useSelector((state) => state.auth?.version);
  const serverVersion = useSelector((state) => state?.version?.version);
  const showDialog = localVersion !== serverVersion ? true : false;
  // console.log(
  //   showDialog,
  //   "showDialog",
  //   serverVersion,
  //   "serverVersion",
  //   localVersion,
  //   "localVersion"
  // );

  const handleOpenDialog = () => {
    dispatch(
      setShowUpdateDialog({
        showUpdateDialog: true,
        version: serverVersion,
      })
    );
  };
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/panel-logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.code === 200) {
        toast({
          title: "Sucess",
          description: res.data.msg || "You have been logged out.",
        });

        await persistor.flush();
        localStorage.clear();
        dispatch(logout());
        navigate("/");
        setTimeout(() => persistor.purge(), 1000);
      } else {
        toast({
          title: "Logout Failed",
          description: res.data.msg || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout Error",
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const splitUser = user.name;
  const intialsChar = splitUser
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {showDialog ? (
          <div
            className="rounded-lg bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black px-4 py-2 animate-pulse w-full cursor-pointer h-10"
            onClick={handleOpenDialog}
          >
            <div className="grid text-left text-sm leading-tight">
              <span className="flex items-center gap-1 font-semibold truncate text-base">
                V{localVersion}
                <ArrowRight className="w-4 h-4" />V{serverVersion}
              </span>
            </div>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-yellow-500 text-black">
                    {intialsChar}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user_position}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg bg-yellow-500 text-black">
                      {intialsChar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuGroup>
                <DropdownMenuItem className="rounded-lg bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black p-2">
                  <Sparkles />v{serverVersion}
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <CreditCard />
                  Updated on: Apr 19, 2025
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                <span className="cursor-pointer">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
