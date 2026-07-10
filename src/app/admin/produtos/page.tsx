"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = () => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {});
  };

  useEffect(() => {
    loadProducts();
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        categoryId: fd.get("categoryId"),
        basePrice: fd.get("basePrice"),
        type: fd.get("type"),
        featured: fd.get("featured") === "true",
        description: fd.get("description"),
      }),
    });

    if (res.ok) {
      toast.success("Produto criado!");
      (e.target as HTMLFormElement).reset();
      setShowForm(false);
      loadProducts();
    } else {
      const err = await res.json();
      toast.error(err.error || "Erro ao criar");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">{products.length} produtos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-xl gap-2" variant={showForm ? "outline" : "gradient"}>
          {showForm ? "Fechar" : <><Plus className="h-4 w-4" /> Novo Produto</>}
        </Button>
      </div>

      {/* Form de criação */}
      {showForm && (
        <Card className="border-violet-200 bg-violet-50/30">
          <CardHeader><CardTitle className="text-lg">Adicionar Produto</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome</Label>
                  <Input name="name" placeholder="Naruto Uzumaki" required className="rounded-xl" />
                </div>
                <div>
                  <Label>Categoria</Label>
                  <select name="categoryId" required className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Selecionar...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Preço Base (R$)</Label>
                  <Input name="basePrice" type="number" step="0.01" placeholder="5.90" required className="rounded-xl" />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <select name="type" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                    <option value="pronta">Figurinha Pronta</option>
                    <option value="personalizada">Personalizável</option>
                  </select>
                </div>
                <div>
                  <Label>Destaque</Label>
                  <select name="featured" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label>Descrição</Label>
                  <Textarea name="description" placeholder="Descrição da figurinha..." className="rounded-xl" rows={2} />
                </div>
              </div>
              <Button type="submit" variant="gradient" disabled={loading} className="rounded-xl gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {loading ? "Criando..." : "Criar Produto"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <Card key={p.id} className="hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-sm">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">{p.categoryName}</p>
                </div>
                <Badge variant={p.active ? "default" : "secondary"}>{p.active ? "Ativo" : "Inativo"}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-violet-700">{formatCurrency(p.basePrice)}</span>
                <span className="text-xs text-muted-foreground">{p.variantCount} variantes</span>
              </div>
              {p.featured && <Badge variant="outline" className="mt-2 text-[10px] border-amber-300 text-amber-700">⭐ Destaque</Badge>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
