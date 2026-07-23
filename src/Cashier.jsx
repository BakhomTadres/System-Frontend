import { useState } from "react";
import axios from "axios";
import SideBar from "./Components/SideBar";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function Cashier() {
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState([]);
  const invoiceRef = useRef(null);
  const inputRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
  });
  async function handleScan(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      try {
        const res = await axios.get(
          `https://system-backend-makarios.vercel.app/api/products/barcode/${barcode}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const product = res.data.data.product;

        setCart((prevCart) => {
          const existingProduct = prevCart.find(
            (item) => item.barcode === product.barcode,
          );

          if (existingProduct) {
            return prevCart.map((item) =>
              item.barcode === product.barcode
                ? {
                    ...item,
                    cartQuantity: item.cartQuantity + 1,
                  }
                : item,
            );
          }

          return [
            ...prevCart,
            {
              ...product,
              cartQuantity: 1,
            },
          ];
        });
        setBarcode("");

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("المنتج غير موجود");
        setBarcode("");
      }
    }
  }
  const total = cart.reduce((sum, item) => {
    return sum + item.sellPrice * item.cartQuantity;
  }, 0);

  const increaseQuantity = (barcode) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.barcode === barcode && item.cartQuantity < item.quantity
          ? {
              ...item,
              cartQuantity: item.cartQuantity + 1,
            }
          : item,
      ),
    );
  };

  const decreaseQuantity = (barcode) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.barcode === barcode
            ? {
                ...item,
                cartQuantity: item.cartQuantity - 1,
              }
            : item,
        )
        .filter((item) => item.cartQuantity > 0),
    );
  };

  async function handleCheckOut() {
    try {
      const saleData = cart.map((item) => ({
        barcode: item.barcode,
        quantity: item.cartQuantity,
      }));

      const res = await axios.post(
        "https://system-backend-makarios.vercel.app2/api/sales",
        {
          cart: saleData,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setSale(res.data.sale);
      setShowInvoice(true);
      setCart([]);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

      setTimeout(() => {
        handlePrint();
      }, 300);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء إتمام عملية البيع");
    }
  }

  const [showInvoice, setShowInvoice] = useState(false);
  const [sale, setSale] = useState(null);

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
        <div className="flex-1 bg-gray-50 p-6 sm:p-8 flex flex-col">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-extrabold text-[#1F2933]">
              نقطة البيع
            </h1>
            <p className="text-gray-500 text-md font-semibold mt-1">
              امسح باركود المنتج لإضافته إلى الفاتورة
            </p>
          </div>

          <form
            action=""
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto w-full mb-6"
          >
            <label className="block text-[#1F2933] text-md font-semibold mb-1.5">
              مسح الباركود
            </label>
            <input
              type="text"
              placeholder="امسح الباركود"
              className="border border-gray-200 rounded-lg px-4 py-3 w-full bg-gray-50 text-[#1F2933] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146C5E]/40 focus:border-[#146C5E] transition-colors"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={handleScan}
              ref={inputRef}
              autoFocus
            />
          </form>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 h-full py-16 text-center">
                  <span className="text-4xl">🛒</span>
                  <p className="text-[#1F2933] font-bold">السلة فارغة</p>
                  <p className="text-gray-500 text-sm">
                    امسح باركود منتج لإضافته هنا
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      className="border border-gray-100 rounded-lg p-3.5 flex items-center justify-between gap-3 p-4"
                      key={item.barcode}
                    >
                      <div>
                        <h3 className="font-semibold text-[#1F2933]">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.sellPrice} جنيه
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                          <button
                            onClick={() => decreaseQuantity(item.barcode)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-200 text-[#1F2933] font-bold cursor-pointer transition-colors"
                          >
                            -
                          </button>

                          <span className="font-display font-bold text-[#1F2933] w-5 text-center">
                            {item.cartQuantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item.barcode)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-200 text-[#1F2933] font-bold cursor-pointer transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            setCart((prevCart) =>
                              prevCart.filter(
                                (cartItem) => cartItem.barcode !== item.barcode,
                              ),
                            )
                          }
                          className="text-red-600 hover:text-red-700 text-md font-bold cursor-pointer transition-colors"
                        >
                          إزالة
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 p-5 flex items-center justify-between gap-4 bg-gray-50">
              <p className="font-display text-xl font-extrabold text-[#1F2933]">
                الإجمالي:{" "}
                <span className="text-[#146C5E]">{total.toFixed(2)} جنيه</span>
              </p>
              <button
                onClick={handleCheckOut}
                className="bg-[#146C5E] hover:bg-[#0F544A] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2.5 px-8 rounded-lg transition-colors cursor-pointer shadow-sm"
                disabled={cart.length === 0}
              >
                إتمام البيع
              </button>
            </div>
          </div>
        </div>
      </div>

      {showInvoice && sale && (
        <div
          onClick={() => {
            setShowInvoice(false);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }}
          className="fixed inset-0 bg-[#1F2933]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            ref={invoiceRef}
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-[400px] rounded-2xl shadow-2xl p-6 pb-8 font-body min-h-[300px]"
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
