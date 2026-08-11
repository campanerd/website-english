@AGENTS.md

# Site do professor de inglês

Site com dois propósitos: divulgação/captação de alunos e biblioteca pública de material de aula (PDFs organizados por nível/tópico). Projeto de portfólio — priorizar implementação "full-stack de verdade" sobre o caminho mais rápido.

O plano completo de implementação está em `C:\Users\davi.fernandes\.claude\plans\humming-sniffing-orbit.md` (schema SQL completo, sequência de passos, verificação). Este arquivo é o resumo de referência rápida.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- Supabase: Postgres (dados), Auth (login único do admin), Storage (PDFs e imagens)
- Deploy: Vercel
- Ambiente de dev: WSL2 (Ubuntu) — o `cmd.exe` do Windows está bloqueado por política corporativa nesta máquina, então `npm`/`npx` só funcionam de dentro do WSL, não do PowerShell/Git Bash direto no Windows.

**Importante (Next.js 16):** este projeto usa uma versão do Next.js mais nova que pode ter mudanças em relação ao conhecimento geral do modelo. Antes de implementar algo específico do framework (config, middleware, server actions, roteamento), consultar `node_modules/next/dist/docs/` (ver `AGENTS.md`).

## Modelo de dados (Postgres)

- `levels` — nível (ex: Básico, Intermediário). Campos: `slug`, `title`, `description`, `order_index`, `is_published`.
- `topics` — tópico dentro de um nível, referencia `level_id`. Campos: `slug`, `title`, `summary` (descrição curta, uma linha), `pdf_path`, `pdf_original_name`, `order_index`, `is_published`.
- `site_content` — pares chave/valor (`key` = `'about'` | `'contact'`) com `content jsonb`, para os textos de "Quem Sou Eu" e dados de contato.

Sem tabela de usuários/alunos — autenticação existe só para a conta única do admin (o professor), via Supabase Auth. RLS: leitura pública de conteúdo publicado, escrita só autenticada.

## Estrutura de conteúdo

- Cada tópico é **só** título + descrição curta + PDF — sem corpo de texto/editor rico.
- Não existe página própria por tópico. A página do nível (`/metodologia/[nivel]`) já lista todos os tópicos: título como link direto pro PDF (abre em nova aba) + descrição embaixo.
- Contato é só link para WhatsApp (sem formulário com envio de e-mail).
- Site só em português (sem i18n).

## Convenções

- Páginas públicas são Server Components, buscando direto do Supabase.
- Mutations do admin usam Server Actions (não API routes), sempre chamando `revalidatePath` nas rotas afetadas depois de escrever.
- Nenhuma `service_role` key no código da aplicação — todas as escritas dependem da sessão autenticada + RLS.
- Sem rota de cadastro/signup — a conta do admin é criada manualmente no Supabase Dashboard.

## Colaboração

O usuário está aprendendo Next.js/React/Supabase (vem de background Java/backend) construindo este projeto. Preferência: eu explico e forneço o código/comandos, mas quem cria os arquivos e roda os comandos de implementação é o próprio usuário — não codar o projeto de forma autônoma sem esse acompanhamento passo a passo.
