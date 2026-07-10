"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const tipoLabel: Record<string, string> = { compre_x_pague_y: "Compre X, Pague Y", desconto_por_qtde: "Desconto por Qtde", desconto_percentual: "Desconto Percentual" };

export default function AdminPromocoesPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState("compre_x_pague_y");

  const load = () => fetch("/api/admin/promocoes").then((r) => r.json()).then(setRules);
  useEffect(() => load(), []);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data: any = { name: fd.get("name"), type: fd.get("type"), applyTo: fd.get("applyTo"), startDate: fd.get("startDate"), endDate: fd.get("endDate") };
    if (data.type === "compre_x_pague_y") { data.buyQty = parseInt(fd.get("buyQty") as string); data.payQty = parseInt(fd.get("payQty") as string); }
    else if (data.type === "desconto_por_qtde") { data.buyQty = parseInt(fd.get("buyQty") as string); data.discountPercent = parseFloat(fd.get("discountPercent") as string); }
    else { data.discountPercent = parseFloat(fd.get("discountPercent") as string); }
    const res = await fetch("/api/admin/promocoes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) { toast.success("Regra criada!"); (e.target as HTMLFormElement).reset(); load(); }
    else toast.error("Erro");
    setLoading(false);
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/admin/promocoes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !current }) });
    load();
  }

  async function deleteRule(id: string, name: string) {
    if (!confirm(`Excluir "${name}"?`)) return;
    await fetch(`/api/admin/promocoes/${id}`, { method: "DELETE" });
    load(); toast.success("Excluída");
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Promoções</h1><p className="text-muted-foreground">{rules.length} regras</p></div>

      <Card><CardHeader><CardTitle className="text-lg">Nova Regra</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={create} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label>Nome</Label><Input name="name" placeholder="Leve 5, Pague 4" required className="rounded-xl" /></div>
              <div><Label>Tipo</Label><select name="type" value={tipo} onChange={(e) => setTipo(e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"><option value="compre_x_pague_y">Compre X, Pague Y</option><option value="desconto_por_qtde">Desconto por Qtde</option><option value="desconto_percentual">Desconto Percentual</option></select></div>
              <div><Label>Aplicar a</Label><select name="applyTo" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"><option value="todos">Todos</option><option value="categoria">Categoria</option><option value="produto">Produto</option></select></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tipo === "compre_x_pague_y" && (<><div><Label>Qtd Comprar</Label><Input name="buyQty" type="number" required className="rounded-xl" /></div><div><Label>Qtd Pagar</Label><Input name="payQty" type="number" required className="rounded-xl" /></div></>)}
              {tipo === "desconto_por_qtde" && (<><div><Label>Qtd Mínima</Label><Input name="buyQty" type="number" required className="rounded-xl" /></div><div><Label>Desconto (%)</Label><Input name="discountPercent" type="number" step="0.01" required className="rounded-xl" /></div></>)}
              {tipo === "desconto_percentual" && (<div><Label>Desconto (%)</Label><Input name="discountPercent" type="number" step="0.01" required className="rounded-xl" /></div>)}
              <div><Label>Início</Label><Input name="startDate" type="date" required className="rounded-xl" /></div>
              <div><Label>Expiração</Label><Input name="endDate" type="date" required className="rounded-xl" /></div>
            </div>
            <Button type="submit" variant="gradient" disabled={loading} className="rounded-xl">{loading ? "..." : "Criar Regra"}</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {rules.map((r) => (
          <Card key={r.id} className={`hover:shadow-md transition-all ${!r.active ? "opacity-60" : ""}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2"><h3 className="font-semibold">{r.name}</h3><Badge variant={r.active ? "default" : "secondary"}>{r.active ? "Ativa" : "Inativa"}</Badge></div>
                <p className="text-sm text-muted-foreground mt-1">{tipoLabel[r.type]} • {r.applyTo} • Até {new Date(r.endDate).toLocaleDateString("pt-BR")}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toggleActive(r.id, r.active)}>{r.active ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4" />}</Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600" onClick={() => deleteRule(r.id, r.name)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
