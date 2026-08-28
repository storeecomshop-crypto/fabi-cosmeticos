# Fabi Cosméticos — Sistema de Gestão

Protótipo funcional (React + Vite) com PDV, estoque, vendas, comissões, produtos, clientes, vendedores e dashboard.

Os dados ficam salvos no **localStorage do navegador** (arquivo `src/storagePolyfill.js`), ou seja, ficam gravados
no dispositivo de quem está usando o site. Isso é suficiente para uso individual / demonstração, mas não sincroniza
dados entre dispositivos diferentes. Para uso real com múltiplos usuários/dispositivos, o próximo passo seria trocar
esse arquivo por chamadas a um banco de dados real (Supabase, Firebase, Postgres etc).

## Rodando localmente

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

## Publicando na Vercel

### Opção A — pelo site da Vercel (mais simples)

1. Crie um repositório no GitHub e suba esta pasta para lá (veja os comandos abaixo).
2. Acesse https://vercel.com, entre com sua conta (pode ser com GitHub).
3. Clique em **Add New → Project**.
4. Selecione o repositório que você acabou de criar.
5. A Vercel detecta automaticamente que é um projeto Vite — não precisa mudar nada.
6. Clique em **Deploy** e aguarde. Em cerca de 1 minuto você recebe uma URL pública (ex: `fabi-cosmeticos.vercel.app`).

Comandos para subir a pasta ao GitHub (rode dentro desta pasta):

```bash
git init
git add .
git commit -m "Primeira versão do sistema Fabi Cosméticos"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/fabi-cosmeticos.git
git push -u origin main
```

(Troque `SEU-USUARIO` pelo seu usuário do GitHub, e crie o repositório vazio antes em github.com/new)

### Opção B — pelo terminal, sem GitHub

1. Instale a CLI da Vercel (uma vez só):
   ```bash
   npm install -g vercel
   ```
2. Dentro desta pasta, rode:
   ```bash
   vercel
   ```
3. Responda as perguntas (pode aceitar todas as opções padrão). Na primeira vez ele pede para logar (abre o navegador).
4. Ao final ele te dá uma URL de teste. Para publicar em definitivo (produção), rode:
   ```bash
   vercel --prod
   ```

## Próximos passos sugeridos

- Trocar `src/storagePolyfill.js` por um banco de dados real, se for usar em mais de um dispositivo/computador.
- Adicionar autenticação (administrador x vendedora) antes de usar em produção.
- Configurar backup automático dos dados.
