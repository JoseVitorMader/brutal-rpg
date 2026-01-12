// Habilidades e Cicatrizes de cada arquétipo
export const HABILIDADES_DATA = {
  'Atleta': {
    habilidades: [
      {
        id: 'adrenalina',
        nome: 'Adrenalina',
        restricao: 'Início de uma cena',
        descricao: 'Uma vez por cena, você pode ignorar os efeitos de uma Qualidade Desfavorável.'
      },
      {
        id: 'coach-de-equipe',
        nome: 'Coach de Equipe',
        restricao: 'Início de um Encontro',
        descricao: 'Ao escapar de um Encontro, você pode escolher uma Sobrevivente ainda no Encontro, para reduzir automaticamente um Custo de Fuga.'
      },
      {
        id: 'home-run',
        nome: 'Home Run',
        restricao: 'Início de um Encontro',
        descricao: 'Uma vez durante um Encontro, você pode comprar uma Vantagem com seus PTs.'
      },
      {
        id: 'resiliencia',
        nome: 'Resiliência',
        restricao: 'Fim de um Encontro',
        descricao: 'Uma vez você pode substituir o valor de uma rolagem sua pelo valor de um dos seus Dados Marcadores.'
      },
      {
        id: 'superacao',
        nome: 'Superação',
        restricao: 'Fim de um Encontro',
        descricao: 'Uma vez a cada Encontro, ao receber uma Ferida, você pode impedir o aumento do nível de Sequela.'
      }
    ],
    cicatriz: {
      id: 'hora-da-revanche',
      nome: 'Hora da Revanche',
      restricao: 'Início de um Encontro',
      descricao: 'Uma vez durante um Encontro, você pode descartar um dado para usar duas Ações de Encontro no seu turno.',
      isCicatriz: true
    }
  },
  'Cética': {
    habilidades: [
      {
        id: 'beneficio-da-duvida',
        nome: 'Benefício da Dúvida',
        restricao: 'Sem restrição',
        descricao: 'Você pode repetir todos os Testes de Susto ao menos uma vez.'
      },
      {
        id: 'nocao-agucada',
        nome: 'Noção Aguçada',
        restricao: 'Fim de um Encontro',
        descricao: 'Após ser afetada por um Caminho Armadilha, você pode descobrir a quantidade de Caminhos Armadilhas restantes no Ambiente.'
      },
      {
        id: 'pe-no-chao',
        nome: 'Pé no Chão',
        restricao: 'Sem restrição',
        descricao: 'Após tirar 6 em um Teste de Susto, você pode mover um de seus dados à Pilha de Fuga no começo do próximo Encontro. Essa Habilidade não é cumulativa.'
      },
      {
        id: 'positividade-toxica',
        nome: 'Positividade Tóxica',
        restricao: 'Início do Rito',
        descricao: 'Durante um Rito de Iniciação, você pode transformar as três primeiras falhas dos Intérpretes em Qualidades Neutras. Os dados ainda são descartados.'
      },
      {
        id: 'questionadora',
        nome: 'Questionadora',
        restricao: 'Início de uma sessão',
        descricao: 'Uma vez por sessão, enquanto fora de um Encontro, você pode descobrir a quantidade de dados do Assassino.'
      }
    ],
    cicatriz: {
      id: 'foco-no-agora',
      nome: 'Foco no Agora',
      restricao: 'Início de um Encontro',
      descricao: 'Uma vez durante um Encontro, você pode ceder sua Ação de Encontro para outra Sobrevivente, permitindo que ela aja novamente. Ambas ganham um dado adicional para suas respectivas Pilhas de Dados.',
      isCicatriz: true
    }
  },
  'Esbelta': {
    habilidades: [
      {
        id: 'berco-de-ouro',
        nome: 'Berço de Ouro',
        restricao: 'Início do Rito de Iniciação',
        descricao: 'Durante o Rito de Iniciação, você recebe um dado adicional para usar durante as Oferendas.'
      },
      {
        id: 'egocentrica',
        nome: 'Egocêntrica',
        restricao: 'Sem restrição',
        descricao: 'Você recebe 1 PT para cada 6 obtido em uma rolagem.'
      },
      {
        id: 'estrelinha',
        nome: 'Estrelinha',
        restricao: 'Início de uma sessão',
        descricao: 'Uma vez por sessão, durante um Encontro, você pode forçar o Assassino a centralizar as ações em você pelo próximo turno. Caso ele use FERIR, você ganha PTs igual ao resultado da rolagem.'
      },
      {
        id: 'patricinha',
        nome: 'Patricinha',
        restricao: 'Início de um Encontro',
        descricao: 'Uma vez durante um Encontro, após receber dados por AJUDAR ALGUÉM, você pode transferir um dado da Pilha de Descarte para a sua Pilha de Dados.'
      },
      {
        id: 'pose-impecavel',
        nome: 'Pose Impecável',
        restricao: 'Início de um Encontro',
        descricao: 'Uma vez durante um Encontro, você pode repetir a rolagem de VAZAR DALI.'
      }
    ],
    cicatriz: {
      id: 'icone-da-vez',
      nome: 'Ícone da Vez',
      restricao: 'Fim de um Encontro',
      descricao: 'Uma vez por Encontro, você pode sacrificar 4 PTs para dar mais 2 PTs para as outras Sobreviventes. Cada Sobrevivente só pode ser afetada por essa Habilidade uma vez a cada Encontro.',
      isCicatriz: true
    }
  },
  'Heroína': {
    habilidades: [
      {
        id: 'abre-alas',
        nome: 'Abre Alas',
        restricao: 'Fim de um Encontro',
        descricao: 'Durante um Encontro, você pode cancelar os efeitos de uma Qualidade Desfavorável sob uma Sobrevivente à sua escolha até o fim da cena. Após usar essa Habilidade, todos os seus testes apresentam Riscos Complexos até o início da próxima cena.'
      },
      {
        id: 'ate-o-fim',
        nome: 'Até o Fim',
        restricao: 'Sem restrição',
        descricao: 'Durante um Encontro, ao ARRISCAR TUDO para se salvar, você pode manter um único dado em sua Pilha de Dados em vez de sacrificar todos.'
      },
      {
        id: 'companheirismo',
        nome: 'Companheirismo',
        restricao: 'Início da sessão',
        descricao: 'Uma vez por sessão, ao AJUDAR ALGUÉM durante um Encontro, você pode mover os dados doados diretamente para a Pilha de Fuga da Sobrevivente.'
      },
      {
        id: 'farol',
        nome: 'Farol',
        restricao: 'Sem restrição',
        descricao: 'Durante um Suspense, caso ao menos uma Sobrevivente esteja no mesmo Caminho que você, todas no Caminho têm a Dificuldade dos seus testes reduzida em 1.'
      },
      {
        id: 'sacrificio-heroico',
        nome: 'Sacrifício Heroico',
        restricao: 'Sem restrição',
        descricao: 'Durante um Encontro, ao ARRISCAR TUDO para salvar outra Sobrevivente, você pode descartar apenas metade de seus dados em vez de sacrificar todos.'
      }
    ],
    cicatriz: {
      id: 'pedra-no-sapato',
      nome: 'Pedra no Sapato',
      restricao: 'Sem restrição',
      descricao: 'Após escapar de um Encontro, você continua na Iniciativa e mantém seus Dados de Fuga até o fim da cena. Você pode usar seu turno para entregar um de seus Dados de Fuga a uma Sobrevivente, sem retornar para o encontro. Você não pode realizar outras ações e nem ser afetada por outras Sobreviventes ou pelo Assassino.',
      isCicatriz: true
    }
  },
  'Inocente': {
    habilidades: [
      {
        id: 'carencia',
        nome: 'Carência',
        restricao: 'Início de uma sessão',
        descricao: 'Uma vez por sessão, ao ser alvo de AJUDAR ALGUÉM durante um Encontro, a Sobrevivente que está lhe ajudando não perde os dados doados. Os dados transferidos advêm da Pilha de Descarte.'
      },
      {
        id: 'cobaia',
        nome: 'Cobaia',
        restricao: 'Confira a descrição',
        descricao: 'Durante um Suspense, ao seguir um Caminho Armadilha, você sempre é a primeira pessoa a sofrer as consequências. Contudo, a primeira Armadilha que você ativar durante a cena não tem efeito e é descartada.'
      },
      {
        id: 'final-girl',
        nome: 'Final Girl',
        restricao: 'Sem restrição',
        descricao: 'Durante um Encontro, caso seja a última Sobrevivente contra o Assassino, você pode ARRISCAR TUDO sem descartar nenhum dado. Caso outra Sobrevivente já tenha usado ARRISCAR TUDO antes de você, você ainda pode fazê-lo, mas perde seus dados.'
      },
      {
        id: 'forca-de-vontade',
        nome: 'Força de Vontade',
        restricao: 'Início de uma sessão',
        descricao: 'Uma vez por sessão, você pode ignorar os efeitos de alguma característica do Assassino que lhe afete.'
      },
      {
        id: 'sorte-de-principiante',
        nome: 'Sorte de Principiante',
        restricao: 'Início de uma sessão',
        descricao: 'Durante um Rito de Iniciação, você pode repetir as rolagens das Oferendas falhas até duas vezes.'
      }
    ],
    cicatriz: {
      id: 'pureza-de-espirito',
      nome: 'Pureza de Espírito',
      restricao: 'Início de uma sessão',
      descricao: 'Uma vez por sessão, você pode descartar um Dado Marcador e receber o valor dele em dados adicionais para sua Pilha de Dados.',
      isCicatriz: true
    }
  },
  'Nerd': {
    habilidades: [
      {
        id: 'biblioteca-humana',
        nome: 'Biblioteca Humana',
        restricao: 'Fim de um Encontro',
        descricao: 'Uma vez por Encontro, você pode escolher outra Sobrevivente e reduzir em 1 o Custo de uma Vantagem específica que ela possa realizar. Após a Vantagem ser ativada, o seu Custo volta ao valor padrão.'
      },
      {
        id: 'fe-nas-malucas',
        nome: 'Fé nas Malucas',
        restricao: 'Início de uma sessão',
        descricao: 'Uma vez por sessão, você pode realizar uma Oferenda mesmo após o Rito de Iniciação.'
      },
      {
        id: 'hipotese',
        nome: 'Hipótese',
        restricao: 'Início de um Suspense',
        descricao: 'Uma vez por Suspense, ao desarmar ou ativar uma Armadilha, você descobre a localização de outra Armadilha presente em algum Caminho.'
      },
      {
        id: 'memoria-fotografica',
        nome: 'Memória Fotográfica',
        restricao: 'Início de uma Sessão',
        descricao: 'Uma vez por sessão, durante um Encontro, você pode descobrir o valor do Custo de Fuga de um Assassino.'
      },
      {
        id: 'revelacao',
        nome: 'Revelação',
        restricao: 'Início de uma Sessão',
        descricao: 'Durante um Encontro, fora do turno do Assassino, você pode forçar a Diretora a anunciar a próxima ação do Assassino. Caso o Assassino seja impedido de realizar a ação, ele perde o turno.'
      }
    ],
    cicatriz: {
      id: 'analise-obstinada',
      nome: 'Análise Obstinada',
      restricao: 'Início de uma Sessão',
      descricao: 'Uma vez por sessão, durante um Encontro, você pode gastar seu turno para descobrir quantos dados o Assassino tem.',
      isCicatriz: true
    }
  },
  'Relaxada': {
    habilidades: [
      {
        id: 'cabeca-na-lua',
        nome: 'Cabeça na Lua',
        restricao: 'Fim de um Encontro',
        descricao: 'Uma vez por Encontro, você pode ignorar um Teste de Susto.'
      },
      {
        id: 'ole',
        nome: 'Olé!',
        restricao: 'Fim de um Encontro',
        descricao: 'Uma vez por Encontro, quando receber uma Ferida, você pode rolar o Dado Marcador novamente, mantendo o novo resultado.'
      },
      {
        id: 'trapalhada',
        nome: 'Trapalhada',
        restricao: 'Início de uma sessão',
        descricao: 'Uma vez por sessão, você pode forçar um Teste de Susto contra si para ativar uma Qualidade Favorável.'
      },
      {
        id: 'uni-duni-te',
        nome: 'Uni-duni-tê!',
        restricao: 'Sem restrição',
        descricao: 'Durante o primeiro turno de um Suspense, ao assumir uma Abordagem Direta, você pode seguir dois Caminhos, sendo afetada pelas consequências de ambos. Caso você não seja afetada por uma Armadilha, você pode usar essa Habilidade novamente.'
      },
      {
        id: 'versatil',
        nome: 'Versátil',
        restricao: 'Fim de um Encontro',
        descricao: 'Uma vez por Encontro, você pode comprar uma Vantagem de um Estilo diferente dos seus, desde que seja bem-sucedido em um teste desse Estilo. Caso não obtenha sucesso, os PTs do Custo da Vantagem ainda são debitados.'
      }
    ],
    cicatriz: {
      id: 'tensao-aliviada',
      nome: 'Tensão Aliviada',
      restricao: 'Sem restrição',
      descricao: 'Para você, o Custo de CHOQUE DA REALIDADE é reduzido permanentemente para 5 PTs.',
      isCicatriz: true
    }
  },
  'Valentona': {
    habilidades: [
      {
        id: 'babaca',
        nome: 'Babaca',
        restricao: 'Início de um Encontro',
        descricao: 'Uma vez durante um Encontro, você pode usar a sua ação para roubar um Dado de Fuga de outra Sobrevivente.'
      },
      {
        id: 'cabeca-dura',
        nome: 'Cabeça Dura',
        restricao: 'Início de uma sessão',
        descricao: 'Uma vez por sessão, você pode se recusar a sacrificar ou descartar dados em uma rolagem.'
      },
      {
        id: 'cara-lavada',
        nome: 'Cara Lavada',
        restricao: 'Início de um Encontro',
        descricao: 'Uma vez por Encontro, você pode descartar um Dado de Fuga para remover um dado das mãos do Assassino.'
      },
      {
        id: 'casca-grossa',
        nome: 'Casca Grossa',
        restricao: 'Sem restrição',
        descricao: 'Durante um Suspense, ao ser afetada por um Caminho Armadilha, você recebe 2 PTs.'
      },
      {
        id: 'nem-fodendo',
        nome: 'Nem Fodendo',
        restricao: 'Início de uma sessão',
        descricao: 'Uma vez por sessão, você pode impedir uma Qualidade Desfavorável de ser ativada, anulando seu efeito pelo resto da cena.'
      }
    ],
    cicatriz: {
      id: 'ponto-fraco',
      nome: 'Ponto Fraco',
      restricao: 'Sem restrição',
      descricao: 'Durante um Encontro, ao utilizar PARTIR PARA CIMA, você pode realizar o teste com Risco Complexo para acumular dois sucessos e, assim, remover dois dados das mãos do Assassino.',
      isCicatriz: true
    }
  }
};

export const getHabilidadesData = (nomeArquetipo) => {
  return HABILIDADES_DATA[nomeArquetipo] || null;
};
