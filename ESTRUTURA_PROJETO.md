# 📁 Estrutura do Projeto - BRUTAL RPG

## 🗂️ Árvore de Arquivos

```
brutal-rpg/
├── public/
│   ├── index.html              # HTML principal
│   ├── manifest.json            # Manifesto PWA
│   └── robots.txt               # Config para crawlers
│
├── src/
│   ├── components/              # Componentes React
│   │   ├── Login.js             # Tela de login
│   │   ├── Login.css            # Estilos do login
│   │   ├── CharacterSheet.js    # Ficha de personagem
│   │   ├── CharacterSheet.css   # Estilos da ficha
│   │   ├── DiceRoller.js        # Sistema de rolagem
│   │   ├── DiceRoller.css       # Estilos do rolador
│   │   ├── MasterInterface.js   # Interface do mestre
│   │   ├── MasterInterface.css  # Estilos do mestre
│   │   ├── MonsterSheet.js      # Ficha de criaturas
│   │   └── MonsterSheet.css     # Estilos de criaturas
│   │
│   ├── firebase.js              # ⚙️ Configuração Firebase
│   ├── App.js                   # Componente raiz
│   ├── App.css                  # Estilos globais da app
│   ├── index.js                 # Entry point React
│   ├── index.css                # Estilos globais base
│   ├── App.test.js              # Testes (opcional)
│   ├── setupTests.js            # Config de testes
│   └── reportWebVitals.js       # Métricas de performance
│
├── .gitignore                   # Arquivos ignorados pelo git
├── package.json                 # Dependências e scripts
├── package-lock.json            # Lock de versões
│
├── README.md                    # 📖 Documentação principal
├── QUICKSTART.md                # 🚀 Início rápido
├── FIREBASE_SETUP.md            # 🔥 Guia do Firebase
├── FIREBASE_API_EXAMPLES.md     # 🔌 Exemplos de código
├── MANUAL_USUARIO.md            # 📘 Manual do usuário
├── ESTRUTURA_PROJETO.md         # 📁 Este arquivo
└── firebase-data-example.json   # 📊 Exemplo de dados
```

## 📦 Componentes Principais

### 1. Login.js
**Responsabilidade:** Autenticação e criação de sessão
**Props:** `onLogin(userData)`
**Estado:**
- `username` - Nome do usuário
- `tableId` - ID da mesa
- `role` - Cargo (player/master)

**Firebase:**
- Cria/busca usuário em `tables/{tableId}/users/{userId}`

---

### 2. CharacterSheet.js
**Responsabilidade:** Ficha completa do personagem
**Props:** `user` (objeto com userId, tableId, role)
**Estado:**
- `character` - Objeto completo da ficha
  - Informações básicas
  - Apegos
  - Pilhas (dados e fuga)
  - Perícias
  - Vantagens
  - Recursos

**Firebase:**
- Lê/escreve em `tables/{tableId}/characters/{userId}`
- Sincronização em tempo real

**Componentes Filhos:**
- `<DiceRoller>` - Sistema de rolagem

---

### 3. DiceRoller.js
**Responsabilidade:** Sistema de rolagem de dados
**Props:**
- `user` - Dados do usuário
- `character` - Dados do personagem
- `updateCharacter` - Função para atualizar ficha

**Estado:**
- `numDados` - Quantidade de dados
- `periciaSelecionada` - Perícia escolhida
- `resultado` - Resultado da última rolagem

**Firebase:**
- Salva rolagens em `tables/{tableId}/rolls/{rollId}`
- Atualiza pilha de dados do personagem

---

### 4. MasterInterface.js
**Responsabilidade:** Interface completa do mestre
**Props:** `user`
**Estado:**
- `characters` - Lista de personagens
- `rolls` - Lista de rolagens
- `monsters` - Lista de criaturas
- `selectedCharacter` - Personagem selecionado
- `selectedMonster` - Criatura selecionada
- `activeTab` - Aba ativa
- `notes` - Anotações do mestre
- `showMonsterSheet` - Controle do modal

