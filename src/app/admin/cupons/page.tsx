"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";

export default function AdminCuponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = () => fetch("/api/admin/coupons").then((r) => r.json()).then(setCoupons);
  useEffect(() => load(), []);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = { code: (fd.get("code") as string).toUpperCase(), type: fd.get("type") as string, value: parseFloat(fd.get("value") as string), minOrderValue: parseFloat(fd.get("minOrderValue") as string) || 0, maxUses: fd.get("maxUses") ? parseInt(fd.get("maxUses") as string) : null, startDate: fd.get("startDate") as string, endDate: fd.get("endDate") as string };
    const res = await fetch("/api/admin/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) { toast.success(`Cupom ${data.code} criado!`); (e.target as HTMLFormElement).reset(); load(); }
    else toast.error((await res.json()).error || "Erro");
    setLoading(false);
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/admin/coupons/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !current }) });
    load();
  }

  async function deleteCoupon(id: string, code: string) {
    if (!confirm(`Excluir cupom "${code}"?`)) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    load(); toast.success("Excluído");
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Cupons</h1><p className="text-muted-foreground">{coupons.length} cupons</p></div>

      <Card><CardHeader><CardTitle className="text-lg">Novo Cupom</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={create} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><Label>Código</Label><Input name="code" placeholder="STICKER20" required className="rounded-xl" /></div>
            <div><Label>Tipo</Label><select name="type" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" required><option value="percentual">Percentual (%)</option><option value="valor_fixo">Valor Fixo (R$)</option></select></div>
            <div><Label>Valor</Label><Input name="value" type="number" step="0.01" required className="rounded-xl" /></div>
            <div><Label>Pedido Mínimo</Label><Input name="minOrderValue" type="number" defaultValue="0" className="rounded-xl" /></div>
            <div><Label>Limite Usos</Label><Input name="maxUses" type="number" placeholder="Ilimitado" className="rounded-xl" /></div>
            <div><Label>Início</Label><Input name="startDate" type="date" required className="rounded-xl" /></div>
            <div><Label>Expiração</Label><Input name="endDate" type="date" required className="rounded-xl" /></div>
            <div className="flex items-end"><Button type="submit" variant="gradient" disabled={loading} className="rounded-xl">{loading ? "..." : "Criar Cupom"}</Button></div>
          </form>
        </CardContent>
      </Card>

      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left text-muted-foreground bg-muted/30"><th className="p-4">Código</th><th className="p-4">Tipo</th><th className="p-4">Valor</th><th className="p-4">Uso</th><th className="p-4">Validade</th><th className="p-4">Status</th><th className="p-4 w-20">Ações</th></tr></thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="p-4 font-mono font-bold">{c.code}</td>
                <td className="p-4">{c.type === "percentual" ? "Percentual" : "Valor Fixo"}</td>
                <td className="p-4">{c.type === "percentual" ? `${c.value}%` : formatCurrency(c.value)}</td>
                <td className="p-4">{c.currentUses}{c.maxUses ? `/${c.maxUses}` : ""}</td>
                <td className="p-4 text-xs">{new Date(c.endDate).toLocaleDateString("pt-BR")}</td>
                <td className="p-4"><Badge variant={c.active ? "default" : "secondary"}>{c.active ? "Ativo" : "Inativo"}</Badge></td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toggleActive(c.id, c.active)}>{c.active ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4" />}</Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600" onClick={() => deleteCoupon(c.id, c.code)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>
    </div>
  );
}
