# Grupo Manancial · Jovens ADESA 829

Portal da juventude: agenda, lembrete do próximo encontro, sugestões, campanhas e temas de estudo. O login é feito com Gmail pelo Supabase.

## Rodar localmente

```bash
npm install
cp .env.example .env
npm run dev
```

Sem as chaves do Supabase, o site abre em **modo demonstração** (entrada como jovem ou líder, dados de exemplo).

## Ligar o Supabase e o Gmail

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Authentication → Providers**, ative o **Google**.
3. No Google Cloud, crie credenciais OAuth (tipo *Web application*) e cole Client ID / Secret no Supabase.
4. Em **Authentication → URL configuration**, coloque a URL do site em *Site URL* e *Redirect URLs* (`http://localhost:5173` e a URL de produção).
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

Quem é líder publica agenda, campanha e temas. Todo jovem autenticado vê o conteúdo, confirma presença e envia sugestões.

## Publicar

O `npm run build` gera a pasta `dist`. O repositório já inclui `netlify.toml` e `vercel.json` para o roteamento da SPA.

## Identidade

- Nome: **Grupo Manancial**
- Igreja: **Jovens ADESA 829**
- Verso: João 7:38 — “rios de água viva correrão do seu interior.”
