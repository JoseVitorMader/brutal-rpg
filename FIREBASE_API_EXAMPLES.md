# 🔌 API do Firebase - Exemplos e Expansões

Este arquivo contém exemplos de código para expandir funcionalidades usando Firebase Realtime Database.

## 📝 Estrutura de Dados

```
brutal-rpg/
└── tables/
    └── {tableId}/
        ├── users/
        ├── characters/
        ├── monsters/
        ├── rolls/
        └── notes/  (futuro)
```

## 🔧 Operações Básicas

### 1. Criar/Atualizar Dados
```javascript
import { ref, set } from 'firebase/database';
import { database } from './firebase';

// Criar/atualizar dado específico
const saveData = (path, data) => {
  const dataRef = ref(database, path);
  set(dataRef, data)
    .then(() => console.log('Salvo com sucesso!'))
    .catch((error) => console.error('Erro:', error));
};

// Exemplo: Salvar configuração de mesa
saveData(`tables/mesa_001/config`, {
  name: 'Campanha de Terror',
  maxPlayers: 6,
  createdAt: Date.now()
});
```

### 2. Ler Dados Uma Vez
```javascript
import { ref, get } from 'firebase/database';

const getData = async (path) => {
  const dataRef = ref(database, path);
  const snapshot = await get(dataRef);
  
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    console.log('Nenhum dado encontrado');
    return null;
  }
};

// Exemplo: Buscar personagem
const character = await getData(`tables/mesa_001/characters/player_001`);
```

### 3. Escutar Mudanças em Tempo Real
```javascript
import { ref, onValue } from 'firebase/database';

const listenToData = (path, callback) => {
  const dataRef = ref(database, path);
  
  const unsubscribe = onValue(dataRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  });
  
  // Retorna função para parar de escutar
  return unsubscribe;
};

// Exemplo: Escutar rolagens em tempo real
const unsubscribe = listenToData(`tables/mesa_001/rolls`, (rolls) => {
  console.log('Novas rolagens:', rolls);
});

// Parar de escutar quando não precisar mais
// unsubscribe();
```

### 4. Adicionar Item a Lista
```javascript
import { ref, push } from 'firebase/database';

const addToList = (path, data) => {
  const listRef = ref(database, path);
  const newItemRef = push(listRef);
  set(newItemRef, data);
  return newItemRef.key; // Retorna ID gerado
};

// Exemplo: Adicionar evento à timeline
const eventId = addToList(`tables/mesa_001/events`, {
  type: 'combat',
  description: 'Encontro com a criatura',
  timestamp: Date.now()
});
```

### 5. Deletar Dados
```javascript
import { ref, remove } from 'firebase/database';

const deleteData = (path) => {
  const dataRef = ref(database, path);
  remove(dataRef)
    .then(() => console.log('Removido com sucesso!'))
    .catch((error) => console.error('Erro:', error));
};

// Exemplo: Remover personagem
deleteData(`tables/mesa_001/characters/player_001`);
```

### 6. Atualizar Campos Específicos
```javascript
import { ref, update } from 'firebase/database';

const updateFields = (path, updates) => {
  const dataRef = ref(database, path);
  update(dataRef, updates);
};

// Exemplo: Atualizar apenas tensão do personagem
updateFields(`tables/mesa_001/characters/player_001`, {
  tensao: 15,
  'pilhaDados/0': true,
  'pilhaDados/1': true
});
```

## 🚀 Expansões Sugeridas

### 1. Sistema de Chat
```javascript
// Componente de Chat
import { ref, push, onValue } from 'firebase/database';

const sendMessage = (tableId, username, message) => {
  const messagesRef = ref(database, `tables/${tableId}/chat`);
  push(messagesRef, {
    user: username,
    message: message,
    timestamp: Date.now()
  });
};

const listenToChat = (tableId, callback) => {
  const messagesRef = ref(database, `tables/${tableId}/chat`);
  return onValue(messagesRef, (snapshot) => {
    const messages = [];
    snapshot.forEach((child) => {
      messages.push({ id: child.key, ...child.val() });
    });
    messages.sort((a, b) => a.timestamp - b.timestamp);
    callback(messages);
  });
};
```

### 2. Sistema de Inventário
```javascript
// Adicionar item ao inventário
const addItemToInventory = (tableId, userId, item) => {
  const inventoryRef = ref(database, 
    `tables/${tableId}/characters/${userId}/inventory`
  );
  push(inventoryRef, {
    name: item.name,
    description: item.description,
    quantity: item.quantity || 1,
    addedAt: Date.now()
  });
};

// Remover item
const removeItemFromInventory = (tableId, userId, itemId) => {
  const itemRef = ref(database, 
    `tables/${tableId}/characters/${userId}/inventory/${itemId}`
  );
  remove(itemRef);
};
```

### 3. Sistema de Iniciativa (Combate)
```javascript
// Iniciar combate
const startCombat = (tableId, participants) => {
  const combatRef = ref(database, `tables/${tableId}/combat`);
  set(combatRef, {
    active: true,
    currentTurn: 0,
    round: 1,
    participants: participants.map(p => ({
      id: p.id,
      name: p.name,
      initiative: Math.floor(Math.random() * 20) + 1
    })).sort((a, b) => b.initiative - a.initiative)
  });
};

// Próximo turno
const nextTurn = async (tableId) => {
  const combatRef = ref(database, `tables/${tableId}/combat`);
  const snapshot = await get(combatRef);
  const combat = snapshot.val();
  
  const nextTurn = (combat.currentTurn + 1) % combat.participants.length;
  const nextRound = nextTurn === 0 ? combat.round + 1 : combat.round;
  
  update(combatRef, {
    currentTurn: nextTurn,
    round: nextRound
  });
};
```

