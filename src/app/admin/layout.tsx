"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard, ShoppingBag, Package, Tags, Percent, Ticket, Star, ChevronLeft, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/cupons", label: "Cupons", icon: Ticket },
  { href: "/admin/promocoes", label: "Promoções", icon: Percent },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) { router.push("/login"); return; }
    if ((session.user as any)?.role !== "admin") router.push("/");
  }, [session, status, router]);

  if (status === "loading" || !session) return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-10 h-10 border-[3px] border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if ((session.user as any)?.role !== "admin") return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-muted/20">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white p-5 shadow-sm">
        <div className="mb-8">
          <Link href="/admin" className="flex items-center gap-2.5 font-bold text-lg">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Star className="h-5 w-5 text-white fill-white" />
            </div>
            <span>Admin</span>
          </Link>
        </div>
        <nav className="space-y-1 flex-1">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-violet-50 transition-all">
              <link.icon className="h-4 w-4" />{link.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 pt-4 border-t">
          <Button variant="ghost" size="sm" asChild className="w-full justify-start">
            <Link href="/"><ChevronLeft className="mr-2 h-4 w-4" />Voltar à Loja</Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => signOut()} className="w-full justify-start text-red-600 hover:text-red-700">
            <LogOut className="mr-2 h-4 w-4" />Sair
          </Button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg">
        <nav className="flex justify-around p-2">
          {sidebarLinks.slice(0, 5).map((link) => (
            <Link key={link.href} href={link.href} className="flex flex-col items-center gap-1 p-2 text-[10px] text-muted-foreground">
              <link.icon className="h-4 w-4" />{link.label}
            </Link>
          ))}
        </nav>
      </div>

      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-auto">{children}</main>
    </div>
  );
}
