// Ações disponíveis para todas as Sobreviventes

export const ACOES_COMUNS = [
  {
    nome: 'Ajudar Alguém',
    descricao: 'Ajudar o próximo é sempre uma ação honrosa. Você rola um teste num Estilo apropriado para sua ação. Todos os dados que resultarem em sucesso são doados a uma Sobrevivente à sua escolha. Dados falhos não são Descartados.'
  },
  {
    nome: 'Arriscar Tudo',
    descricao: 'Em situações críticas, sacrifícios são necessários para garantir a sobrevivência do grupo. Você escolhe uma Sobrevivente, que pode ser você mesma, para escapar automaticamente do Encontro. Para tal, você deve descartar todos os seus dados. Essa ação é limitada a uma única Sobrevivente por Encontro e apenas a um uso por sessão. Não é possível usar essa ação se você for a última Sobrevivente na cena.'
  },
  {
    nome: 'Distrair',
    descricao: 'Você sabe que distrair o Assassino pode atrasá-lo por um momento. Você rola um teste DESENROLADO visando superar um Risco Complexo. Caso supere, a Diretora deve gastar um dado comum e 3 Pontos de Horror para realizar a ação MATAR durante sua vez. Essa desvantagem é cumulativa.'
  },
  {
    nome: 'Partir Para Cima',
    descricao: 'Em um surto de coragem ou tolice, você decide enfrentar o perigo. Você rola um teste POTENTE. Com ao menos um sucesso, a Diretora deve descartar um dado.'
  },
  {
    nome: 'Recuperar Fôlego',
    descricao: 'Respirar é importante para manter a cabeça funcionando. Você recebe +1 dado comum na sua Pilha de Dados.'
  },
  {
    nome: 'Vazar Dali',
    descricao: 'Você pode correr ou tentar se esconder, mas nada garantirá sua sobrevivência. Você rola um teste LIGEIRO para se afastar do Assassino. Cada dado que resultar em um sucesso é movido para a sua Pilha de Fuga. Dados que resultam em 6 são considerados uma fuga vantajosa e diminuem o Custo de Fuga para sua Sobrevivente em 1 enquanto estiverem na Pilha de Fuga.'
  }
];
