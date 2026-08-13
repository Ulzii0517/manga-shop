"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "../../axios/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RegisterForm = ({ className, ...props }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      return toast.error("Талбаруудыг гүйцэт бөглөнө үү");
    }

    if (password !== confirmPassword) {
      return toast.error("Нууц үг таарахгүй байна");
    }

    setLoading(true);

    try {
      await axios.post("users/register", { name, email, password });
      toast.success("Амжилттай бүртгүүллээ! Одоо нэвтэрнэ үү");
      router.push("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.error?.message ||
          "Бүртгэл үүсгэхэд алдаа гарлаа. Серверт холбогдсонгүй",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={cn("flex flex-col ", className)} {...props}>
      <Card className="hover:shadow-lg transition bg-gray-900/70 border-none text-white">
        <CardHeader>
          <CardTitle>Бүртгүүлэх</CardTitle>
          <CardDescription>
            {" "}
            Мэдээллээ оруулан шинэ бүртгэл үүсгэнэ үү
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <Input
                  id="name"
                  type="text"
                  placeholder="Таны нэр"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-600"
                  required
                />
              </Field>

              <Field>
                <Input
                  id="email"
                  type="email"
                  placeholder="И-Мэйл"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-600"
                  required
                />
              </Field>

              <Field>
                <Input
                  id="password"
                  type="password"
                  placeholder="Нууц үг"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-600"
                  required
                />
              </Field>

              <Field>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Нууц үгээ дахин оруулна уу"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border border-gray-600"
                  required
                />
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-linear-to-r from-indigo-500 to-purple-600 hover:opacity-90"
                >
                  {loading ? "Бүртгэл үүсгэж байна.." : "Бүртгүүлэх"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Бүртгэлтэй юу?{" "}
                <a
                  href="/login"
                  className="underline underline-offset-4 text-gray-200! transition-colors hover:text-gray-400!"
                >
                  Нэвтрэх
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default RegisterForm;
