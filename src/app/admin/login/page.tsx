"use client"

import { useActionState } from "react"
import { signIn, type SignInState } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: SignInState = { error: null }

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState)

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="font-heading text-2xl font-bold text-primary">
        Painel Admin
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Acesso restrito ao professor.
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>

        {state.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}

        <Button type="submit" disabled={isPending} className="mt-2">
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  )
}
