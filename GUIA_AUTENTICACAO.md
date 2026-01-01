# 🎮 Guia Rápido - Sistema de Autenticação e Mesas

## ✨ Novidades Implementadas

### 🔐 Sistema de Autenticação
- ✅ Cadastro de usuários com email e senha
- ✅ Login seguro com Firebase Authentication
- ✅ Recuperação de senha por email
- ✅ Persistência automática de sessão

### 🎲 Sistema de Mesas
- ✅ Criar mesas (criador = mestre automático)
- ✅ Entrar em mesas existentes como jogador
- ✅ Dashboard com "Minhas Mesas" e "Minhas Fichas"
- ✅ Copiar ID da mesa para compartilhar
- ✅ Múltiplas mesas por usuário

---

## 🚀 Como Usar

### 1️⃣ Primeiro Acesso - Cadastro

1. Abra a aplicação
2. Clique em **"Cadastro"**
3. Preencha:
   - **Nome de Exibição**: Como você quer ser chamado
   - **Email**: Seu email
   - **Senha**: Mínimo 6 caracteres
   - **Confirmar Senha**: Mesma senha
4. Clique em **"Criar Conta"**

### 2️⃣ Login

1. Digite seu **email**
2. Digite sua **senha**
3. Clique em **"Entrar"**

**Esqueceu a senha?**
- Digite seu email
- Clique em **"Esqueci minha senha"**
- Verifique seu email para redefinir

---

## 🎩 Para Mestres - Criar Mesa

### Passo a Passo:

1. **No Dashboard**, clique em **"➕ Criar Mesa"**

2. **Preencha os dados:**
   - **Nome da Mesa**: Ex: "Campanha de Terror"
   - **Descrição**: Opcional (ex: "Uma aventura de sobrevivência")

3. **Clique em "Criar Mesa"**
   - Você será automaticamente o **Mestre** desta mesa

4. **Compartilhe o ID:**
   - Clique no **ID da mesa** no card
   - O ID será copiado automaticamente
   - Envie para seus jogadores

### Exemplo de ID:
```
-NxK8s9dT2jL3mP4qR5v
```

---

## 🎭 Para Jogadores - Entrar em Mesa

### Passo a Passo:

1. **Peça o ID da mesa** ao seu mestre

2. **No Dashboard**, clique em **"🚪 Entrar em Mesa"**

3. **Cole o ID da mesa** que o mestre compartilhou

4. **Clique em "Entrar"**
   - Você entrará automaticamente como **Jogador**

5. **A mesa aparecerá** em "Minhas Mesas"

---

## 📋 Dashboard - Navegação

### Aba "🎲 Minhas Mesas"

**Mostra todas as mesas** que você criou ou entrou:

#### Card de Mesa contém:
- **Nome da Mesa**
- **Badge de Cargo**: 🎩 Mestre ou 🎭 Jogador
- **Descrição**
- **Número de membros**
- **ID da Mesa** (clique para copiar)
- **Botão "Entrar na Mesa"**

#### Ações:
- **Criar Mesa**: Você vira mestre
- **Entrar em Mesa**: Você vira jogador

---

### Aba "📋 Minhas Fichas"

**Mostra todos os personagens** que você criou:

#### Card de Personagem contém:
- **Nome do personagem**
- **Arquétipo**
- **Imagem** (se houver)
- **Mesa** onde o personagem está
- **Recursos**: Dados e Fuga

---

## 🎯 Fluxo Completo de Uso

### Como Mestre:

```
1. Cadastrar/Login
   ↓
2. Dashboard → Criar Mesa
   ↓
3. Copiar ID da mesa
   ↓
4. Compartilhar ID com jogadores
   ↓
5. Entrar na Mesa
   ↓
6. Interface do Mestre
   ├─ Rolagens
   ├─ Fichas dos Jogadores
   ├─ Criaturas
   └─ Anotações
```

### Como Jogador:

```
1. Cadastrar/Login
   ↓
2. Dashboard → Entrar em Mesa
   ↓
3. Colar ID recebido do mestre
   ↓
4. Entrar na Mesa
   ↓
5. Criar/Editar Ficha
   ↓
6. Jogar!
```

---

## 💡 Dicas Importantes

