import SideBar from "./Components/SideBar";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

export default function Products() {
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [productName, setProductName] = useState("");
  const [productBarcode, setProductBarcode] = useState("");
  const [productPriceBuy, setProductPriceBuy] = useState("");
  const [productPriceSell, setProductPriceSell] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productMinimumQuantity, setProductMinimumQuantity] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");
  const [search, setSearch] = useState("");
  const [showEditProductForm, setShowEditProductForm] = useState(false);
  const [editingBarcode, setEditingBarcode] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchProducts = useCallback(() => {
    setLoading(true);
    axios
      .get("system-backend-makarios.vercel.app/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setProducts(response.data.data.products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function resetForm() {
    setProductName("");
    setProductBarcode("");
    setProductPriceBuy("");
    setProductPriceSell("");
    setProductQuantity("");
    setProductMinimumQuantity("");
    setNameError("");
  }

 async function handleAddProduct(e) {
    e.preventDefault();
    setNameError("");
    setSubmitting(true);

    const newProduct = {
      name: productName,
      barcode: productBarcode,
      buyPrice: productPriceBuy,
      sellPrice: productPriceSell,
      quantity: productQuantity,
      minQuantity: productMinimumQuantity,
    };

    await axios
      .post("https://system-backend-makarios.vercel.app/api/products", newProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setProducts((prevProducts) => [
          ...prevProducts,
          response.data.data.product,
        ]);
        resetForm();
        setShowAddProductForm(false);
      })
      .catch((error) => {
        const message = error.response?.data?.message;
        if (message === "Product already exists") {
          setNameError("هذا الباركود مستخدم بالفعل");
        } else {
          setNameError("حدث خطأ أثناء إضافة المنتج، حاول مرة أخرى");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.barcode?.toLowerCase().includes(q)
    );
  }, [products, search]);

  const stats = useMemo(() => {
    const totalItems = products.length;
    const lowStock = products.filter(
      (p) => Number(p.quantity) <= Number(p.minQuantity)
    ).length;
    const totalValue = products.reduce(
      (sum, p) => sum + Number(p.buyPrice || 0) * Number(p.quantity || 0),
      0
    );
    return { totalItems, lowStock, totalValue };
  }, [products]);

const openEditModal = (product) => {
  setProductName(product.name);
  setProductBarcode(product.barcode);
  setProductPriceBuy(product.buyPrice);
  setProductPriceSell(product.sellPrice);
  setProductQuantity(product.quantity);
  setProductMinimumQuantity(product.minQuantity);
  
  setEditingBarcode(product.barcode);
  setShowEditProductForm(true);
};

const handleUpdateProduct = async (e) => {
  e.preventDefault();
  setNameError("");
  setSubmitting(true);
  try {
    await axios.patch(
      `https://system-backend-makarios.vercel.app/api/products/${editingBarcode}`,
      {
        name: productName,
        barcode: productBarcode,
        buyPrice: productPriceBuy,
        sellPrice: productPriceSell,
        quantity: productQuantity,
        minQuantity: productMinimumQuantity,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    await fetchProducts();
    setShowEditProductForm(false);
    setEditingBarcode(null);
    resetForm();
  } catch (error) {
    const message = error.response?.data?.message;
    if (message === "Product already exists") {
      setNameError("هذا الباركود مستخدم بالفعل");
    } else {
      setNameError("حدث خطأ أثناء تعديل المنتج، حاول مرة أخرى");
    }
  } finally {
    setSubmitting(false);
  }
};

const handleDeleteProduct = async () => {
  if (!productToDelete) return;
  setDeleting(true);
  setDeleteError("");
  try {
    await axios.delete(
      `https://system-backend-makarios.vercel.app/api/products/${productToDelete.barcode}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setProducts((prev) =>
      prev.filter((p) => p.barcode !== productToDelete.barcode)
    );
    setProductToDelete(null);
  } catch (error) {
    setDeleteError("حدث خطأ أثناء حذف المنتج، حاول مرة أخرى");
  } finally {
    setDeleting(false);
  }
};
  return (
    <>
      <style>{`
        .font-display { font-family: 'Cairo', sans-serif; }
        .font-body { font-family: 'Tajawal', sans-serif; }
      `}</style>
      {showEditProductForm && (
        <div
          dir="rtl"
          className="fixed inset-0 flex items-center justify-center bg-[#1F2933]/60 backdrop-blur-sm z-50 p-4 font-body"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-[440px] max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-7 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-[#1F2933]">
                تعديل المنتج
              </h2>
              <button
                onClick={() => {
                  setShowEditProductForm(false);
                  resetForm();
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                type="button"
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>
            <div className="px-7 py-5">
              <p className="text-gray-500 text-sm"></p>
<form onSubmit={handleUpdateProduct}  className="px-7 py-5 space-y-4">
              <div>
                <label
                  className="block text-[#1F2933] text-sm font-semibold mb-1.5"
                  htmlFor="name"
                >
                  الاسم
                </label>
                <input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="border border-gray-200 rounded-lg w-full py-2.5 px-3.5 text-[#1F2933] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146C5E]/40 focus:border-[#146C5E] transition-colors"
                  id="name"
                  type="text"
                  placeholder="اسم المنتج"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-[#1F2933] text-sm font-semibold mb-1.5"
                  htmlFor="barcode"
                >
                  الباركود
                </label>
                <input
                  value={productBarcode}
                  onChange={(e) => {
                    setProductBarcode(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  className={`border rounded-lg w-full py-2.5 px-3.5 text-[#1F2933] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                    nameError
                      ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                      : "border-gray-200 focus:ring-[#146C5E]/40 focus:border-[#146C5E]"
                  }`}
                  id="barcode"
                  type="text"
                  placeholder="الباركود"
                  required
                />
                {nameError && (
                  <p className="text-red-600 text-xs font-semibold mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {nameError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-[#1F2933] text-sm font-semibold mb-1.5"
                    htmlFor="cost"
                  >
                    سعر الشراء
                  </label>
                  <input
                    value={productPriceBuy}
                    onChange={(e) => setProductPriceBuy(e.target.value)}
                    className="border border-gray-200 rounded-lg w-full py-2.5 px-3.5 text-[#1F2933] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146C5E]/40 focus:border-[#146C5E] transition-colors"
                    id="cost"
                    type="number"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-[#1F2933] text-sm font-semibold mb-1.5"
                    htmlFor="price"
                  >
                    سعر البيع
                  </label>
                  <input
                    value={productPriceSell}
                    onChange={(e) => setProductPriceSell(e.target.value)}
                    className="border border-gray-200 rounded-lg w-full py-2.5 px-3.5 text-[#1F2933] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146C5E]/40 focus:border-[#146C5E] transition-colors"
                    id="price"
                    type="number"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-[#1F2933] text-sm font-semibold mb-1.5"
                    htmlFor="quantity"
                  >
                    الكمية
                  </label>
                  <input
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                    className="border border-gray-200 rounded-lg w-full py-2.5 px-3.5 text-[#1F2933] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146C5E]/40 focus:border-[#146C5E] transition-colors"
                    id="quantity"
                    type="number"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-[#1F2933] text-sm font-semibold mb-1.5"
                    htmlFor="minimumQuantity"
                  >
                    أقل كمية
                  </label>
                  <input
                    value={productMinimumQuantity}
                    onChange={(e) =>
                      setProductMinimumQuantity(e.target.value)
                    }
                    className="border border-gray-200 rounded-lg w-full py-2.5 px-3.5 text-[#1F2933] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146C5E]/40 focus:border-[#146C5E] transition-colors"
                    id="minimumQuantity"
                    type="number"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  disabled={submitting}
                  className="flex-1 bg-[#146C5E] hover:bg-[#0F544A] disabled:bg-[#146C5E]/50 text-white font-bold py-2.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  type="submit"
                >
                  {submitting && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {submitting ? "جاري الحفظ..." : "حفظ التعديلات"}
                </button>
                <button
                  onClick={() => {
                    setShowEditProductForm(false);
                    resetForm();
                  }}
                  className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-[#1F2933] font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
                  type="button"
                  disabled={submitting}
                >
                  إلغاء
                </button>
              </div>
            </form>              
            </div>
          </div>
        </div>
      )}
      {showAddProductForm && (
        <div
          dir="rtl"
          className="fixed inset-0 flex items-center justify-center bg-[#1F2933]/60 backdrop-blur-sm z-50 p-4 font-body"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-[440px] max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-7 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-[#1F2933]">
                إضافة منتج جديد
              </h2>
              <button
                onClick={() => {
                  setShowAddProductForm(false);
                  resetForm();
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                type="button"
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="px-7 py-5 space-y-4">
              <div>
                <label
                  className="block text-[#1F2933] text-sm font-semibold mb-1.5"
                  htmlFor="name"
                >
                  الاسم
                </label>
                <input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="border border-gray-200 rounded-lg w-full py-2.5 px-3.5 text-[#1F2933] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146C5E]/40 focus:border-[#146C5E] transition-colors"
                  id="name"
                  type="text"
                  placeholder="اسم المنتج"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-[#1F2933] text-sm font-semibold mb-1.5"
                  htmlFor="barcode"
                >
                  الباركود
                </label>
                <input
                  value={productBarcode}
                  onChange={(e) => {
                    setProductBarcode(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  className={`border rounded-lg w-full py-2.5 px-3.5 text-[#1F2933] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                    nameError
                      ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                      : "border-gray-200 focus:ring-[#146C5E]/40 focus:border-[#146C5E]"
                  }`}
                  id="barcode"
                  type="text"
                  placeholder="الباركود"
                  required
                />
                {nameError && (
                  <p className="text-red-600 text-xs font-semibold mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {nameError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-[#1F2933] text-sm font-semibold mb-1.5"
                    htmlFor="cost"
                  >
                    سعر الشراء
                  </label>
                  <input
                    value={productPriceBuy}
                    onChange={(e) => setProductPriceBuy(e.target.value)}
                    className="border border-gray-200 rounded-lg w-full py-2.5 px-3.5 text-[#1F2933] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146C5E]/40 focus:border-[#146C5E] transition-colors"
                    id="cost"
                    type="number"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-[#1F2933] text-sm font-semibold mb-1.5"
                    htmlFor="price"
                  >
                    سعر البيع
                  </label>
                  <input
                    value={productPriceSell}
                    onChange={(e) => setProductPriceSell(e.target.value)}
                    className="border border-gray-200 rounded-lg w-full py-2.5 px-3.5 text-[#1F2933] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146C5E]/40 focus:border-[#146C5E] transition-colors"
                    id="price"
                    type="number"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-[#1F2933] text-sm font-semibold mb-1.5"
                    htmlFor="quantity"
                  >
                    الكمية
                  </label>
                  <input
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                    className="border border-gray-200 rounded-lg w-full py-2.5 px-3.5 text-[#1F2933] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146C5E]/40 focus:border-[#146C5E] transition-colors"
                    id="quantity"
                    type="number"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-[#1F2933] text-sm font-semibold mb-1.5"
                    htmlFor="minimumQuantity"
                  >
                    أقل كمية
                  </label>
                  <input
                    value={productMinimumQuantity}
                    onChange={(e) =>
                      setProductMinimumQuantity(e.target.value)
                    }
                    className="border border-gray-200 rounded-lg w-full py-2.5 px-3.5 text-[#1F2933] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146C5E]/40 focus:border-[#146C5E] transition-colors"
                    id="minimumQuantity"
                    type="number"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  disabled={submitting}
                  className="flex-1 bg-[#146C5E] hover:bg-[#0F544A] disabled:bg-[#146C5E]/50 text-white font-bold py-2.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  type="submit"
                >
                  {submitting && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {submitting ? "جاري الإضافة..." : "إضافة المنتج"}
                </button>
                <button
                  onClick={() => {
                    setShowAddProductForm(false);
                    resetForm();
                  }}
                  className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-[#1F2933] font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
                  type="button"
                  disabled={submitting}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex min-h-screen bg-[#F5F7F7] font-body">
        <div dir="rtl" className="w-[80%] px-8 py-6">
          {/* الترويسة */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl font-extrabold text-[#1F2933]">
                المنتجات
              </h1>
              <p className="text-gray-500 text-md font-semibold mt-1">
                إدارة المخزون ومتابعة الكميات المتاحة
              </p>
            </div>
            <button
              onClick={() => setShowAddProductForm(true)}
              className="bg-[#146C5E] hover:bg-[#0F544A] text-white font-bold py-2.5 px-5 rounded-lg cursor-pointer transition-colors flex items-center gap-2 shadow-sm"
            >
              <span className="text-lg leading-none">+</span> إضافة منتج
            </button>
          </div>

          {/* شريط الإحصائيات */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-md font-semibold">
                إجمالي المنتجات
              </p>
              <p className="font-display text-2xl font-extrabold text-[#1F2933] mt-1">
                {stats.totalItems}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-md font-semibold">
                منتجات منخفضة المخزون
              </p>
              <p
                className={`font-display text-2xl font-extrabold mt-1 ${
                  stats.lowStock > 0 ? "text-red-600" : "text-[#1F2933]"
                }`}
              >
                {stats.lowStock}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-md font-semibold">
                قيمة المخزون التقديرية
              </p>
              <p className="font-display text-2xl font-extrabold text-[#146C5E] mt-1">
                {stats.totalValue.toLocaleString("ar-EG")} ج.م
              </p>
            </div>
          </div>

          {/* شريط البحث */}
          <div className="mb-5">
            <div className="relative max-w-sm">
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بالاسم أو الباركود..."
                className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pr-10 pl-3.5 text-md font-semibold focus:outline-none focus:ring-2 focus:ring-[#146C5E]/40 focus:border-[#146C5E] transition-colors"
              />
            </div>
          </div>

          {/* المحتوى */}
          <div className="bg-white rounded-xl border border-gray-100 min-h-[50vh] p-5">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20">
                <span className="w-10 h-10 border-4 border-[#146C5E] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 text-sm">
                  جاري تحميل المنتجات...
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
                <span className="text-4xl">📦</span>
                <p className="text-[#1F2933] font-bold">
                  {search ? "لا توجد نتائج مطابقة" : "لا توجد منتجات بعد"}
                </p>
                <p className="text-gray-500 text-sm">
                  {search
                    ? "جرّب كلمة بحث مختلفة"
                    : "ابدأ بإضافة أول منتج في المخزون"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const isLow =
                    Number(product.quantity) <= Number(product.minQuantity);
                  return (
                    <div
                      key={product._id}
                      className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all relative"
                    >
                      {isLow && (
                        <span className="absolute top-3 left-3 bg-red-50 text-red-600 text-[14px] font-bold px-2 py-0.5 rounded-full">
                          مخزون منخفض
                        </span>
                      )}
                      <h2 className="font-display font-bold text-[#1F2933] mb-1 pl-2">
                        {product.name}
                      </h2>
                      <p className="text-gray-400 text-md font-semibold mb-3">
                        {product.barcode}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 text-md font-semibold">سعر الشراء</span>
                        <span className="font-display font-bold text-[#146C5E]">
                          {product.buyPrice} ج.م
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 text-md font-semibold">سعر البيع</span>
                        <span className="font-display font-bold text-[#146C5E]">
                          {product.sellPrice} ج.م
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1.5">
                        <span className="text-gray-500 text-md font-semibold">الكمية</span>
                        <span
                          className={`font-display font-bold ${
                            isLow ? "text-red-600" : "text-[#1F2933]"
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </div>
                      <div className="flex items-center justify-start text-sm mt-1.5">
                        <button onClick={() => openEditModal(product)} className="bg-[#1da4f1] hover:bg-[#186bd8] text-white text-sm font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer mx-2">
                          تعديل
                        </button>
                        <button
                          onClick={() => {
                            setDeleteError("");
                            setProductToDelete(product);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer ml-2"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="w-[20%] border-r border-gray-100 bg-white">
          <SideBar />
        </div>
      </div>

      {productToDelete && (
        <div
          dir="rtl"
          className="fixed inset-0 flex items-center justify-center bg-[#1F2933]/60 backdrop-blur-sm z-50 p-4 font-body"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-[380px] p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 text-2xl flex items-center justify-center mx-auto mb-3">
              🗑
            </div>
            <h2 className="font-display text-lg font-bold text-[#1F2933] mb-1">
              حذف المنتج
            </h2>
            <p className="text-gray-500 text-sm mb-1">
              متأكد إنك عايز تحذف
            </p>
            <p className="font-display font-bold text-[#1F2933] mb-4">
              "{productToDelete.name}"؟
            </p>
            <p className="text-gray-400 text-xs mb-5">
              الإجراء ده مش هينفع يتراجع عنه
            </p>

            {deleteError && (
              <p className="text-red-600 text-xs font-semibold mb-3">
                {deleteError}
              </p>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-bold py-2.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleting && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {deleting ? "جاري الحذف..." : "حذف"}
              </button>
              <button
                onClick={() => {
                  setProductToDelete(null);
                  setDeleteError("");
                }}
                disabled={deleting}
                className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-[#1F2933] font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
