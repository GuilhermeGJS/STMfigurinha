"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Loader2, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => fetch("/api/admin/categories").then((r) => r.json()).then(setCategories);
  useEffect(() => load(), []);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: fd.get("name") }) });
    if (res.ok) { toast.success("Criada!"); (e.target as HTMLFormElement).reset(); setShowForm(false); load(); }
    else toast.error((await res.json()).error || "Erro");
    setLoading(false);
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/admin/categories/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !current }) });
    load(); toast.success(current ? "Desativada" : "Ativada");
  }

  async function deleteCat(id: string, name: string) {
    if (!confirm(`Excluir categoria "${name}"?`)) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    load(); toast.success("Excluída");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Categorias</h1><p className="text-muted-foreground">{categories.length} categorias</p></div>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-xl gap-2" variant={showForm ? "outline" : "gradient"}>
          {showForm ? "Fechar" : <><Plus className="h-4 w-4" /> Nova</>}
        </Button>
      </div>

      {showForm && (
        <Card className="border-violet-200 bg-violet-50/30">
          <CardHeader><CardTitle className="text-lg">Nova Categoria</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={create} className="flex gap-3 items-end">
              <div className="flex-1"><Label>Nome</Label><Input name="name" placeholder="Ex: Animes" required className="rounded-xl" /></div>
              <Button type="submit" variant="gradient" disabled={loading} className="rounded-xl gap-2 shrink-0">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}Criar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((c) => (
          <Card key={c.id} className={`hover:shadow-md transition-all ${!c.active ? "opacity-60" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div><h3 className="font-semibold">{c.name}</h3><p className="text-xs text-muted-foreground">/{c.slug} • {c.productCount} produtos</p></div>
                <Badge variant={c.active ? "default" : "secondary"}>{c.active ? "Ativa" : "Inativa"}</Badge>
              </div>
              <div className="flex gap-1.5 pt-2 border-t">
                <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => toggleActive(c.id, c.active)} title={c.active ? "Desativar" : "Ativar"}>
                  {c.active ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4" />}
                </Button>
                <div className="flex-1" />
                <Button size="sm" variant="ghost" className="h-8 text-xs text-red-600 hover:text-red-700" onClick={() => deleteCat(c.id, c.name)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
