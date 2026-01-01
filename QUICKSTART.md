# 🚀 Início Rápido - BRUTAL RPG

## ⚡ Setup Rápido (5 minutos)

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um projeto novo
3. Ative **Realtime Database**
4. Copie as credenciais do projeto
5. Cole no arquivo `src/firebase.js`

**Configuração mínima para teste:**
```javascript
// src/firebase.js
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**Regras de Segurança (modo teste):**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### 3️⃣ Executar
```bash
npm start
```

Abre automaticamente em `http://localhost:3000`

---

## 🎮 Primeiros Passos

### Como Mestre:
1. Login → Digite seu nome
2. Crie um **ID de Mesa** (ex: "mesa_teste")
3. Selecione **"Mestre"** → Entrar
4. Compartilhe o ID da mesa com os jogadores
5. Use as abas:
   - 🎲 **Rolagens** - Veja dados em tempo real
   - 📋 **Fichas** - Monitore personagens
   - 👹 **Criaturas** - Crie NPCs/Monstros
   - 📝 **Anotações** - Notas de campanha

### Como Jogador:
1. Login → Digite seu nome
2. Use o **ID da Mesa** do mestre
3. Selecione **"Jogador"** → Entrar
4. Preencha sua ficha de personagem
5. Role dados usando o sistema de rolagem

---

## 📁 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `src/firebase.js` | ⚙️ Configuração do Firebase (EDITE AQUI) |
| `src/components/Login.js` | 🔐 Tela de login |
| `src/components/CharacterSheet.js` | 📄 Ficha de personagem |
| `src/components/MasterInterface.js` | 🎩 Interface do mestre |
| `src/components/DiceRoller.js` | 🎲 Sistema de dados |
| `src/components/MonsterSheet.js` | 👹 Ficha de criaturas |

---

## 🎲 Mecânicas do Sistema BRUTAL

### Rolagem de Dados
- Dados: **d6** (seis lados)
- Sucesso **SEM treino**: 4, 5 ou 6
- Sucesso **COM treino**: 3, 4, 5 ou 6
- Fracassos removem dados da pilha

### Recursos
- **Pilha de Dados**: Máximo 6 (use em rolagens)
- **Pilha de Fuga**: 7 espaços (pânico/trauma)
- **Feridas**: 5 níveis de gravidade
- **Tensão**: Compra vantagens

### Perícias (Escolha 2 para Treinar)
1. 🤸 **Agilidade** - Movimento, esquiva
2. 🧠 **Astúcia** - Investigação, percepção
3. 💪 **Força** - Combate, força bruta
4. 💬 **Carisma** - Persuasão, socialização
5. ❤️ **Vigor** - Resistência, sobrevivência

---

## 🔧 Troubleshooting Rápido

**Erro: "Firebase not configured"**
→ Edite `src/firebase.js` com suas credenciais

**Dados não salvam**
→ Verifique regras do Firebase (deve permitir escrita)

**Não vejo rolagens dos outros**
→ Certifique-se de usar o mesmo ID de mesa

**Aplicação não inicia**
→ Execute `npm install` novamente

---

## 📚 Documentação Completa

- 📖 **README.md** - Visão geral completa
- 🔥 **FIREBASE_SETUP.md** - Guia detalhado do Firebase
- 📘 **MANUAL_USUARIO.md** - Manual completo para jogadores e mestres
- 📊 **firebase-data-example.json** - Exemplo de estrutura de dados

---

## 🎯 Próximas Sessões

### Preparação do Mestre:
1. ✅ Configure o Firebase
2. ✅ Crie a mesa
3. ✅ Compartilhe ID com jogadores
4. ✅ Crie criaturas/NPCs antecipadamente
5. ✅ Faça anotações na aba de notas

### Preparação dos Jogadores:
1. ✅ Receba ID da mesa do mestre
2. ✅ Faça login
3. ✅ Preencha ficha completa
4. ✅ Escolha 2 perícias treinadas
5. ✅ Defina seus apegos

---

## 💡 Dicas Rápidas

✨ **Mestre:** Mantenha a aba de rolagens aberta durante o jogo
✨ **Jogadores:** Não rolem todos os dados de uma vez!
✨ **Todos:** Conexão com internet é necessária
✨ **Geral:** Tema escuro otimizado para sessões longas

---

## 🆘 Suporte e Ajuda

Problema? Veja nesta ordem:
1. Este arquivo (QUICKSTART.md)
2. FIREBASE_SETUP.md para problemas de configuração
3. MANUAL_USUARIO.md para dúvidas de uso
4. Console do navegador (F12) para erros técnicos

---

**Pronto para jogar! Boa sorte e boas rolagens! 🎲🔥**

*Criado para o sistema de RPG BRUTAL*
