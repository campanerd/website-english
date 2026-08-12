import { signOut } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"

export default function AdminDashboardLayout({
  children,
}: LayoutProps<"/admin">) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <h1 className="font-heading text-lg font-semibold text-primary">
          Painel Admin
        </h1>
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm">
            Sair
          </Button>
        </form>
      </div>
      {children}
    </div>
  )
}
