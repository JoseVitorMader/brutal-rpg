// Configuração completa de cada arquétipo do jogo
export const ARQUETIPOS_DATA = {
  'Atleta': {
    nome: 'Atleta',
    qualidades: ['Potente', 'Ligeiro'],
    vantagens: [
      {
        id: 'surpreender',
        nome: 'Surpreender',
        custo: 3,
        icone: '🔥',
        categoria: 'Dos Estilos',
        restricao: 'Fim de um Encontro',
        descricao: 'A surpresa pode ser a melhor maneira de acabar com um perigo iminente. Você garante 1 sucesso no seu próximo teste de PARTIR PARA CIMA.'
      },
      {
        id: 'planejar-fuga',
        nome: 'Planejar Fuga',
        custo: 3,
        icone: '🔥',
        categoria: 'Dos Estilos',
        restricao: 'Fim de um Encontro',
        descricao: 'Esteja sempre um passo à frente caso queira sobreviver. Você diminui o seu Custo de Fuga em 1 para o próximo Encontro.'
      },
      {
        id: 'choque-de-realidade',
        nome: 'Choque de Realidade',
        custo: 6,
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Sem restrição',
        descricao: 'Os dados são a chave para a sobrevivência; então, mantenha sua pilha cheia! Você recebe um dado adicional para sua Pilha de Dados.'
      },
      {
        id: 'tomar-jeito',
        nome: 'Tomar Jeito',
        custo: 3,
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Sem restrição',
        descricao: 'Em algum momento, algo te abalou e incapacitou um de seus Estilos. Você recupera um Estilo Incapacitado seu ou o de outra Sobrevivente.'
      },
      {
        id: 'tratar-feridas',
        nome: 'Tratar Feridas',
        custo: '?',
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Fim de um Encontro',
        descricao: 'É praticamente impossível sair de um Encontro sem um arranhão; por isso, saber tratar ferimentos é essencial para sobreviver. Você pode gastar quantos PTs quiser para reduzir as suas Feridas ou as de outra Sobrevivente em um valor equivalente. Feridas não podem ser reduzidas abaixo do valor de Sequela da Sobrevivente afetada. É possível curar uma Sequela gastando 1 uso de um Recurso propício, como um kit médico, uma atadura ou um Merthiolate.'
      }
    ],
    habilidades: 'Velocidade e força física. Boa em esportes e atividades atléticas.'
  },
  'Cética': {
    nome: 'Cética',
    qualidades: ['Firme', 'Sagaz'],
    vantagens: [
      {
        id: 'resistir-a-dor',
        nome: 'Resistir a Dor',
        custo: 2,
        icone: '🔥',
        categoria: 'Dos Estilos',
        restricao: 'Fim de um Encontro',
        descricao: 'Ignore a dor... ou ela irá lhe derrubar. Você reduz a sua próxima Ferida em 1 automaticamente.'
      },
      {
        id: 'cacar-recursos',
        nome: 'Caçar Recursos',
        custo: 3,
        icone: '🔥',
        categoria: 'Dos Estilos',
        restricao: 'Sem restrição',
        descricao: 'Não é possível que não haja nada útil ao seu redor! Ao seu critério, você recebe um Recurso que não estava previamente na cena ou com sua Sobrevivente, desde que faça sentido com a narrativa.'
      },
      {
        id: 'choque-de-realidade',
        nome: 'Choque de Realidade',
        custo: 6,
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Sem restrição',
        descricao: 'Os dados são a chave para a sobrevivência; então, mantenha sua pilha cheia! Você recebe um dado adicional para sua Pilha de Dados.'
      },
      {
        id: 'tomar-jeito',
        nome: 'Tomar Jeito',
        custo: 3,
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Sem restrição',
        descricao: 'Em algum momento, algo te abalou e incapacitou um de seus Estilos. Você recupera um Estilo Incapacitado seu ou o de outra Sobrevivente.'
      },
      {
        id: 'tratar-feridas',
        nome: 'Tratar Feridas',
        custo: '?',
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Fim de um Encontro',
        descricao: 'É praticamente impossível sair de um Encontro sem um arranhão; por isso, saber tratar ferimentos é essencial para sobreviver. Você pode gastar quantos PTs quiser para reduzir as suas Feridas ou as de outra Sobrevivente em um valor equivalente. Feridas não podem ser reduzidas abaixo do valor de Sequela da Sobrevivente afetada. É possível curar uma Sequela gastando 1 uso de um Recurso propício, como um kit médico, uma atadura ou um Merthiolate.'
      }
    ],
    habilidades: 'Pensamento crítico e análise. Boa em detectar mentiras e resolver mistérios.'
  },
  'Esbelta': {
    nome: 'Esbelta',
    qualidades: ['Desenrolado', 'Firme'],
    vantagens: [
      {
        id: 'resistir-a-dor',
        nome: 'Resistir a Dor',
        custo: 2,
        icone: '🔥',
        categoria: 'Dos Estilos',
        restricao: 'Fim de um Encontro',
        descricao: 'Ignore a dor... ou ela irá lhe derrubar. Você reduz a sua próxima Ferida em 1 automaticamente.'
      },
      {
        id: 'compartilhar-forcas',
        nome: 'Compartilhar Forças',
        custo: '?',
        icone: '🔥',
        categoria: 'Dos Estilos',
        restricao: 'Fim de um Encontro',
        descricao: 'A união faz a força! Você pode transferir quantos PTs quiser para outra Sobrevivente à sua escolha.'
      },
      {
        id: 'choque-de-realidade',
        nome: 'Choque de Realidade',
        custo: 6,
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Sem restrição',
        descricao: 'Os dados são a chave para a sobrevivência; então, mantenha sua pilha cheia! Você recebe um dado adicional para sua Pilha de Dados.'
      },
      {
        id: 'tomar-jeito',
        nome: 'Tomar Jeito',
        custo: 3,
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Sem restrição',
        descricao: 'Em algum momento, algo te abalou e incapacitou um de seus Estilos. Você recupera um Estilo Incapacitado seu ou o de outra Sobrevivente.'
      },
      {
        id: 'tratar-feridas',
        nome: 'Tratar Feridas',
        custo: '?',
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Fim de um Encontro',
        descricao: 'É praticamente impossível sair de um Encontro sem um arranhão; por isso, saber tratar ferimentos é essencial para sobreviver. Você pode gastar quantos PTs quiser para reduzir as suas Feridas ou as de outra Sobrevivente em um valor equivalente. Feridas não podem ser reduzidas abaixo do valor de Sequela da Sobrevivente afetada. É possível curar uma Sequela gastando 1 uso de um Recurso propício, como um kit médico, uma atadura ou um Merthiolate.'
      }
    ],
    habilidades: 'Movimentos ágeis e precisos. Boa em acrobacias e furtividade.'
  },
  'Heroína': {
    nome: 'Heroína',
    qualidades: ['Potente', 'Sagaz'],
    vantagens: [
      {
        id: 'surpreender',
        nome: 'Surpreender',
        custo: 3,
        icone: '🔥',
        categoria: 'Dos Estilos',
        restricao: 'Fim de um Encontro',
        descricao: 'A surpresa pode ser a melhor maneira de acabar com um perigo iminente. Você garante 1 sucesso no seu próximo teste de PARTIR PARA CIMA.'
      },
      {
        id: 'cacar-recursos',
        nome: 'Caçar Recursos',
        custo: 3,
        icone: '🔥',
        categoria: 'Dos Estilos',
        restricao: 'Sem restrição',
        descricao: 'Não é possível que não haja nada útil ao seu redor! Ao seu critério, você recebe um Recurso que não estava previamente na cena ou com sua Sobrevivente, desde que faça sentido com a narrativa.'
      },
      {
        id: 'choque-de-realidade',
        nome: 'Choque de Realidade',
        custo: 6,
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Sem restrição',
        descricao: 'Os dados são a chave para a sobrevivência; então, mantenha sua pilha cheia! Você recebe um dado adicional para sua Pilha de Dados.'
      },
      {
        id: 'tomar-jeito',
        nome: 'Tomar Jeito',
        custo: 3,
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Sem restrição',
        descricao: 'Em algum momento, algo te abalou e incapacitou um de seus Estilos. Você recupera um Estilo Incapacitado seu ou o de outra Sobrevivente.'
      },
      {
        id: 'tratar-feridas',
        nome: 'Tratar Feridas',
        custo: '?',
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Fim de um Encontro',
        descricao: 'É praticamente impossível sair de um Encontro sem um arranhão; por isso, saber tratar ferimentos é essencial para sobreviver. Você pode gastar quantos PTs quiser para reduzir as suas Feridas ou as de outra Sobrevivente em um valor equivalente. Feridas não podem ser reduzidas abaixo do valor de Sequela da Sobrevivente afetada. É possível curar uma Sequela gastando 1 uso de um Recurso propício, como um kit médico, uma atadura ou um Merthiolate.'
      }
    ],
    habilidades: 'Coragem e liderança. Boa em motivar outros e enfrentar perigos.'
  },
  'Inocente': {
    nome: 'Inocente',
    qualidades: ['Desenrolado', 'Sagaz'],
    vantagens: [
      {
        id: 'compartilhar-forcas',
        nome: 'Compartilhar Forças',
        custo: '?',
        icone: '🔥',
        categoria: 'Dos Estilos',
        restricao: 'Fim de um Encontro',
        descricao: 'A união faz a força! Você pode transferir quantos PTs quiser para outra Sobrevivente à sua escolha.'
      },
      {
        id: 'cacar-recursos',
        nome: 'Caçar Recursos',
        custo: 3,
        icone: '🔥',
        categoria: 'Dos Estilos',
        restricao: 'Sem restrição',
        descricao: 'Não é possível que não haja nada útil ao seu redor! Ao seu critério, você recebe um Recurso que não estava previamente na cena ou com sua Sobrevivente, desde que faça sentido com a narrativa.'
      },
      {
        id: 'choque-de-realidade',
        nome: 'Choque de Realidade',
        custo: 6,
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Sem restrição',
        descricao: 'Os dados são a chave para a sobrevivência; então, mantenha sua pilha cheia! Você recebe um dado adicional para sua Pilha de Dados.'
      },
      {
        id: 'tomar-jeito',
        nome: 'Tomar Jeito',
        custo: 3,
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Sem restrição',
        descricao: 'Em algum momento, algo te abalou e incapacitou um de seus Estilos. Você recupera um Estilo Incapacitado seu ou o de outra Sobrevivente.'
      },
      {
        id: 'tratar-feridas',
        nome: 'Tratar Feridas',
        custo: '?',
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Fim de um Encontro',
        descricao: 'É praticamente impossível sair de um Encontro sem um arranhão; por isso, saber tratar ferimentos é essencial para sobreviver. Você pode gastar quantos PTs quiser para reduzir as suas Feridas ou as de outra Sobrevivente em um valor equivalente. Feridas não podem ser reduzidas abaixo do valor de Sequela da Sobrevivente afetada. É possível curar uma Sequela gastando 1 uso de um Recurso propício, como um kit médico, uma atadura ou um Merthiolate.'
      }
    ],
    habilidades: 'Pureza de coração e empatia. Boa em conectar-se com outros.'
  },
  'Nerd': {
    nome: 'Nerd',
    qualidades: ['Ligeiro', 'Sagaz'],
    vantagens: [
      {
        id: 'planejar-fuga',
        nome: 'Planejar Fuga',
        custo: 3,
        icone: '🔥',
        categoria: 'Dos Estilos',
        restricao: 'Fim de um Encontro',
        descricao: 'Esteja sempre um passo à frente caso queira sobreviver. Você diminui o seu Custo de Fuga em 1 para o próximo Encontro.'
      },
      {
        id: 'cacar-recursos',
        nome: 'Caçar Recursos',
        custo: 3,
        icone: '🔥',
        categoria: 'Dos Estilos',
        restricao: 'Sem restrição',
        descricao: 'Não é possível que não haja nada útil ao seu redor! Ao seu critério, você recebe um Recurso que não estava previamente na cena ou com sua Sobrevivente, desde que faça sentido com a narrativa.'
      },
      {
        id: 'choque-de-realidade',
        nome: 'Choque de Realidade',
        custo: 6,
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Sem restrição',
        descricao: 'Os dados são a chave para a sobrevivência; então, mantenha sua pilha cheia! Você recebe um dado adicional para sua Pilha de Dados.'
      },
      {
        id: 'tomar-jeito',
        nome: 'Tomar Jeito',
        custo: 3,
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Sem restrição',
        descricao: 'Em algum momento, algo te abalou e incapacitou um de seus Estilos. Você recupera um Estilo Incapacitado seu ou o de outra Sobrevivente.'
      },
      {
        id: 'tratar-feridas',
        nome: 'Tratar Feridas',
        custo: '?',
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Fim de um Encontro',
        descricao: 'É praticamente impossível sair de um Encontro sem um arranhão; por isso, saber tratar ferimentos é essencial para sobreviver. Você pode gastar quantos PTs quiser para reduzir as suas Feridas ou as de outra Sobrevivente em um valor equivalente. Feridas não podem ser reduzidas abaixo do valor de Sequela da Sobrevivente afetada. É possível curar uma Sequela gastando 1 uso de um Recurso propício, como um kit médico, uma atadura ou um Merthiolate.'
      }
    ],
    habilidades: 'Conhecimento técnico e acadêmico. Boa em resolver problemas complexos.'
  },
  'Relaxada': {
    nome: 'Relaxada',
    qualidades: ['Desenrolado', 'Ligeiro'],
    vantagens: [
      {
        id: 'planejar-fuga',
        nome: 'Planejar Fuga',
        custo: 3,
        icone: '🔥',
        categoria: 'Dos Estilos',
        restricao: 'Fim de um Encontro',
        descricao: 'Esteja sempre um passo à frente caso queira sobreviver. Você diminui o seu Custo de Fuga em 1 para o próximo Encontro.'
      },
      {
        id: 'compartilhar-forcas',
        nome: 'Compartilhar Forças',
        custo: '?',
        icone: '🔥',
        categoria: 'Dos Estilos',
        restricao: 'Fim de um Encontro',
        descricao: 'A união faz a força! Você pode transferir quantos PTs quiser para outra Sobrevivente à sua escolha.'
      },
      {
        id: 'choque-de-realidade',
        nome: 'Choque de Realidade',
        custo: 6,
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Sem restrição',
        descricao: 'Os dados são a chave para a sobrevivência; então, mantenha sua pilha cheia! Você recebe um dado adicional para sua Pilha de Dados.'
      },
      {
        id: 'tomar-jeito',
        nome: 'Tomar Jeito',
        custo: 3,
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Sem restrição',
        descricao: 'Em algum momento, algo te abalou e incapacitou um de seus Estilos. Você recupera um Estilo Incapacitado seu ou o de outra Sobrevivente.'
      },
      {
        id: 'tratar-feridas',
        nome: 'Tratar Feridas',
        custo: '?',
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Fim de um Encontro',
        descricao: 'É praticamente impossível sair de um Encontro sem um arranhão; por isso, saber tratar ferimentos é essencial para sobreviver. Você pode gastar quantos PTs quiser para reduzir as suas Feridas ou as de outra Sobrevivente em um valor equivalente. Feridas não podem ser reduzidas abaixo do valor de Sequela da Sobrevivente afetada. É possível curar uma Sequela gastando 1 uso de um Recurso propício, como um kit médico, uma atadura ou um Merthiolate.'
      }
    ],
    habilidades: 'Manter a calma sob pressão. Boa em gerenciar estresse e acalmar outros.'
  },
  'Valentona': {
    nome: 'Valentona',
    qualidades: ['Firme', 'Potente'],
    vantagens: [
      {
        id: 'surpreender',
        nome: 'Surpreender',
        custo: 3,
        icone: '🔥',
        categoria: 'Dos Estilos',
        restricao: 'Fim de um Encontro',
        descricao: 'A surpresa pode ser a melhor maneira de acabar com um perigo iminente. Você garante 1 sucesso no seu próximo teste de PARTIR PARA CIMA.'
      },
      {
        id: 'resistir-a-dor',
        nome: 'Resistir a Dor',
        custo: 2,
        icone: '🔥',
        categoria: 'Dos Estilos',
        restricao: 'Fim de um Encontro',
        descricao: 'Ignore a dor... ou ela irá lhe derrubar. Você reduz a sua próxima Ferida em 1 automaticamente.'
      },
      {
        id: 'choque-de-realidade',
        nome: 'Choque de Realidade',
        custo: 6,
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Sem restrição',
        descricao: 'Os dados são a chave para a sobrevivência; então, mantenha sua pilha cheia! Você recebe um dado adicional para sua Pilha de Dados.'
      },
      {
        id: 'tomar-jeito',
        nome: 'Tomar Jeito',
        custo: 3,
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Sem restrição',
        descricao: 'Em algum momento, algo te abalou e incapacitou um de seus Estilos. Você recupera um Estilo Incapacitado seu ou o de outra Sobrevivente.'
      },
      {
        id: 'tratar-feridas',
        nome: 'Tratar Feridas',
        custo: '?',
        icone: '🔥',
        categoria: 'Das Vantagens Gerais',
        restricao: 'Fim de um Encontro',
        descricao: 'É praticamente impossível sair de um Encontro sem um arranhão; por isso, saber tratar ferimentos é essencial para sobreviver. Você pode gastar quantos PTs quiser para reduzir as suas Feridas ou as de outra Sobrevivente em um valor equivalente. Feridas não podem ser reduzidas abaixo do valor de Sequela da Sobrevivente afetada. É possível curar uma Sequela gastando 1 uso de um Recurso propício, como um kit médico, uma atadura ou um Merthiolate.'
      }
    ],
    habilidades: 'Intimidação e combate direto. Boa em confrontos físicos e ameaças.'
  }
};

export const getArquetipoData = (nomeArquetipo) => {
  return ARQUETIPOS_DATA[nomeArquetipo] || null;
};
