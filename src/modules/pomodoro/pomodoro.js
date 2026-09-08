// Elementos HTML
const elCiclosHoje = document.getElementById("contadorPainel");
const elMinutosHoje = document.getElementById("tempoFocoPainel");
const elMinutosOntem = document.getElementById("tempoFocoOntem");
const elOfensiva = document.getElementById("ofensivaPainel");
const secaoEstatisticas = document.querySelector(".estatisticas");

// Variáveis De Controle
const isTestMode = true;
let TEMPO_FOCO_MIN = isTestMode ? 1 : 25;
let TEMPO_FOCO_SEG = isTestMode ? 5 : 0;
let minimo = 10;
let maximo = 120;

let minutos = TEMPO_FOCO_MIN;
let segundos = TEMPO_FOCO_SEG;
let cronometroId = null;
let modoAtual = "foco";
let ciclosConcluidos = 0;
let status = "parado";
let pomodoroCiclosHoje = 0;
let pomodoroMinutosHoje = 0;
let pomodoroMinutosOntem = 0;
let pomodoroOfensiva = 0;

export const getEstado = () => {
  return {
    minutos,
    segundos,
    modoAtual,
    ciclosConcluidos,
    status,
    tempoFocoMin:TEMPO_FOCO_MIN,
  };
};

// Formata os minutos acumulados acima de 60 min para horas
const formatarTempoAcumulado = (minutosTotais) => {
  let horas;
  let minutos;
  // verifica se os minutos passaram ou não dos 60min
  if (minutosTotais < 60) {
    return `${minutosTotais} min`;
  } else if (minutosTotais >= 60) {
    horas = Math.floor(minutosTotais / 60);
    minutos = minutosTotais % 60;
    // verifica se o resto é zero antes de decidir qual vai retonar
    if (minutos === 0) {
      return `${horas}h`;
    }
    return `${horas}h, ${minutos}min`;
  }
  return;
};

// Função de aviso sonoro
const emitirBeep = () => {
  // 1. Cria o contexto de áudio do navegador
  const contexto = new (window.AudioContext || window.webkitAudioContext)();

  // 2. Cria o oscilador (gerador de onda senoidal)
  const oscilador = contexto.createOscillator();

  // 3. Conecta o oscilador à saída de som do sistema
  oscilador.connect(contexto.destination);

  // 4. Configura as propriedades do som
  oscilador.type = "sine";
  oscilador.frequency.value = 600;

  // 5. Liga o som
  oscilador.start();

  // 6. Agenda o desligamento automático após 0.2 segundos
  setTimeout(() => {
    oscilador.stop();
    contexto.close();
  }, 200);
};

// Renderiza as Estatiscas na tela
const atualizarEstatisticas = () => {
  // Cria a data de hoje Zerada
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataParaOStorage = hoje.getTime();
  // pega os ciclos de hoje e atauliza o painel dos ciclos concluidos
  localStorage.setItem(
    "pomodoro_ciclos_hoje",
    JSON.stringify(pomodoroCiclosHoje),
  );
  elCiclosHoje.textContent = pomodoroCiclosHoje;
  // pega os minutos do localStorage soma
  const minutosAtuaisNoCofre =
    localStorage.getItem("pomodoro_minutos_hoje") === null
      ? 0
      : parseInt(localStorage.getItem("pomodoro_minutos_hoje"), 10);
  const minutosAtualizados = TEMPO_FOCO_MIN + minutosAtuaisNoCofre;
  // Salva os minutos atualizados novamente no localStorage e atauliza o painel Tempo de Foco
  localStorage.setItem(
    "pomodoro_minutos_hoje",
    JSON.stringify(minutosAtualizados),
  );
  elMinutosHoje.textContent = `${formatarTempoAcumulado(minutosAtualizados)}`;
  // Pega a ofensiva do localStorage atauliza
  if (pomodoroCiclosHoje === 1) {
    const ofensivaAtualNoCofre =
      localStorage.getItem("pomodoro_ofensiva") === null
        ? 0
        : parseInt(localStorage.getItem("pomodoro_ofensiva"), 10);
    const ofensivaAtualizada = ofensivaAtualNoCofre + 1;
    // Salva ofensiva atualizada e atualiza o painel da ofensiva
    localStorage.setItem(
      "pomodoro_ofensiva",
      JSON.stringify(ofensivaAtualizada),
    );
    elOfensiva.textContent = `${ofensivaAtualizada}🔥`;
  } else {
    const ofensivaAtualNoCofre =
      localStorage.getItem("pomodoro_ofensiva") === null
        ? 0
        : parseInt(localStorage.getItem("pomodoro_ofensiva"), 10);
    elOfensiva.textContent = `${ofensivaAtualNoCofre} 🔥`;
  }
};

