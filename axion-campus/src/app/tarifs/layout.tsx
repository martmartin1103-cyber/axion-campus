// src/app/tarifs/layout.tsx
// Ce layout neutralise la Navbar globale du layout principal
// La page tarifs a sa propre navigation intégrée

export default function TarifsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
