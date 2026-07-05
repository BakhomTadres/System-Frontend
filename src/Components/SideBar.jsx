import { useNavigate, useLocation } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  FileText,
  LayoutDashboard,
  LogOut,
  Wrench,
  User,
} from "lucide-react";

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { path: "/products", label: "المنتجات", icon: Package },
    { path: "/cashier", label: "بيع", icon: ShoppingCart },
    { path: "/invoices", label: "الفواتير", icon: FileText },
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <>
      <style>{`
        .font-display { font-family: 'Cairo', sans-serif; }
        .font-body { font-family: 'Tajawal', sans-serif; }
      `}</style>
      <div
        dir="rtl"
        className="bg-[#111827] text-gray-300 fixed min-h-screen w-[20vw] px-4 py-7 flex flex-col font-body shadow-2xl"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-9">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-[#146C5E]/15 border border-[#146C5E]/30 flex items-center justify-center">
            <Wrench className="w-5 h-5 md:w-6 md:h-6 text-[#1F9D85]" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-base md:text-lg font-extrabold text-white leading-tight">
              الهندسية لقطع غيار السيارات
            </h2>
            <p className="text-gray-500 text-xs md:text-sm font-medium mt-0.5">
              القائمة الجانبية
            </p>
          </div>
        </div>

        {/* Navigation */}
        <ul className="space-y-1.5 flex-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <li
                key={path}
                onClick={() => navigate(path)}
                className={`group flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-sm md:text-[15px] font-semibold cursor-pointer transition-all duration-200 border-l-4 ${
                  isActive
                    ? "bg-[#146C5E]/20 text-white border-[#1F9D85] shadow-inner"
                    : "text-gray-400 border-transparent hover:bg-white/5 hover:text-white hover:border-[#1F9D85]/40"
                }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] md:w-5 md:h-5 shrink-0 transition-colors ${
                    isActive ? "text-[#1F9D85]" : "text-gray-500 group-hover:text-[#1F9D85]"
                  }`}
                  strokeWidth={2}
                />
                {label}
              </li>
            );
          })}
        </ul>

        {/* Admin profile */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2 mb-3">
            <div className="w-9 h-9 shrink-0 rounded-full bg-[#146C5E]/20 border border-[#146C5E]/30 flex items-center justify-center">
              <User className="w-4 h-4 text-[#1F9D85]" strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">المدير</p>
              <p className="text-xs text-gray-500 truncate">مسؤول النظام</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 transition-colors duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" strokeWidth={2.25} />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </>
  );
}