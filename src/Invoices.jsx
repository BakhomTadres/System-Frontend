import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "./Components/SideBar";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function Invoices() {
  const [sales, setSales] = useState([]);
  const [sale, setSale] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const invoiceRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
  });

  async function fetchSales() {
    try {
      const res = await axios.get(
        "https://system-backend-makarios.vercel.app/api/sales",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setLoading(false);

      setSales(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchSales();
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
              الفواتير
            </h1>
            <p className="text-gray-500 text-md font-semibold mt-1">
              سجل عمليات البيع والفواتير الصادرة
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20">
                <span className="w-10 h-10 border-4 border-[#146C5E] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 text-sm">جاري تحميل الفواتير...</p>
              </div>
            ) : sales.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
                <span className="text-4xl">🧾</span>
                <p className="text-[#1F2933] font-bold">لا توجد فواتير بعد</p>
                <p className="text-gray-500 text-sm">
                  ستظهر هنا الفواتير بمجرد إتمام عمليات البيع
                </p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-md font-semibold border-b border-gray-100">
                      <th className="py-3 px-4 text-center">رقم الفاتورة</th>
                      <th className="py-3 px-4 text-center">التاريخ</th>
                      <th className="py-3 px-4 text-center">الإجمالي</th>
                      <th className="py-3 px-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sales.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 font-display font-bold text-[#1F2933] text-center">
                          {item.invoiceNumber}
                        </td>

                        <td className="py-3 px-4 text-gray-500 text-center">
                          {new Date(item.createdAt).toLocaleDateString("en-GB")}
                        </td>

                        <td className="py-3 px-4 font-display font-bold text-[#146C5E] text-center">
                          {item.totalSale} جنيه
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              setSale(item);
                              setShowInvoice(true);
                              setTimeout(() => {
                                handlePrint();
                              }, 300);
                            }}
                            className="bg-[#146C5E] hover:bg-[#0F544A] text-white text-sm font-bold py-1.5 px-4 rounded-lg transition-colors cursor-pointer"
                          >
                            عرض
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showInvoice && sale && (
        <div
          onClick={() => setShowInvoice(false)}
          className="fixed inset-0 bg-[#1F2933]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            ref={invoiceRef}
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-[400px] rounded-2xl shadow-2xl p-6 pb-8 font-body"
          >
            <h2 className="text-center font-display text-2xl font-bold text-[#1F2933]">
              الهندسية لقطع غيار السيارات
            </h2>

            <p className="text-center text-gray-500 text-sm mt-1">
              فاتورة {sale.invoiceNumber}#
            </p>

            <p className="text-center text-gray-400 text-xs mb-5">
              {new Date(sale.createdAt).toLocaleDateString("en-GB")}
            </p>

            <hr className="border-gray-100" />

            <div className="mt-4 space-y-3">
              {sale.products.map((item) => (
                <div key={item.barcode} className="flex justify-between">
                  <div>
                    <p className="font-semibold text-[#1F2933]">{item.name}</p>

                    <p className="text-sm text-gray-500">
                      {item.quantity} × {item.sellPrice} ج
                    </p>
                  </div>

                  <span className="font-display font-bold text-[#1F2933]">
                    {item.quantity * item.sellPrice} ج
                  </span>
                </div>
              ))}
            </div>

            <hr className="my-4 border-gray-100" />

            <div className="space-y-4">
              <div className="flex justify-between font-display font-bold text-[#146C5E] text-lg">
                <span>إجمالي البيع</span>

                <span>{sale.totalSale} ج</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
