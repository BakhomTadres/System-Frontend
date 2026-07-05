import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
  !!localStorage.getItem("token")
);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await axios.post("https://system-backend-makarios.vercel.app/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setEmail("");
      setPassword("");
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      alert("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  }

  return (
    <>
      <style>{`
        .font-display { font-family: 'Cairo', sans-serif; }
        .font-body { font-family: 'Tajawal', sans-serif; }
      `}</style>
      <div
        dir="rtl"
        className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-body"
      >
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
          <div className="w-14 h-14 rounded-xl bg-[#146C5E]/10 text-[#146C5E] text-2xl flex items-center justify-center mx-auto mb-5">
            🛒
          </div>

          <h1 className="font-display text-3xl font-extrabold text-center text-[#1F2933] mb-1.5">
            الهندسية لقطع غيار السيارات
          </h1>

          <p className="text-center text-gray-500 mb-8 text-sm">
            تسجيل دخول المدير
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block mb-1.5 text-[#1F2933] text-sm font-semibold">
                البريد الإلكتروني
              </label>

              <input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-[#1F2933] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146C5E]/40 focus:border-[#146C5E] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-[#1F2933] text-sm font-semibold">
                كلمة المرور
              </label>

              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-[#1F2933] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146C5E]/40 focus:border-[#146C5E] transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#146C5E] hover:bg-[#0F544A] text-white py-3 rounded-lg font-bold transition-colors cursor-pointer shadow-sm"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
