"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, LogOut, Package, Star, Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/stores/cart";
import { CartDrawer } from "@/components/carrinho/CartDrawer";
import { useState } from "react";
import { SearchBar } from "@/components/vitrine/SearchBar";

const navLinks = [
  { href: "/categorias/anime", label: "Anime" },
  { href: "/categorias/futebol", label: "Futebol" },
  { href: "/categorias/memes", label: "Memes" },
  { href: "/categorias/musica", label: "Música" },
  { href: "/categorias/games", label: "Games" },
];

export function Header() {
  const { data: session } = useSession();
  const user = session?.user as { name?: string; role?: string } | undefined;
  const totalItems = useCartStore((s) => s.totalItems());
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 text-white text-xs text-center py-1.5 px-4 font-medium tracking-wide">
        ✨ Use STICKER20 e ganhe 20% off na sua primeira compra! • Produção em 48h
      </div>

      <div className="border-b bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-glow-sm transition-shadow">
                <Star className="h-5 w-5 text-white fill-white" />
              </div>
              <span className="hidden sm:inline">
                Sticker<span className="text-violet-600">Shop</span>
              </span>
            </Link>

            {/* Search - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <SearchBar />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Cart */}
              <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-violet-50">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-violet-600">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md">
                  <SheetHeader><SheetTitle>Meu Carrinho</SheetTitle></SheetHeader>
                  <CartDrawer onClose={() => setCartOpen(false)} />
                </SheetContent>
              </Sheet>

              {/* User menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-violet-50">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <div className="px-3 py-2.5 text-sm font-medium border-b bg-muted/30">Olá, {user.name}</div>
                    <DropdownMenuItem asChild>
                      <Link href="/meus-pedidos" className="cursor-pointer"><Package className="mr-2 h-4 w-4" /> Meus Pedidos</Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer"><Star className="mr-2 h-4 w-4 text-violet-500" /> Painel Admin</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" asChild className="font-medium">
                  <Link href="/login">Entrar</Link>
                </Button>
              )}

              {/* Mobile menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <SheetHeader><SheetTitle>Menu</SheetTitle></SheetHeader>
                  <div className="mt-4 space-y-4">
                    <SearchBar />
                    <nav className="flex flex-col space-y-1">
                      <Link href="/personalizar" onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium shadow-md">
                        <Sparkles className="h-4 w-4" />Criar Figurinha Personalizada
                      </Link>
                      {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                          className="px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors">{link.label}</Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto">
            <Link href="/personalizar"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all shrink-0">
              <Sparkles className="h-3.5 w-3.5" />Criar Personalizada
            </Link>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="px-4 py-2 rounded-full text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-all shrink-0 font-medium">{link.label}</Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