### Para Mestres:
✅ **Guarde o ID da mesa** - Você precisará compartilhar
✅ **Você pode participar de várias mesas** - Como mestre ou jogador
✅ **O ID é único** - Cada mesa tem um ID diferente
✅ **Não precisa criar conta para cada mesa** - Use a mesma conta

### Para Jogadores:
✅ **Peça o ID ao mestre** - Você precisa disso para entrar
✅ **Você pode ter personagens em várias mesas**
✅ **Suas fichas são salvas automaticamente**
✅ **Você pode ver todas suas fichas** no Dashboard

### Para Todos:
✅ **Sua sessão fica salva** - Não precisa fazer login toda vez
✅ **Múltiplas mesas simultaneamente** - Sem problemas!
✅ **Voltar ao Dashboard** - Use o botão "← Voltar ao Dashboard"
✅ **Sair da conta** - Use o botão "Sair" no canto superior

---

## 🔒 Segurança

### Senhas:
- Mínimo **6 caracteres**
- Armazenadas de forma **criptografada**
- Use senhas **fortes e únicas**

### Recuperação de Senha:
1. Digite seu email no login
2. Clique em "Esqueci minha senha"
3. Verifique seu **email**
4. Siga o link para redefinir

---

## 🆘 Problemas Comuns

### "Email já está em uso"
→ Você já tem conta. Use o Login.

### "Usuário não encontrado"
→ Email não cadastrado. Faça o Cadastro.

### "Senha incorreta"
→ Verifique a senha ou use "Esqueci minha senha"

### "Mesa não encontrada"
→ Verifique se o ID está correto

### "Você já está nesta mesa"
→ Normal! Vá para "Minhas Mesas" e entre

### Não vejo minhas fichas
→ Certifique-se de ter criado personagens nas mesas

---

## 📊 Estrutura de Dados

### Firebase Realtime Database:

```
brutal-rpg/
├── users/
│   └── {userId}/
│       ├── email
│       ├── displayName
│       └── createdAt
│
└── tables/
    └── {tableId}/
        ├── name
        ├── description
        ├── createdBy
        ├── createdAt
        ├── members/
        │   └── {userId}/
        │       ├── role (master/player)
        │       ├── displayName
        │       └── joinedAt
        ├── characters/
        │   └── {userId}/
        │       └── ... (dados da ficha)
        ├── monsters/
        └── rolls/
```

---

## 🎨 Diferenças do Sistema Antigo

### Antes:
- ❌ Sem cadastro
- ❌ Login simples por nome
- ❌ Uma mesa por vez
- ❌ Sem gerenciamento

### Agora:
- ✅ **Cadastro completo** com email/senha
- ✅ **Autenticação segura** com Firebase
- ✅ **Múltiplas mesas** por usuário
- ✅ **Dashboard** para gerenciar tudo
- ✅ **Persistência de sessão** automática
- ✅ **Recuperação de senha**
- ✅ **Organização** por mesas
- ✅ **Convite via ID**

---

## ✨ Recursos Especiais

### Dashboard:
- 📊 Visão geral de todas as mesas
- 📋 Todos os personagens em um lugar
- 🎲 Acesso rápido às mesas
- 🔄 Navegação fluida

### Sistema de Mesas:
- 🎩 Mestre automático ao criar
- 🎭 Jogadores por convite
- 📋 ID único e copiável
- 👥 Contador de membros

### Autenticação:
- 🔐 Segurança com Firebase Auth
- 📧 Recuperação por email
- 💾 Sessão persistente
- 🔄 Logout em qualquer tela

---

## 🚀 Começando Agora!

### Mestre - Primeira Sessão:
1. ✅ Cadastre-se
2. ✅ Crie uma mesa
3. ✅ Copie o ID
4. ✅ Envie para os jogadores
5. ✅ Entre na mesa
6. ✅ Crie criaturas/NPCs
7. ✅ Espere os jogadores entrarem
8. ✅ Comece a jogar!

### Jogador - Primeira Sessão:
1. ✅ Cadastre-se
2. ✅ Pegue o ID com o mestre
3. ✅ Entre na mesa
4. ✅ Crie sua ficha
5. ✅ Comece a jogar!

---

**Sistema pronto para criar aventuras épicas! 🎲🔥**

*Boa sorte em suas campanhas de BRUTAL RPG!*