### 4. Sistema de Anotações Compartilhadas
```javascript
// Salvar anotações do mestre
const saveMasterNotes = (tableId, notes) => {
  const notesRef = ref(database, `tables/${tableId}/masterNotes`);
  set(notesRef, {
    content: notes,
    lastUpdated: Date.now()
  });
};

// Criar handout para jogadores
const createHandout = (tableId, handout) => {
  const handoutsRef = ref(database, `tables/${tableId}/handouts`);
  push(handoutsRef, {
    title: handout.title,
    content: handout.content,
    imageUrl: handout.imageUrl,
    visible: handout.visible || false,
    createdAt: Date.now()
  });
};
```

### 5. Sistema de Cenas
```javascript
// Criar nova cena
const createScene = (tableId, scene) => {
  const scenesRef = ref(database, `tables/${tableId}/scenes`);
  push(scenesRef, {
    name: scene.name,
    description: scene.description,
    location: scene.location,
    npcs: scene.npcs || [],
    active: false,
    createdAt: Date.now()
  });
};

// Ativar cena
const activateScene = (tableId, sceneId) => {
  // Desativar todas as cenas
  const scenesRef = ref(database, `tables/${tableId}/scenes`);
  get(scenesRef).then((snapshot) => {
    const updates = {};
    snapshot.forEach((child) => {
      updates[`${child.key}/active`] = child.key === sceneId;
    });
    update(scenesRef, updates);
  });
};
```

### 6. Sistema de Macros (Ações Rápidas)
```javascript
// Salvar macro de rolagem
const saveMacro = (tableId, userId, macro) => {
  const macrosRef = ref(database, 
    `tables/${tableId}/characters/${userId}/macros`
  );
  push(macrosRef, {
    name: macro.name,
    pericia: macro.pericia,
    numDados: macro.numDados,
    description: macro.description
  });
};

// Executar macro
const executeMacro = (macro, character, user) => {
  // Usa o mesmo sistema de rolagem existente
  // mas com parâmetros pré-definidos
};
```

### 7. Log de Eventos
```javascript
// Registrar evento importante
const logEvent = (tableId, event) => {
  const eventsRef = ref(database, `tables/${tableId}/eventLog`);
  push(eventsRef, {
    type: event.type, // 'combat', 'discovery', 'death', etc.
    description: event.description,
    participants: event.participants || [],
    timestamp: Date.now()
  });
};

// Exemplo de uso
logEvent('mesa_001', {
  type: 'discovery',
  description: 'Os jogadores descobriram a entrada secreta',
  participants: ['João', 'Maria', 'Carlos']
});
```

### 8. Sistema de Conquistas
```javascript
// Dar conquista para jogador
const grantAchievement = (tableId, userId, achievement) => {
  const achievementsRef = ref(database, 
    `tables/${tableId}/characters/${userId}/achievements`
  );
  push(achievementsRef, {
    name: achievement.name,
    description: achievement.description,
    icon: achievement.icon,
    earnedAt: Date.now()
  });
};
```

## 🔒 Regras de Segurança Avançadas

### Para Produção com Autenticação
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
            ".write": "auth != null && (
              auth.uid == $userId || 
              root.child('tables/' + $tableId + '/users/' + auth.uid + '/role').val() == 'master'
            )"
          }
        },
        "monsters": {
          ".read": "auth != null",
          ".write": "auth != null && root.child('tables/' + $tableId + '/users/' + auth.uid + '/role').val() == 'master'"
        },
        "rolls": {
          ".read": "auth != null",
          ".write": "auth != null",
          ".indexOn": ["timestamp"]
        },
        "chat": {
          ".read": "auth != null",
          ".write": "auth != null",
          ".indexOn": ["timestamp"]
        }
      }
    }
  }
}
```

## 📊 Queries e Filtros

### Buscar rolagens recentes
```javascript
import { ref, query, orderByChild, limitToLast } from 'firebase/database';

const getRecentRolls = (tableId, limit = 10) => {
  const rollsRef = ref(database, `tables/${tableId}/rolls`);
  const recentRollsQuery = query(
    rollsRef,
    orderByChild('timestamp'),
    limitToLast(limit)
  );
  
  return onValue(recentRollsQuery, (snapshot) => {
    const rolls = [];
    snapshot.forEach((child) => {
      rolls.push({ id: child.key, ...child.val() });
    });
    return rolls.reverse(); // Mais recente primeiro
  });
};
```

## 🎯 Melhores Práticas

1. **Use Transactions para dados críticos:**
```javascript
import { ref, runTransaction } from 'firebase/database';

const incrementTensao = (tableId, userId, amount) => {
  const tensaoRef = ref(database, 
    `tables/${tableId}/characters/${userId}/tensao`
  );
  
  runTransaction(tensaoRef, (currentTensao) => {
    return (currentTensao || 0) + amount;
  });
};
```

2. **Otimize leituras com índices:**
```json
{
  "rules": {
    "tables": {
      "$tableId": {
        "rolls": {
          ".indexOn": ["timestamp", "jogador"]
        }
      }
    }
  }
}
```

3. **Use batch updates:**
```javascript
const batchUpdate = (tableId, updates) => {
  const dbRef = ref(database, `tables/${tableId}`);
  update(dbRef, updates);
};

// Exemplo: Recuperar pilha de dados de todos
batchUpdate('mesa_001', {
  'characters/player_1/pilhaDados': Array(6).fill(true),
  'characters/player_2/pilhaDados': Array(6).fill(true),
  'characters/player_3/pilhaDados': Array(6).fill(true)
});
```

---

**Use estes exemplos para expandir o sistema conforme necessário!** 🚀
