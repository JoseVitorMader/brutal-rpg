# 📚 Manual do Usuário - BRUTAL RPG

## 🎭 Para Jogadores

### Fazendo Login
1. Abra a aplicação no navegador (geralmente `http://localhost:3000`)
2. Digite seu **nome de usuário** (será usado como intérprete do personagem)
3. Digite o **ID da Mesa** (peça ao seu mestre - todos da mesma mesa usam o mesmo ID)
4. Selecione **"Jogador"**
5. Clique em **"Entrar"**

### Criando Sua Ficha

#### Informações Básicas
- **Nome:** Nome do seu personagem
- **Pronomes:** ele/dele, ela/dela, elu/delu, etc.
- **Intérprete:** Seu nome (preenchido automaticamente)
- **Arquétipo:** Escolha entre:
  - 🏃 **Atleta** - Rápido e ágil
  - 🤔 **Cética** - Questionadora e analítica
  - 🎨 **Esbelto** - Gracioso e elegante
  - 🦸 **Heroi** - Corajoso e protetor
  - 😇 **Inocente** - Puro e esperançoso
  - 🤓 **Nerd** - Inteligente e conhecedor
  - 😎 **Relaxado** - Calmo e descontraído
  - 💪 **Valentona** - Forte e intimidador

#### Apegos (O que te mantém humano)
- **Item Icônico:** Um objeto importante para você
- **Relação Afetiva:** Alguém que você ama ou protege
- **Desejo Obscuro:** Algo que você quer, mas talvez não devesse

#### Recursos

**Pilha de Dados (máx. 6)**
- Marque quantos dados você tem disponíveis
- Você perde dados quando fracassa em rolagens
- Recupere dados descansando ou com ajuda do mestre

**Pilha de Fuga (7 espaços)**
- Marca sua resistência mental
- Quando encher, você entra em pânico ou foge

**Feridas (5 níveis)**
- Descreva a ferida no campo de texto
- Marque os níveis de gravidade conforme recebe dano

#### Perícias (Máximo 2 Treinadas)

Marque **"Treinada"** em até 2 perícias:
- **🤸 Agilidade** - Movimentos rápidos, esquivas, acrobacia
- **🧠 Astúcia** - Percepção, investigação, dedução
- **💪 Força** - Combate físico, empurrar, quebrar
- **💬 Carisma** - Persuasão, intimidação, enganação
- **❤️ Vigor** - Resistência, sobrevivência, recuperação

**Sucesso em rolagens:**
- ✅ Perícia Treinada: **3 ou mais no dado**
- ✅ Sem Treino: **4 ou mais no dado**

#### Gestão de Tensão

A **Tensão** é sua moeda para comprar vantagens.

**Vantagens Gerais:**
- ⚡ **Choque de Realidade** (6 pontos) - Reseta sua pilha de fuga
- 🏥 **Cuidar de Feridas** (1 ponto) - Remove um nível de ferida
- 🔧 **Tomar Jeito** (3 pontos) - Recupera equipamento quebrado

**Vantagens de Especialidade:**
- 🤝 **Ombro Amigo** - Carisma (2 pontos) - Ajuda aliado
- 💉 **Adrenalina** - Vigor (2 pontos) - Ação extra
- 🔍 **Caçar Recurso** - Intelecto (3 pontos) - Encontra item útil
- 🎯 **Preparar para a Próxima** - Agilidade (3 pontos) - Bônus na próxima ação
- 🏃 **Ele Não Espera Por Mim** - Força (3 pontos) - Fuga rápida

**💡 Dica:** O sistema mostra automaticamente quantos pontos você gastou e quantos ainda tem disponíveis!

### Rolando Dados 🎲

1. **Selecione a Quantidade de Dados** (1-6, limitado pelos dados disponíveis na sua pilha)
2. **Escolha a Perícia** que vai usar
3. Clique em **"🎲 Rolar Dados"**

**O que acontece:**
- Dados verdes = Sucesso ✓
- Dados vermelhos = Fracasso ✗
- Fracassos removem dados da sua pilha automaticamente
- O mestre vê sua rolagem em tempo real!

**Exemplo:**
```
Rolando 4 dados de Agilidade (Treinada)
Resultado: [5, 3, 2, 6]
✓ 3 Sucessos (5, 3, 6 são ≥ 3)
✗ 1 Fracasso (2 é < 3)
→ 1 dado removido da pilha
```

### Dicas de Jogo

