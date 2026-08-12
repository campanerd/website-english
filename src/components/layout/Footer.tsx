export function Footer() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Aulas de Inglês. Todos os direitos reservados.
      </div>
    </footer>
  )
}
