# 🔥 Guia de Configuração do Firebase

## Passo a Passo para Configurar o Firebase Realtime Database

### 1. Criar Conta e Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Faça login com sua conta Google
3. Clique em **"Adicionar projeto"** ou **"Create a project"**
4. Nomeie o projeto (ex: "brutal-rpg")
5. (Opcional) Desative o Google Analytics se não for usar
6. Clique em **"Criar projeto"**

### 2. Configurar Realtime Database

1. No menu lateral, clique em **"Realtime Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha a localização do servidor (recomendado: `us-central1`)
4. Selecione o modo de segurança:
   - Para desenvolvimento: **"Iniciar no modo de teste"**
   - Para produção: **"Iniciar no modo bloqueado"** (configurar regras depois)
5. Clique em **"Ativar"**

### 3. Configurar Regras de Segurança

#### Para Desenvolvimento (NÃO USAR EM PRODUÇÃO!)
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

#### Para Produção (Recomendado)
```json
{
  "rules": {
    "tables": {
      "$tableId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

**⚠️ AVISO:** As regras acima permitem leitura e escrita para qualquer usuário. Para produção real, implemente autenticação adequada!

### 4. Obter Credenciais do Projeto

1. Clique no ícone de **engrenagem** ⚙️ ao lado de "Visão geral do projeto"
2. Selecione **"Configurações do projeto"**
3. Role até a seção **"Seus aplicativos"**
4. Clique no ícone **</>** (Web)
5. Registre um apelido para o app (ex: "brutal-rpg-web")
6. **NÃO** marque "Também configure o Firebase Hosting"
7. Clique em **"Registrar app"**
8. Copie o objeto `firebaseConfig` que aparece

### 5. Adicionar Credenciais no Projeto

Abra o arquivo `src/firebase.js` e substitua os valores de exemplo pelas suas credenciais:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "seu-projeto.firebaseapp.com",
  databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### 6. Estrutura do Banco de Dados

O sistema criará automaticamente a seguinte estrutura:

```
brutal-rpg-database/
└── tables/
    └── {tableId}/
        ├── users/
        │   └── {userId}/
        │       ├── username
        │       ├── role (player/master)
        │       └── createdAt
        ├── characters/
        │   └── {userId}/
        │       ├── nome
        │       ├── pronomes
        │       ├── interprete
        │       ├── arquetipo
        │       ├── apegos/
        │       ├── pilhaDados[]
        │       ├── pilhaFuga[]
        │       ├── pericias/
        │       └── ... (outros campos)
        └── rolls/
            └── {rollId}/
                ├── jogador
                ├── pericia
                ├── dados[]
                ├── sucessos
                └── timestamp
```

### 7. Testar Conexão

1. Execute `npm start` no projeto
2. Faça login com qualquer nome de usuário e ID de mesa
3. Verifique no Firebase Console se os dados aparecem no Realtime Database

### 8. Monitorar Dados em Tempo Real

No Firebase Console:
1. Acesse **Realtime Database**
2. Você verá os dados sendo atualizados em tempo real conforme os usuários interagem com o sistema

---

## 🔒 Segurança em Produção

Para um ambiente de produção, considere:

### 1. Implementar Autenticação
```javascript
// Adicione Firebase Authentication
import { getAuth, signInAnonymously } from 'firebase/auth';
```

### 2. Regras de Segurança Avançadas
```json
{
  "rules": {
    "tables": {
      "$tableId": {
        "users": {
          "$userId": {
            ".read": "auth != null",
            ".write": "auth != null && auth.uid == $userId"
          }
        },
        "characters": {
          "$userId": {
            ".read": "auth != null",
            ".write": "auth != null && (auth.uid == $userId || data.parent().parent().child('users/' + auth.uid + '/role').val() == 'master')"
          }
        },
        "rolls": {
          ".read": "auth != null",
          ".write": "auth != null"
        }
      }
    }
  }
}
```

### 3. Variáveis de Ambiente
Mova as credenciais do Firebase para variáveis de ambiente:

```javascript
// .env
REACT_APP_FIREBASE_API_KEY=sua_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_auth_domain
REACT_APP_FIREBASE_DATABASE_URL=sua_database_url
REACT_APP_FIREBASE_PROJECT_ID=seu_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=seu_app_id
```

```javascript
// firebase.js
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

---

## 📊 Monitoramento e Custos

### Limites do Plano Gratuito (Spark Plan)
- **Armazenamento:** 1 GB
- **Download:** 10 GB/mês
- **Conexões simultâneas:** 100

### Quando Considerar Upgrade
- Se tiver mais de 100 jogadores simultâneos
- Se ultrapassar 10 GB de download/mês
- Se precisar de suporte prioritário

---

## 🆘 Problemas Comuns

### Erro: "Permission denied"
**Solução:** Verifique as regras de segurança no console do Firebase

### Erro: "Database URL not found"
**Solução:** Certifique-se de que a `databaseURL` está correta no `firebaseConfig`

### Dados não aparecem em tempo real
**Solução:** Verifique sua conexão com a internet e se o Firebase está ativo

---

## ✅ Checklist de Configuração

- [ ] Projeto criado no Firebase Console
- [ ] Realtime Database ativado
- [ ] Regras de segurança configuradas
- [ ] App Web registrado
- [ ] Credenciais copiadas para `src/firebase.js`
- [ ] Dependências instaladas (`npm install`)
- [ ] Aplicação testada (`npm start`)
- [ ] Dados aparecendo no Firebase Console

---

**Pronto! Seu sistema BRUTAL RPG está conectado ao Firebase!** 🎉
