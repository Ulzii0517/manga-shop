"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "../axios/axios";
import toast from "react-hot-toast";
import { useToken } from "../navi/TokenLog";
import Spinner from "../Spinner/index";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ForgotPasswordModal from "./LoginForgot";
import LoginInputs from "./LoginInputs";

const decodeToken = (token) => {
  try {
    if (!token) return null;
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const LoginForm = ({ className, ...props }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const { handleLogin } = useToken();
  const router = useRouter();

  // cookie-ee checkleed redirect hiih
  useEffect(() => {
    const checkAuth = () => {
      const hasCookie = document.cookie.includes("book-token");
      const localToken = localStorage.getItem("book-token");
      const token = hasCookie
        ? document.cookie
            .split("; ")
            .find((row) => row.startsWith("book-token"))
            ?.split("=")[1]
        : localToken;

      if (token) {
        const decoded = decodeToken(token);
        if (decoded?.id === "guest") return;
        router.replace(
          decoded?.role === "admin" || decoded?.role === "operator"
            ? "/admin"
            : "/books",
        );
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleClick = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Имэйл, нууц үг оруулна уу");
    setLoading(true);
    try {
      const { data } = await axios.post("users/login", { email, password });
      handleLogin(data.token);
      toast.success("Амжилттай нэвтэрлээ");
      const decoded = decodeToken(data.token);
      setTimeout(() => {
        router.push(
          decoded?.role === "admin" || decoded?.role === "operator"
            ? "/admin"
            : "/home",
        );
      }, 200);
    } catch (err) {
      toast.error(
        err.response?.data?.error?.message || "Имэйл болон нууц үг буруу байна",
      );
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("users/guest-login");
      handleLogin(data.token);
      toast.success("Зочноор нэвтэрлээ");
      router.push("/home");
    } catch {
      toast.error("Нэвтрэх явцад алдаа гарлаа");
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="hover:shadow-lg transition bg-gray-900/70 border-none text-white">
        <CardHeader>
          <CardTitle>Нэвтрэх</CardTitle>
          <CardDescription>
            Имэйл болон нууц үгээ оруулан нэвтэрнэ үү
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleClick}>
            <LoginInputs
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              setShowForgot={setShowForgot}
              handleGuestLogin={handleGuestLogin}
            />
          </form>
        </CardContent>
      </Card>
      {showForgot && (
        <ForgotPasswordModal onClose={() => setShowForgot(false)} />
      )}
    </div>
  );
};

export default LoginForm;
