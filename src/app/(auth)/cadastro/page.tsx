"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function CadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError("");
    const formData = new FormData(e.currentTarget);
    const data = { name: formData.get("name") as string, email: formData.get("email") as string, password: formData.get("password") as string };
    if (data.password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); setLoading(false); return; }
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json(); setError(err.error || "Erro."); toast.error(err.error || "Erro."); setLoading(false); return; }
    toast.success("Conta criada! Faça login.");
    router.push("/login");
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gradient-to-b from-white to-violet-50/30">
      <Card className="w-full max-w-md border-0 shadow-xl rounded-2xl">
        <CardHeader className="text-center pt-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Star className="h-7 w-7 text-white fill-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription>Cadastre-se para comprar e personalizar figurinhas</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Nome</Label><Input name="name" placeholder="Seu nome" required className="h-11 rounded-xl" /></div>
            <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" placeholder="seu@email.com" required className="h-11 rounded-xl" /></div>
            <div className="space-y-2"><Label>Senha</Label><Input name="password" type="password" placeholder="Mínimo 6 caracteres" required className="h-11 rounded-xl" /></div>
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}
            <Button type="submit" className="w-full h-11 rounded-xl" variant="gradient" disabled={loading}>
              {loading ? "Criando..." : "Criar Conta"} {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center pb-8">
          <p className="text-sm text-muted-foreground">Já tem conta? <Link href="/login" className="text-violet-600 font-semibold hover:underline">Entrar</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}
