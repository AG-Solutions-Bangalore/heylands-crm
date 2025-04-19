import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
export default function Page({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleBackClick = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex flex-row  justify-between  h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 ">
            <SidebarTrigger className="-ml-1 hover:bg-yellow-100" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  {/* <BreadcrumbLink href="#" onClick={handleBackClick} >
                    Home
                  </BreadcrumbLink> */}
                  {pathname != "/home" && (
                    <BreadcrumbLink
                      href="#"
                      onClick={handleBackClick}
                      className="flex items-center gap-2 text-muted-foreground hover:text-yellow-900"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Brand</BreadcrumbPage>
                </BreadcrumbItem> */}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1    flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl  p-2 md:min-h-min aspect-video bg-muted/50">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
