import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "./Components/SideBar";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  async function fetchStats() {
    try {
      const res = await axios.get(
        "https://system-backend-makarios.vercel.app/api/sales/dashboard-stats",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setStats(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      <style>{`
        .font-display { font-family: 'Cairo', sans-serif; }
        .font-body { font-family: 'Tajawal', sans-serif; }
      `}</style>
      <div dir="rtl" className="flex min-h-screen font-body">
        <div className="w-[20%] border-r border-gray-100 bg-white">
          <SideBar />
        </div>
        <div className="flex-1 bg-gray-50 p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-extrabold text-[#1F2933]">
              لوحة التحكم
            </h1>
            <p className="text-gray-500 text-md font-semibold mt-1">
              نظرة عامة على المبيعات والأرباح
            </p>
          </div>
          {!stats ? (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-3 bg-gray-50">
              <span className="w-10 h-10 border-4 border-[#146C5E] border-t-transparent rounded-full animate-spin" />
              <h1 className="text-gray-500 text-sm">جاري التحميل...</h1>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <h2 className="text-gray-500 text-md font-semibold">
                  💰 مبيعات اليوم
                </h2>

                <p className="font-display text-3xl font-extrabold mt-3 text-[#146C5E]">
                  {stats.today.totalSales} ج
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <h2 className="text-gray-500 text-md font-semibold">
                  📈 ربح اليوم
                </h2>

                <p className="font-display text-3xl font-extrabold mt-3 text-green-600">
                  {stats.today.totalProfit} ج
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <h2 className="text-gray-500 text-md font-semibold">
                  📅 مبيعات الشهر
                </h2>

                <p className="font-display text-3xl font-extrabold mt-3 text-blue-600">
                  {stats.month.totalSales} ج
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <h2 className="text-gray-500 text-md font-semibold">
                  💵 ربح الشهر
                </h2>

                <p className="font-display text-3xl font-extrabold mt-3 text-green-600">
                  {stats.month.totalProfit} ج
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <h2 className="text-gray-500 text-md font-semibold">
                  📊 مبيعات آخر 3 شهور
                </h2>

                <p className="font-display text-3xl font-extrabold mt-3 text-purple-600">
                  {stats.threeMonths.totalSales} ج
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <h2 className="text-gray-500 text-md font-semibold">
                  💸 ربح آخر 3 شهور
                </h2>

                <p className="font-display text-3xl font-extrabold mt-3 text-green-600">
                  {stats.threeMonths.totalProfit} ج
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <h2 className="text-gray-500 text-md font-semibold">
                  📆 مبيعات السنة
                </h2>

                <p className="font-display text-3xl font-extrabold mt-3 text-orange-600">
                  {stats.year.totalSales} ج
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <h2 className="text-gray-500 text-md font-semibold">
                  💎 ربح السنة
                </h2>

                <p className="font-display text-3xl font-extrabold mt-3 text-green-600">
                  {stats.year.totalProfit} ج
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
