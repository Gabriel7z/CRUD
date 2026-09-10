# Grupo Manancial · Jovens ADESA 829

Portal da juventude: agenda, lembrete do próximo encontro, sugestões, campanhas e temas de estudo. O jovem cria a conta com o **Gmail + senha** (validação pelo Supabase; só endereços @gmail.com entram). Não usamos login do Google.

## Rodar localmente

```bash
npm install
cp .env.example .env
npm run dev
```

O site já vem apontando para o projeto Supabase do grupo (`src/lib/supabase.ts`). Para usar outro projeto, defina `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no `.env`, que têm prioridade sobre o padrão.

## Ligar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Authentication → Sign In / Providers → Email**, deixe o provider ligado. Para a conta entrar direto após o cadastro (sem clicar em link), desligue **Confirm email**.
3. Em **Authentication → URL configuration**, coloque a URL do site em *Site URL* e *Redirect URLs* (`http://localhost:5173` e a URL de produção).
5. Rode o arquivo `supabase/schema.sql` no SQL Editor.
6. Copie **Project URL** e **anon public key** para o `.env`:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

7. Depois do primeiro login da liderança:

```sql
update public.profiles set role = 'lider' where email = 'seu-gmail@gmail.com';
```

Só entram endereços `@gmail.com`. Quem é líder publica agenda, campanha e temas. Todo jovem autenticado vê o conteúdo, confirma presença e envia sugestões.

## Publicar no GitHub Pages

O deploy é automático: todo push na branch `main` roda o workflow `.github/workflows/deploy-pages.yml`, que builda e publica em `https://SEU-USUARIO.github.io/CRUD/`.

Para ativar (uma vez só):

1. No GitHub, abra **Settings → Pages** do repositório e em *Source* escolha **GitHub Actions**.
2. Em **Settings → Secrets and variables → Actions**, crie os segredos `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (a anon key é pública por natureza, sem problema em ir para o site).
3. No Supabase, adicione a URL do Pages em **Authentication → URL configuration**.

Sem os segredos o site publica em modo demonstração. O workflow também copia `index.html` para `404.html`, que faz o papel de rewrite da SPA no Pages.

Se um dia preferir Netlify ou Vercel, o repositório já tem `netlify.toml` e `vercel.json` prontos — mas o Pages atende bem.

## Identidade

- Nome: **Grupo Manancial**
- Igreja: **Jovens ADESA 829**
- Verso: João 7:38 — “rios de água viva correrão do seu interior.”
