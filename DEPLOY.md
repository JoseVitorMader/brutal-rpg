# 🚀 Guia de Deploy - BRUTAL RPG

## Opções de Deploy

### 1. Firebase Hosting (Recomendado)
**Vantagens:**
- Integração perfeita com Realtime Database
- SSL/HTTPS automático
- CDN global
- Plano gratuito generoso

#### Passo a Passo

**1. Instalar Firebase CLI:**
```bash
npm install -g firebase-tools
```

**2. Login no Firebase:**
```bash
firebase login
```

**3. Inicializar projeto:**
```bash
firebase init hosting
```

Selecione:
- ✅ Use existing project (selecione seu projeto)
- Public directory: `build`
- Configure as SPA: `Yes`
- Overwrite index.html: `No`
- Set up GitHub Actions: `No` (ou `Yes` se quiser CI/CD)

**4. Build da aplicação:**
```bash
npm run build
```

**5. Deploy:**
```bash
firebase deploy --only hosting
```

**6. Acessar:**
```
https://seu-projeto.web.app
ou
https://seu-projeto.firebaseapp.com
```

---

### 2. Vercel
**Vantagens:**
- Deploy extremamente simples
- Preview automático de PRs
- SSL automático

#### Passo a Passo

**1. Instalar Vercel CLI:**
```bash
npm install -g vercel
```

**2. Deploy:**
```bash
vercel
```

Siga as instruções interativas. Na primeira vez:
- Nome do projeto
- Diretório raiz: `.`
- Build command: `npm run build`
- Output directory: `build`

**3. Deploy de produção:**
```bash
vercel --prod
```

---

### 3. Netlify
**Vantagens:**
- Arrastar e soltar
- Formulários integrados
- Funções serverless

#### Método 1: Drag and Drop

1. Acesse [Netlify](https://www.netlify.com/)
2. Faça build local: `npm run build`
3. Arraste a pasta `build` para o site
4. Pronto!

#### Método 2: CLI

```bash
# Instalar
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build
```

---

### 4. GitHub Pages
**Vantagens:**
- Gratuito para repositórios públicos
- Integração com Git

#### Setup

**1. Instalar gh-pages:**
```bash
npm install --save-dev gh-pages
```

**2. Adicionar em package.json:**
```json
{
  "homepage": "https://seu-usuario.github.io/brutal-rpg",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

**3. Deploy:**
```bash
npm run deploy
```

---

## ⚙️ Variáveis de Ambiente

### Criar arquivo .env
```bash
# .env
REACT_APP_FIREBASE_API_KEY=sua_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://seu_projeto.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=seu_projeto
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Atualizar firebase.js
```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
```

### Configurar na Plataforma

**Vercel:**
```bash
vercel env add REACT_APP_FIREBASE_API_KEY
# Repita para cada variável
```

**Netlify:**
Site Settings → Build & Deploy → Environment → Add Variable

**Firebase Hosting:**
Não precisa! As variáveis vão no build.

---

## 🔒 Segurança Pré-Deploy

### 1. Atualizar Regras do Firebase
```json
{
  "rules": {
    "tables": {
      "$tableId": {
        "users": {
          ".read": true,
          ".write": true
        },
        "characters": {
          ".read": true,
          ".write": true
        },
        "monsters": {
          ".read": true,
          ".write": true
        },
        "rolls": {
          ".read": true,
          ".write": true
        }
      }
    }
  }
}
```

**⚠️ IMPORTANTE:** Estas regras são permissivas para facilitar uso. Para produção real, implemente autenticação!

### 2. Adicionar .env ao .gitignore
```bash
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### 3. Revisar package.json
Remova dependências de desenvolvimento não utilizadas.

---

## 📋 Checklist Pré-Deploy

- [ ] Build roda sem erros: `npm run build`
- [ ] Firebase configurado corretamente
- [ ] Regras de segurança atualizadas
- [ ] .env não está no Git
- [ ] Testes funcionam (se tiver)
- [ ] README atualizado
- [ ] Variáveis de ambiente configuradas na plataforma

---

## 🔄 Workflow de Deploy Automático (GitHub Actions)

### .github/workflows/deploy.yml
```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          REACT_APP_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          REACT_APP_FIREBASE_DATABASE_URL: ${{ secrets.FIREBASE_DATABASE_URL }}
          REACT_APP_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          REACT_APP_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          REACT_APP_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          REACT_APP_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
          
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: seu-projeto-firebase
```

**Configurar Secrets no GitHub:**
Settings → Secrets and variables → Actions → New repository secret

---

## 🎯 Deploy Rápido (Escolha um)

### Firebase (Melhor Opção)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Vercel (Mais Simples)
```bash
npm install -g vercel
vercel
# Siga as instruções
```

### Netlify (Drag & Drop)
```bash
npm run build
# Arraste pasta 'build' em netlify.com
```

---

## 📊 Monitoramento Pós-Deploy

### Firebase Analytics (Grátis)
1. Ative Analytics no console
2. Adicione ao firebase.js:
```javascript
import { getAnalytics } from "firebase/analytics";
const analytics = getAnalytics(app);
```

### Verificar
- ✅ Site carrega corretamente
- ✅ Login funciona
- ✅ Dados salvam no Firebase
- ✅ Rolagens aparecem em tempo real
- ✅ SSL/HTTPS ativo
- ✅ Responsivo em mobile

---

## 🆘 Troubleshooting Deploy

**Erro: "Firebase not configured"**
→ Verifique variáveis de ambiente

**Build falha**
→ `npm install` e tente novamente
→ Verifique node version: `node -v` (precisa ≥14)

**Site não carrega**
→ Verifique console do navegador (F12)
→ Certifique-se de que Firebase rules permitem acesso

**Dados não sincronizam**
→ Verifique databaseURL no .env
→ Teste localmente primeiro

---

## 🌐 Domínio Customizado

### Firebase Hosting
1. Console Firebase → Hosting → Add custom domain
2. Siga instruções de verificação DNS
3. Aguarde propagação (até 48h)

### Vercel/Netlify
Similar ao Firebase, mas interface da plataforma.

---

**Seu sistema BRUTAL RPG está pronto para o mundo! 🎲🌍**

*Lembre-se: Monitore uso do Firebase para não ultrapassar o plano gratuito!*