**Firebase:**
- Escuta `tables/{tableId}/characters`
- Escuta `tables/{tableId}/rolls`
- Escuta `tables/{tableId}/monsters`

**Componentes Filhos:**
- `<MonsterSheet>` - Ficha de criaturas

---

### 5. MonsterSheet.js
**Responsabilidade:** Criar/editar fichas de criaturas
**Props:**
- `monster` - Dados da criatura (null para nova)
- `onUpdate(monsterData)` - Callback para salvar
- `onClose()` - Fechar modal

**Estado:**
- `monsterData` - Objeto da criatura
  - Nome, descrição
  - Perícias
  - Pilha de dados
  - Habilidades especiais
  - Fraquezas

**Firebase:**
- Salva em `tables/{tableId}/monsters/{monsterId}`

---

## 🎨 Estrutura de Estilos

### Tema de Cores
```css
--bg-primary: #1a1a2e;      /* Fundo principal */
--bg-secondary: #0f3460;    /* Fundo secundário */
--bg-tertiary: #16213e;     /* Fundo terciário */
--accent: #e94560;          /* Cor de destaque */
--accent-dark: #d63447;     /* Destaque escuro */
--border: #533483;          /* Bordas */
--text-primary: #fff;       /* Texto principal */
--text-secondary: #b8b8d1;  /* Texto secundário */
--success: #51cf66;         /* Sucesso */
--failure: #ff6b6b;         /* Falha */
--warning: #ff922b;         /* Aviso */
```

### Padrões de Layout
```css
/* Cards */
.card {
  background: var(--bg-secondary);
  border: 2px solid var(--border);
  border-radius: 10px;
  padding: 20px;
}

/* Botões */
.button {
  background: var(--accent);
  color: var(--text-primary);
  border: none;
  border-radius: 8px;
  padding: 12px 25px;
  cursor: pointer;
}

/* Inputs */
.input {
  background: var(--bg-tertiary);
  border: 2px solid var(--border);
  color: var(--text-primary);
  padding: 10px;
  border-radius: 5px;
}
```

---

## 🔥 Estrutura de Dados Firebase

### Hierarquia
```
firebase-database/
└── tables/
    └── {tableId}/
        ├── users/
        │   └── {userId}/
        │       ├── username: string
        │       ├── role: "player" | "master"
        │       ├── tableId: string
        │       └── createdAt: timestamp
        │
        ├── characters/
        │   └── {userId}/
        │       ├── nome: string
        │       ├── pronomes: string
        │       ├── interprete: string
        │       ├── arquetipo: string
        │       ├── apegos/
        │       │   ├── itemIconico: string
        │       │   ├── relacaoAfetiva: string
        │       │   └── desejoObscuro: string
        │       ├── pilhaDados: boolean[]
        │       ├── pilhaFuga: boolean[]
        │       ├── marcadores: string
        │       ├── ferida/
        │       │   ├── descricao: string
        │       │   └── niveis: boolean[]
        │       ├── pericias/
        │       │   ├── Agilidade/
        │       │   │   └── treinada: boolean
        │       │   └── ... (outras perícias)
        │       ├── habilidades: string
        │       ├── aparencia: string (URL)
        │       ├── tensao: number
        │       ├── vantagensGerais/
        │       │   ├── choqueRealidade: boolean
        │       │   ├── cuidarFeridas: boolean
        │       │   └── tomarJeito: boolean
        │       └── vantagensEspecialidade/
        │           ├── ombroAmigo: boolean
        │           ├── adrenalina: boolean
        │           ├── cacarRecurso: boolean
        │           ├── prepararProxima: boolean
        │           └── naoEsperaPorMim: boolean
        │
        ├── monsters/
        │   └── {monsterId}/
        │       ├── nome: string
        │       ├── descricao: string
        │       ├── aparencia: string (URL)
        │       ├── pericias: { [key]: { treinada: boolean } }
        │       ├── pilhaDados: boolean[]
        │       ├── ferida/
        │       │   ├── descricao: string
        │       │   └── niveis: boolean[]
        │       ├── habilidadesEspeciais: string
        │       ├── fraquezas: string
        │       └── objetivo: string
        │
        └── rolls/
            └── {rollId}/
                ├── jogador: string
                ├── pericia: string
                ├── treinada: boolean
                ├── numDados: number
                ├── dados: number[]
                ├── sucessos: number
                ├── fracassos: number
                ├── valorSucesso: number
                └── timestamp: number
```