// Temporizador assíncrono do navegador
export const iniciarCronometro = (callback) => {
  // verifica se o cronômetro já foi iniciado
  if (cronometroId !== null) return;
  status = "executando";
  if (TEMPO_FOCO_MIN >= 60 && ciclosConcluidos === 0) {
    minutos = TEMPO_FOCO_MIN / 2;
  }

  cronometroId = setInterval(() => {
    // verifica se minutos e segundos são 0
    if (segundos === 0 && minutos === 0) {
      emitirBeep();
      gerenciarFimDeCiclo();
      callback();
      return;
    }
    if (segundos === 0) {
      minutos--;
      segundos = 59;
    } else {
      segundos--;
    }
      callback();
  }, 1000);
};

// Função de pausar
export const pausarCronometro = () => {
  clearInterval(cronometroId);
  cronometroId = null;
  status = "pausado";
  timerPrevisao.textContent = "Em Pausa";
};

// Função de reset
export const resetarCronometro = () => {
  clearInterval(cronometroId);
  minutos = TEMPO_FOCO_MIN;
  segundos = TEMPO_FOCO_SEG;
  modoAtual = "foco";
  ciclosConcluidos = 0;
  cronometroId = null;

  status = "parado";
};

// Função de Ciclos
const gerenciarFimDeCiclo = () => {

  if (modoAtual === "foco") {
    ciclosConcluidos++; // adiciona +1 ao contador
    pomodoroCiclosHoje++; // adiciona +1 ao Ciclos totais do Dia

    atualizarEstatisticas();

    if (ciclosConcluidos === 1) {
      // Verifica se o tempo é maior ou igual 1h para adicionar 10 min
      modoAtual = "descanso";
      if (TEMPO_FOCO_MIN >= 60) {
        minutos = isTestMode ? 0 : 10;
        segundos = isTestMode ? 5 : 0;
      } else {
        minutos = isTestMode ? 0 : 5;
        segundos = isTestMode ? 5 : 0;
      }
    } else if (ciclosConcluidos === 2) {
      // Segundo ciclo acabou
      clearInterval(cronometroId);
      cronometroId = null;
      ciclosConcluidos = 0;
      modoAtual = "foco";
      minutos = TEMPO_FOCO_MIN;
      segundos = TEMPO_FOCO_SEG;
      status = "parado";
    }
  } else if (modoAtual === "descanso") {
    // Descanso acabou volta para segundo bloco
    modoAtual = "foco";
    if (TEMPO_FOCO_MIN >= 60) {
      minutos = isTestMode ? 0 : TEMPO_FOCO_MIN / 2;
    } else {
      minutos = TEMPO_FOCO_MIN;
    }
    segundos = TEMPO_FOCO_SEG;
  }
};

