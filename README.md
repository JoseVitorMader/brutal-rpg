# BRUTAL RPG - Sistema de Fichas e Mestragem

Sistema completo de RPG para o sistema BRUTAL, com fichas de personagens, sistema de rolagem de dados e interface para mestres, integrado com Firebase Realtime Database e Authentication.

## 🎲 Funcionalidades

### 🔐 Sistema de Autenticação
- ✅ Cadastro de usuários com email e senha
- ✅ Login seguro com Firebase Authentication
- ✅ Recuperação de senha por email
- ✅ Persistência automática de sessão
- ✅ Gerenciamento de múltiplas mesas por usuário

### 🎮 Sistema de Mesas
- ✅ Criar mesas (criador = mestre automático)
- ✅ Entrar em mesas existentes como jogador
- ✅ Dashboard com "Minhas Mesas" e "Minhas Fichas"
- ✅ Compartilhamento de mesa via ID único
- ✅ Múltiplos personagens em diferentes mesas

### Para Jogadores
- ✅ Ficha de personagem completa com todos os campos do sistema BRUTAL
- ✅ Sistema de arquétipos (Atleta, Cética, Esbelto, Heroi, Inocente, Nerd, Relaxado, Valentona)
- ✅ Gestão de apegos (Item Icônico, Relação Afetiva, Desejo Obscuro)
- ✅ Pilha de Dados (máximo 6) e Pilha de Fuga (7)
- ✅ Sistema de perícias com treinamento (máximo 2 perícias treinadas)
- ✅ Marcadores e Feridas
- ✅ Vantagens Gerais e de Especialidade com sistema de tensão
- ✅ Sistema de rolagem de dados d6
  - Sucesso sem perícia treinada: 4 ou mais
  - Sucesso com perícia treinada: 3 ou mais
  - Dados perdidos em caso de fracasso

### Para Mestres
- ✅ Visualização de todas as rolagens em tempo real
- ✅ Acesso completo às fichas de todos os jogadores
- ✅ Sistema de anotações para a campanha
- ✅ Interface organizada em abas (Rolagens, Fichas, Anotações)

## 🚀 Configuração

### 1. Configurar Firebase

Edite o arquivo `src/firebase.js` e substitua as credenciais com as do seu projeto Firebase:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  databaseURL: "SUA_DATABASE_URL",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

### 2. Criar projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative o **Realtime Database**
4. Configure as regras de segurança (para desenvolvimento):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**⚠️ IMPORTANTE:** Para produção, configure regras de segurança adequadas!

### 3. Instalar dependências e executar

```bash
npm install
npm start
```

## 📖 Como Usar

### Cadastro e Login
1. **Primeiro acesso**: Crie uma conta com email e senha
2. **Login**: Entre com suas credenciais
3. **Esqueceu a senha?**: Use a recuperação por email

### Como Mestre
1. **Dashboard → "Criar Mesa"**
2. Dê um nome e descrição à sua campanha
3. **Você será o mestre automaticamente**
4. Copie o **ID da mesa** (clique no ID no card)
5. Compartilhe o ID com seus jogadores
6. Entre na mesa e comece a mestrar

### Como Jogador
1. **Peça o ID da mesa** ao seu mestre
2. **Dashboard → "Entrar em Mesa"**
3. Cole o ID recebido
4. Entre na mesa como jogador
5. Crie sua ficha de personagem
6. Comece a jogar!

### Dashboard
- **Aba "Minhas Mesas"**: Veja todas as mesas que participa
- **Aba "Minhas Fichas"**: Veja todos os personagens criados
- **Navegação**: Alterne entre mesas facilmente

## 🎨 Características do Sistema

### Perícias
- Agilidade
- Astúcia
- Força
- Carisma
- Vigor

Cada perícia pode ser treinada (máximo 2 perícias). Perícias treinadas têm sucesso com 3+, sem treino precisam de 4+.

### Vantagens Gerais
- **Choque de Realidade** - 6 pontos de tensão
- **Cuidar de Feridas** - 1 ponto de tensão
- **Tomar Jeito** - 3 pontos de tensão

### Vantagens de Especialidade
- **Ombro Amigo** (Carisma) - 2 pontos
- **Adrenalina** (Vigor) - 2 pontos
- **Caçar Recurso** (Intelecto) - 3 pontos
- **Preparar para a Próxima** (Agilidade) - 3 pontos
- **Ele Não Espera Por Mim** (Força) - 3 pontos

## 🔧 Tecnologias Utilizadas

- React.js
- Firebase Realtime Database
- CSS personalizado com tema dark

## 📝 Estrutura do Projeto

```
src/
├── components/
│   ├── Login.js / Login.css
│   ├── CharacterSheet.js / CharacterSheet.css
│   ├── DiceRoller.js / DiceRoller.css
│   └── MasterInterface.js / MasterInterface.css
├── firebase.js
├── App.js
└── index.js
```

## 🎯 Próximos Passos

Para produção:
1. Configure autenticação adequada no Firebase
2. Implemente regras de segurança no Realtime Database
3. Adicione validação de usuários
4. Considere adicionar imagens de personagens via Firebase Storage
5. Implemente sistema de backup das fichas

---

**Desenvolvido para o sistema de RPG BRUTAL** 🎲🔥


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