---

## 🚀 Scripts NPM

```json
{
  "start": "react-scripts start",      // Desenvolvimento
  "build": "react-scripts build",      // Build para produção
  "test": "react-scripts test",        // Testes
  "eject": "react-scripts eject"       // Ejetar configuração
}
```

### Comandos Úteis
```bash
# Desenvolvimento
npm start                 # Inicia servidor dev
npm run build            # Build de produção
npm test                 # Executa testes
npm install <package>    # Adiciona dependência

# Firebase
firebase deploy          # Deploy (se configurado)
firebase emulators:start # Emuladores locais
```

---

## 📊 Dependências

### Principais
```json
{
  "react": "^18.x",           // Framework UI
  "react-dom": "^18.x",       // React para web
  "firebase": "^10.x"         // Backend & Database
}
```

### Desenvolvimento
```json
{
  "react-scripts": "5.x",     // Scripts CRA
  "@testing-library/react": "^13.x",  // Testes
  "@testing-library/jest-dom": "^5.x" // Matchers Jest
}
```

---

## 🔧 Configurações

### package.json - Scripts Customizados
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "deploy": "npm run build && firebase deploy"
  }
}
```

### .gitignore - Arquivos Ignorados
```
node_modules/
build/
.env.local
.firebase/
firebase-debug.log
.DS_Store
```

---

## 🎯 Fluxo de Dados

### Login → Mesa
```
1. Usuário preenche login
2. Login.js cria/busca user no Firebase
3. Callback onLogin passa dados para App.js
4. App.js renderiza interface apropriada
   ├─ role === 'master' → MasterInterface
   └─ role === 'player' → CharacterSheet
```

### Atualização em Tempo Real
```
1. Componente monta useEffect
2. onValue() escuta mudanças no Firebase
3. Callback atualiza state local
4. React re-renderiza automaticamente
5. Ciclo continua enquanto montado
```

### Rolagem de Dados
```
1. DiceRoller recebe numDados + perícia
2. Calcula resultados localmente
3. Push para tables/{id}/rolls
4. Update em character.pilhaDados
5. MasterInterface recebe via onValue
6. Aparece na aba de rolagens
```

---

## 🧪 Testando Localmente

### Setup de Teste
1. Configure Firebase emulators (opcional)
2. Use regras abertas para teste
3. Crie mesa de teste
4. Abra múltiplas abas/janelas
5. Teste sincronização em tempo real

### Cenários de Teste
- [ ] Login como jogador e mestre
- [ ] Criar/editar ficha
- [ ] Rolar dados (sucesso/fracasso)
- [ ] Visualizar rolagens no mestre
- [ ] Criar criaturas
- [ ] Múltiplos jogadores simultâneos
- [ ] Recuperação de dados após refresh

---

## 📈 Próximas Melhorias

### Funcionalidades
- [ ] Sistema de chat
- [ ] Combate com iniciativa
- [ ] Inventário detalhado
- [ ] Macros de rolagem
- [ ] Export/import de fichas
- [ ] Handouts para jogadores
- [ ] Timeline de eventos
- [ ] Som/música ambiente

### Técnicas
- [ ] TypeScript
- [ ] Context API ou Redux
- [ ] Testes unitários
- [ ] PWA completo (offline)
- [ ] Autenticação real
- [ ] Regras de segurança robustas
- [ ] Backup automático

---

**Estrutura pronta para crescer! 🚀**