✅ **Salve sempre!** Seus dados são salvos automaticamente no Firebase
✅ **Gerencie sua pilha de dados** - Não role todos de uma vez!
✅ **Use perícias treinadas** - São mais fáceis de acertar (3+ vs 4+)
✅ **Comunique com o mestre** - Ele vê tudo em tempo real
✅ **Gaste tensão com sabedoria** - Vantagens podem salvar sua vida

---

## 🎩 Para Mestres

### Fazendo Login
1. Digite seu nome de usuário
2. Crie um **ID de Mesa** único (ex: "mesa_sexta_noite")
3. Selecione **"Mestre"**
4. Compartilhe o ID da mesa com seus jogadores

### Interface do Mestre

A interface tem **3 abas principais:**

#### 🎲 Aba ROLAGENS
- Veja **todas as rolagens** dos jogadores em tempo real
- Cada rolagem mostra:
  - Nome do jogador
  - Perícia usada (e se é treinada)
  - Dados rolados com cores (verde = sucesso, vermelho = fracasso)
  - Total de sucessos e fracassos
  - Hora da rolagem

**Use para:**
- Validar resultados de ações
- Acompanhar a sorte dos jogadores
- Decidir consequências narrativas

#### 📋 Aba FICHAS
- Lista de todos os personagens da mesa
- Clique em qualquer personagem para ver a ficha completa
- Informações visíveis:
  - Dados e recursos disponíveis
  - Tensão atual
  - Arquétipo e intérprete

**Use para:**
- Verificar recursos dos jogadores
- Consultar habilidades e vantagens
- Entender motivações (apegos)
- Aplicar consequências (feridas, perda de dados)

#### 📝 Aba ANOTAÇÕES
- Espaço livre para suas anotações de mestre
- Anote:
  - Desenvolvimento da história
  - NPCs e seus segredos
  - Eventos importantes
  - Próximos encontros

**💡 Nota:** As anotações NÃO são salvas automaticamente ainda. Copie para um arquivo local se precisar.

### Gerenciando a Mesa

**Monitoramento em Tempo Real:**
- Todas as rolagens aparecem instantaneamente
- Fichas são atualizadas conforme jogadores editam
- Não precisa atualizar a página

**Boas Práticas:**
1. ✅ Abra a interface antes da sessão começar
2. ✅ Mantenha a aba de rolagens aberta durante o jogo
3. ✅ Consulte fichas quando necessário
4. ✅ Use as anotações para lembrar de detalhes importantes

### Orientando Jogadores

**Quando os jogadores devem rolar:**
- Ações com risco e incerteza
- Conflitos e confrontos
- Investigações importantes

**Interpretando Sucessos:**
- **0 sucessos:** Fracasso total + complicação
- **1-2 sucessos:** Sucesso parcial com custo
- **3+ sucessos:** Sucesso total
- **5+ sucessos:** Sucesso crítico com benefício extra

**Gerenciando Recursos:**
- Devolva dados após descansos ou momentos de calma
- Resete pilhas de fuga em momentos seguros
- Permita recuperação de feridas com tempo e cuidado
- Conceda tensão após cenas intensas ou objetivos alcançados

---

## 🔧 Solução de Problemas

### "Não consigo ver as rolagens dos jogadores"
- Verifique se todos estão na mesma mesa (mesmo ID)
- Atualize a página
- Verifique sua conexão com a internet

### "Meus dados não estão salvando"
- Verifique se o Firebase está configurado corretamente
- Veja o console do navegador (F12) para erros
- Confirme que as regras de segurança permitem escrita

### "Perdi minha pilha de dados!"
- O mestre pode editar sua ficha (em desenvolvimento)
- Por enquanto, marque manualmente os checkboxes para recuperar

### "A aplicação está lenta"
- Limpe o cache do navegador
- Verifique sua conexão com a internet
- Firebase gratuito tem limite de 100 conexões simultâneas

---

## 💡 Dicas Gerais

### Para Todos
- 💾 **Conectividade:** Precisa de internet para funcionar
- 🔄 **Atualização Automática:** Mudanças aparecem em tempo real
- 📱 **Responsivo:** Funciona em celulares e tablets
- 🌙 **Tema Escuro:** Interface otimizada para longas sessões

### Teclas de Atalho
- `F11` - Tela cheia no navegador
- `Ctrl + R` - Atualizar página
- `F12` - Console de desenvolvedor (para debugging)

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique o arquivo `FIREBASE_SETUP.md` para configuração
2. Consulte o `README.md` para informações técnicas
3. Verifique o console do navegador (F12) para mensagens de erro

---

**Boa Sorte e Bom Jogo! 🎲👹**

*Que seus dados rolem altos e seus apegos permaneçam intactos...*
