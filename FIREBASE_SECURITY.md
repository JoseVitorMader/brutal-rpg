# 🔒 Regras de Segurança do Firebase

## ⚠️ IMPORTANTE

Após ativar o Firebase Authentication, você **DEVE** atualizar as regras de segurança do Realtime Database para proteger os dados dos usuários.

---

## 📋 Regras de Segurança Recomendadas

### Para Produção (USAR ESTAS!)

Cole estas regras no **Realtime Database → Rules** do Firebase Console:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "tables": {
      "$tableId": {
        ".read": "auth != null && root.child('tables/' + $tableId + '/members/' + auth.uid).exists()",
        ".write": "auth != null && root.child('tables/' + $tableId + '/members/' + auth.uid).exists()",
        
        "members": {
          "$memberId": {
            ".write": "auth != null && (
              !data.exists() || 
              $memberId === auth.uid ||
              root.child('tables/' + $tableId + '/members/' + auth.uid + '/role').val() === 'master'
            )"
          }
        },
        
        "characters": {
          "$userId": {
            ".read": "auth != null && root.child('tables/' + $tableId + '/members/' + auth.uid).exists()",
            ".write": "auth != null && (
              $userId === auth.uid || 
              root.child('tables/' + $tableId + '/members/' + auth.uid + '/role').val() === 'master'
            )"
          }
        },
        
        "monsters": {
          ".read": "auth != null && root.child('tables/' + $tableId + '/members/' + auth.uid).exists()",
          ".write": "auth != null && root.child('tables/' + $tableId + '/members/' + auth.uid + '/role').val() === 'master'"
        },
        
        "rolls": {
          ".read": "auth != null && root.child('tables/' + $tableId + '/members/' + auth.uid).exists()",
          ".write": "auth != null && root.child('tables/' + $tableId + '/members/' + auth.uid).exists()",
          ".indexOn": ["timestamp", "jogador"]
        }
      }
    }
  }
}
```

---

## 🔍 O que Essas Regras Fazem?

### `users/`
- ✅ **Leitura**: Apenas o próprio usuário
- ✅ **Escrita**: Apenas o próprio usuário
- 🔒 **Proteção**: Dados pessoais privados

### `tables/{tableId}/`
- ✅ **Leitura/Escrita**: Apenas membros da mesa
- 🔒 **Proteção**: Usuários não podem ver mesas que não participam

### `tables/{tableId}/members/`
- ✅ **Escrita**: 
  - Qualquer usuário pode se adicionar (entrar na mesa)
  - Usuário pode editar seus próprios dados
  - Mestre pode editar dados de qualquer membro
- 🔒 **Proteção**: Apenas membros podem alterar

### `tables/{tableId}/characters/`
- ✅ **Leitura**: Todos os membros da mesa
- ✅ **Escrita**: 
  - Dono do personagem
  - Mestre da mesa
- 🔒 **Proteção**: Jogadores não podem editar fichas alheias

### `tables/{tableId}/monsters/`
- ✅ **Leitura**: Todos os membros
- ✅ **Escrita**: Apenas o mestre
- 🔒 **Proteção**: Apenas mestre cria/edita criaturas

### `tables/{tableId}/rolls/`
- ✅ **Leitura**: Todos os membros
- ✅ **Escrita**: Todos os membros
- ✅ **Índice**: Otimizado para buscar por timestamp e jogador
- 🔒 **Proteção**: Todos veem, todos podem rolar

---

## 🚀 Como Aplicar as Regras

### Passo 1: Firebase Console
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Menu lateral → **Realtime Database**
4. Aba **"Rules"** (Regras)

### Passo 2: Cole as Regras
1. Apague as regras antigas
2. Cole as regras de produção acima
3. Clique em **"Publicar"** ou **"Publish"**

### Passo 3: Teste
1. Faça login na aplicação
2. Tente criar uma mesa
3. Tente entrar em uma mesa
4. Verifique se tudo funciona

---

## ⚠️ Regras para Desenvolvimento (NÃO USE EM PRODUÇÃO!)

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**ATENÇÃO:** Estas regras permitem que **QUALQUER PESSOA** leia e escreva em seu banco de dados!

**Use apenas para:**
- ✅ Testes locais
- ✅ Desenvolvimento inicial
- ✅ Debugging

**NUNCA use em produção!**

---

## 🔐 Ativar Firebase Authentication

### Passo 1: Console do Firebase
1. Menu lateral → **Authentication**
2. Aba **"Sign-in method"**
3. Clique em **"Email/Password"**
4. **Ative** a opção
5. Salve

### Passo 2: Configurar Email (Opcional)
- **Templates de Email**: Personalize emails de recuperação
- **Domínio Autorizado**: Configure seu domínio
- **Ações por Email**: Configure URLs de redirecionamento

---

## 📊 Estrutura de Permissões

### Quem Pode Fazer O Quê?

| Ação | Mestre | Jogador | Não-Membro |
|------|--------|---------|------------|
| Ver dados da mesa | ✅ | ✅ | ❌ |
| Criar mesa | ✅ | ✅ | ❌ |
| Entrar em mesa | ✅ | ✅ | ❌ |
| Ver fichas | ✅ | ✅ (da mesa) | ❌ |
| Editar própria ficha | ✅ | ✅ | ❌ |
| Editar ficha alheia | ✅ | ❌ | ❌ |
| Criar criaturas | ✅ | ❌ | ❌ |
| Editar criaturas | ✅ | ❌ | ❌ |
| Ver rolagens | ✅ | ✅ (da mesa) | ❌ |
| Fazer rolagens | ✅ | ✅ | ❌ |
| Remover membros | ✅ | ❌ | ❌ |

---

## 🧪 Testando as Regras

### No Firebase Console:

1. Vá para **Realtime Database → Rules**
2. Clique em **"Simulator"** (Simulador)
3. Configure:
   - **Tipo**: Read ou Write
   - **Local**: Caminho (ex: `/tables/abc123/characters/user1`)
   - **Autenticação**: Simule um usuário autenticado
4. Clique em **"Run"** (Executar)
5. Veja se é **Permitido** ou **Negado**

### Exemplos de Teste:

```javascript
// Teste 1: Usuário pode ler própria ficha?
Location: /tables/mesa123/characters/user1
Auth: { uid: "user1" }
Type: Read
Resultado: ✅ Permitido (se user1 é membro)

