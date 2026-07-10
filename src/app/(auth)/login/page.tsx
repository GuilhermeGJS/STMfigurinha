"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Email ou senha inválidos.");
      toast.error("Email ou senha inválidos.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gradient-to-b from-white to-violet-50/30">
      <Card className="w-full max-w-md border-0 shadow-xl rounded-2xl">
        <CardHeader className="text-center pt-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Star className="h-7 w-7 text-white fill-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
          <CardDescription>Acesse sua conta para continuar comprando</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required className="h-11 rounded-xl" />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}
            <Button type="submit" className="w-full h-11 rounded-xl gradient-btn" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"} {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center pb-8">
          <p className="text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link href="/cadastro" className="text-violet-600 font-semibold hover:underline">Cadastre-se</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