// Função de inicializção verifica se o localStorage é null
const inicializarAplicativo = () => {
  // Cria a data de hoje zerada
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataParaOStorage = hoje.getTime();

  // Puxa a data salva do localStorage
  const dataSalvaRaw = localStorage.getItem("pomodoro_ultima_data");
  const dataSalva = dataSalvaRaw ? parseInt(dataSalvaRaw, 10) : null;

  // testar codições
  if (dataSalva === null || dataParaOStorage > dataSalva) {
    // Reset do card 1: Novo dia ou primeiro acesso!(Ciclos)
    pomodoroCiclosHoje = 0;
    localStorage.setItem("pomodoro_ciclos_hoje", JSON.stringify(0));
    elCiclosHoje.textContent = 0;

    // Reset do card 2 (Minutos e foco)
    if (dataSalva === null) {
      pomodoroMinutosOntem = 0;
      pomodoroMinutosHoje = 0;
      elMinutosOntem.textContent = `Ontem ${formatarTempoAcumulado(pomodoroMinutosOntem)}`;
      elMinutosHoje.textContent = `${formatarTempoAcumulado(pomodoroMinutosHoje)}`;
    } else {
      const minutosAcumulados =
        localStorage.getItem("pomodoro_minutos_hoje") === null
          ? 0
          : parseInt(localStorage.getItem("pomodoro_minutos_hoje"), 10);
      pomodoroMinutosOntem = minutosAcumulados;
      localStorage.setItem(
        "pomodoro_minutos_ontem",
        JSON.stringify(pomodoroMinutosOntem),
      );
      elMinutosOntem.textContent = `Ontem ${formatarTempoAcumulado(pomodoroMinutosOntem)}`;

      pomodoroMinutosHoje = 0;
      localStorage.setItem("pomodoro_minutos_hoje", JSON.stringify(0));
      elMinutosHoje.textContent = `${formatarTempoAcumulado(pomodoroMinutosHoje)}`;
    }
    // Reset card 3 (ofensiva)
    const diferencaTempo = dataParaOStorage - dataSalva;
    if (dataSalva === null || diferencaTempo > 86400000) {
      // Primeiro acesso: usúario sem histórico
      pomodoroOfensiva = 0;
      localStorage.setItem("pomodoro_ofensiva", JSON.stringify(0));
      elOfensiva.textContent = 0;
    } else {
      // O usuario manteve a ofensiva do dia seguinte
      pomodoroOfensiva =
        localStorage.getItem("pomodoro_ofensiva") === null
          ? 0
          : parseInt(localStorage.getItem("pomodoro_ofensiva"), 10);
      elOfensiva.textContent = `${pomodoroOfensiva} 🔥`;
    }
    localStorage.setItem(
      "pomodoro_ultima_data",
      JSON.stringify(dataParaOStorage),
    );
  } else {
    // Mesmo Dia: carrega os ciclos acumulados do cofre normalmente
    pomodoroCiclosHoje =
      localStorage.getItem("pomodoro_ciclos_hoje") === null
        ? 0
        : parseInt(localStorage.getItem("pomodoro_ciclos_hoje"), 10);
    elCiclosHoje.textContent = pomodoroCiclosHoje;
    // carrega os minutos do dia
    pomodoroMinutosHoje =
      localStorage.getItem("pomodoro_minutos_hoje") === null
        ? 0
        : parseInt(localStorage.getItem("pomodoro_minutos_hoje"), 10);
    elMinutosHoje.textContent = `${formatarTempoAcumulado(pomodoroMinutosHoje)}`;
    // carrega os minutos de ontem
    pomodoroMinutosOntem =
      localStorage.getItem("pomodoro_minutos_ontem") === null
        ? 0
        : parseInt(localStorage.getItem("pomodoro_minutos_ontem"), 10);
    elMinutosOntem.textContent = `Ontem ${formatarTempoAcumulado(pomodoroMinutosOntem)}`;
    // carrega a ofensiva
    pomodoroOfensiva =
      localStorage.getItem("pomodoro_ofensiva") === null
        ? 0
        : parseInt(localStorage.getItem("pomodoro_ofensiva"), 10);
    elOfensiva.textContent = `${pomodoroOfensiva} 🔥`;
  }
};

// Evento de click da setas
btnAumentar.addEventListener("click", () => {
  if (TEMPO_FOCO_MIN < maximo) {
    if (TEMPO_FOCO_MIN >= 60) {
      TEMPO_FOCO_MIN += 10;
    } else {
      TEMPO_FOCO_MIN += 5;
    }
    minutos = TEMPO_FOCO_MIN;
    atualizarDisplay();
  }
});
btnDiminuir.addEventListener("click", () => {
  if (cronometroId === null && TEMPO_FOCO_MIN > minimo) {
    if (TEMPO_FOCO_MIN > 60) {
      TEMPO_FOCO_MIN -= 10;
    } else {
      TEMPO_FOCO_MIN -= 5;
    }
    minutos = TEMPO_FOCO_MIN;
    atualizarDisplay();
  }
});
// carrega o escript antes de renderizar o DOM
document.addEventListener("DOMContentLoaded", inicializarAplicativo);