// Teste 2: Jogador pode criar criatura?
Location: /tables/mesa123/monsters
Auth: { uid: "user2", role: "player" }
Type: Write
Resultado: ❌ Negado (apenas mestre)

// Teste 3: Não-membro pode ver mesa?
Location: /tables/mesa123
Auth: { uid: "user3" } (não é membro)
Type: Read
Resultado: ❌ Negado
```

---

## 🔧 Regras Adicionais (Opcionais)

### Limitar Tamanho de Dados

```json
{
  "rules": {
    "tables": {
      "$tableId": {
        "characters": {
          "$userId": {
            ".validate": "newData.child('nome').val().length <= 50"
          }
        }
      }
    }
  }
}
```

### Validar Tipos de Dados

```json
{
  "rules": {
    "tables": {
      "$tableId": {
        "characters": {
          "$userId": {
            "tensao": {
              ".validate": "newData.isNumber() && newData.val() >= 0"
            }
          }
        }
      }
    }
  }
}
```

### Índices para Performance

```json
{
  "rules": {
    "tables": {
      "$tableId": {
        "rolls": {
          ".indexOn": ["timestamp", "jogador", "pericia"]
        },
        "characters": {
          ".indexOn": ["nome", "arquetipo"]
        }
      }
    }
  }
}
```

---

## 🚨 Avisos de Segurança

### ⚠️ NUNCA Faça:
- ❌ Deixar regras abertas em produção
- ❌ Compartilhar chaves privadas no código
- ❌ Expor dados sensíveis no banco
- ❌ Confiar apenas no frontend

### ✅ SEMPRE Faça:
- ✅ Use regras de segurança robustas
- ✅ Valide dados no backend (regras)
- ✅ Use variáveis de ambiente para credenciais
- ✅ Monitore uso e logs do Firebase
- ✅ Teste regras antes de publicar

---

## 📈 Monitoramento

### Firebase Console - Usage

1. **Realtime Database → Usage**
2. Monitore:
   - Conexões simultâneas
   - Bandwidth (tráfego)
   - Storage (armazenamento)
   - Leituras/Escritas

### Alertas

1. Configure alertas de uso
2. Receba notificações de atividades suspeitas
3. Monitore custos (se usar plano pago)

---

## 🎯 Checklist de Segurança

Antes de lançar em produção:

- [ ] Firebase Authentication ativado
- [ ] Regras de segurança aplicadas
- [ ] Regras testadas no simulador
- [ ] Dados sensíveis em variáveis de ambiente
- [ ] Domínio autorizado configurado
- [ ] Templates de email configurados
- [ ] Índices de performance criados
- [ ] Monitoramento ativado
- [ ] Backup configurado (se necessário)
- [ ] Plano de custos avaliado

---

## 📚 Recursos Adicionais

- [Documentação Oficial - Firebase Security Rules](https://firebase.google.com/docs/database/security)
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Melhores Práticas de Segurança](https://firebase.google.com/docs/database/security/securing-data)

---

**Proteja seus dados e seus jogadores! 🛡️🔥**
