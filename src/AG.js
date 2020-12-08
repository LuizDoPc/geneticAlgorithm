class AG {
  constructor(tamanhoInicial, taxaMutacao, taxaCrossover, qtdGeracoes) {
    this.tamanhoInicial = tamanhoInicial;
    this.taxaMutacao = taxaMutacao;
    this.taxaCrossover = taxaCrossover;
    this.qtdGeracoes = qtdGeracoes;
    this.geracoes = [];
  }
  aptidao(individuo) {
    return individuo ** 2 - 3 * individuo + 4;
  }
  selecionar() {
    const geracaoAtual = this.geracoes.length - 1;

    const selecionados = [];

    let candidatosSelecao = [...this.geracoes[geracaoAtual]];

    for (let aux = 0; aux < 2; aux++) {
      const aptidoes = candidatosSelecao.map((item) => ({
        apitidao: this.aptidao(item),
        numero: item,
      }));
      const somaAptidoes = aptidoes.reduce(
        (acc, item) => acc + item.apitidao,
        0,
      );
      const porcentagemAptidoes = aptidoes.map((item) => ({
        porcentagem: item.apitidao / somaAptidoes,
        numero: item.numero,
      }));

      porcentagemAptidoes.sort((a, b) => {
        if (a.porcentagem > b.porcentagem) return -1;
        if (a.porcentagem < b.porcentagem) return 1;
        return 0;
      });
      let contador = 0,
        i = 0;
      const random = Math.random();
      while (random > contador) {
        contador += porcentagemAptidoes[i].porcentagem;
        i += 1;
      }
      const candidato = porcentagemAptidoes[i - 1].numero;

      selecionados.push(candidato);
      //candidatosSelecao = candidatosSelecao.filter(item => item !== candidato);

      const pos = candidatosSelecao.indexOf(candidato);
      candidatosSelecao.splice(pos, 1);
    }
    return selecionados;
  }
  decToBin(n) {
    const binario = Math.abs(n).toString(2);

    const qtdZeros = 4 - binario.length;

    const binarioComZero = '0'.repeat(qtdZeros) + binario;

    return (n > 0 ? '1' : '0') + binarioComZero;
  }
  binToDec(n) {
    const sinal = n[0];
    const numero = n.substr(1);
    return (sinal === '0' ? -1 : 1) * parseInt(numero, 2);
  }
  crossover(selecionados) {
    const selecionadosBin = selecionados.map((item) => this.decToBin(item));
    const temCrossover = Math.random() <= this.taxaCrossover;
    if (!temCrossover) return selecionados;
    const pontoCorte = Math.floor(Math.random() * 5);
    const partes = selecionadosBin.map((item) => {
      const parte1 = item.substring(0, pontoCorte);
      const parte2 = item.substring(pontoCorte);
      return [parte1, parte2];
    });
    let filho1 = this.binToDec(partes[0][0] + partes[1][1]);
    let filho2 = this.binToDec(partes[1][0] + partes[0][1]);
    if (filho1 > 10 || filho1 < -10) filho1 = selecionados[0];
    if (filho2 > 10 || filho2 < -10) filho2 = selecionados[1];
    return [filho1, filho2];
  }
  mutacao(individuo) {
    const individuoBinario = this.decToBin(individuo);

    const individuoMutado = individuoBinario
      .split('')
      .map((char) => {
        const random = Math.random();
        if (random <= this.taxaMutacao) return char === '0' ? '1' : '0';
        return char;
      })
      .join('');
    const individuoDec = this.binToDec(individuoMutado);
    if (individuoDec > 10) return 10;
    if (individuoDec < -10) return -10;
    return individuoDec;
    //return (individuoDec > 10 || individuoDec < -10) ? individuo : individuoDec;
  }
  geraPopulacaoInicial() {
    const arr = new Array(this.tamanhoInicial)
      .fill()
      .map(() => Math.floor(Math.random() * 21) - 10);
    this.geracoes.push(arr);
  }
  adicionaGeracao(filhos) {
    if (this.geracoes.length === this.qtdGeracoes) return false;
    this.geracoes.push(filhos);
    return true;
  }
}

function algoritmoGenetico() {
  let tamPop = 4;
  if (tamPop % 2 !== 0) tamPop += 1;
  const ag = new AG(tamPop, 0.01, 0.7, 10);
  ag.geraPopulacaoInicial();
  let podeEvoluir = true;
  while (podeEvoluir) {
    const selecionados = ag.selecionar();
    let manjedoura = [];
    new Array(tamPop / 2).fill().forEach(() => {
      manjedoura = [...manjedoura, ...ag.crossover(selecionados)];
    });

    const proximaGeracao = manjedoura.map((item) => ag.mutacao(item));

    podeEvoluir = ag.adicionaGeracao(proximaGeracao);
  }

  return ag.geracoes;
}

export default algoritmoGenetico;
