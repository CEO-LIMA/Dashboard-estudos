// Elementos HTML
const btnAumentar = document.getElementById("btnAumentar");
const btnDiminuir = document.getElementById("btnDiminuir");
const painelSetas = document.getElementById("painelSetas");
const botaoIniciar = document.getElementById("btnIniciar");
const botaoReset = document.getElementById("btnResetar");
const display = document.getElementById("tempoDisplay");
const timerStatus = document.getElementById("timerStatus");
const elCiclosHoje = document.getElementById("contadorPainel");
const elMinutosHoje = document.getElementById("tempoFocoPainel");
const elMinutosOntem = document.getElementById("tempoFocoOntem");
const elOfensiva = document.getElementById("ofensivaPainel");
const timerPrevisao = document.getElementById("timerPrevisao");
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
let pomodoroCiclosHoje = 0;
let pomodoroMinutosHoje = 0;
let pomodoroMinutosOntem = 0;
let pomodoroOfensiva = 0;

// Formata os minutos acumulados acima de 60 min para horas
const formatarTempoAcumulado = (minutosTotais) => {
  let horas;
  let minutos;
  // verifica se os minutos passaram ou não dos 60min
  if(minutosTotais < 60){
    return `${minutosTotais} min`;
  }else if(minutosTotais >= 60){
    horas = Math.floor(minutosTotais / 60);
    minutos = minutosTotais % 60;
    // verifica se o resto é zero antes de decidir qual vai retonar 
    if(minutos === 0){
      return `${horas}h`
    }
    return `${horas}h, ${minutos}min`
  }
  return;
}

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

// Renderizar o cronômetro na tela
const atualizarDisplay = () => {
  let minutosFormatados = minutos.toString().padStart(2, "0");
  let segundosFormatados = segundos.toString().padStart(2, "0");
  display.textContent = `${minutosFormatados}:${segundosFormatados}`;
};

// Controla as mensagens no painel orientando o usuário
const atualizarStatusTexto = () => {
  if (modoAtual === "foco") {
    if (ciclosConcluidos === 0) {
      timerStatus.textContent = "Período de foco (1 de 2)";

      if (TEMPO_FOCO_MIN >= 60) {
        timerPrevisao.innerHTML =
          "A Seguir: <strong>10 min de intervalor</strong>";
      } else {
        timerPrevisao.innerHTML =
          "A seguir: <strong>5 min de intervalo</strong>";
      }
      botaoIniciar.textContent = "Iniciar Ciclo ▶️";
    } else if (ciclosConcluidos === 1) {
      timerStatus.textContent = "Período de foco (2 de 2)";
      timerPrevisao.innerHTML = "A seguir: <strong>fim do bloco</strong>";
    }
  } else if (modoAtual === "descanso") {
    timerStatus.textContent = "Intervalo ☕";
    timerPrevisao.innerHTML = "A seguir: <strong>25 min de foco</strong>";
  }
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
    elOfensiva.textContent = `${ofensivaAtualNoCofre}🔥`;
  }
};

// Temporizador assíncrono do navegador
const iniciarCronometro = () => {
  // verifica se o cronômetro já foi iniciado
  if (cronometroId !== null) return;
  if (TEMPO_FOCO_MIN >= 60 && ciclosConcluidos === 0) {
    minutos = TEMPO_FOCO_MIN / 2;
  }

  atualizarStatusTexto();
  secaoEstatisticas.hidden = true;
  timerPrevisao.hidden = false;
  painelSetas.classList.add("escondido");

  cronometroId = setInterval(() => {
    // verifica se minutos e segundos são 0
    if (segundos === 0 && minutos === 0) {
      emitirBeep();
      gerenciarFimDeCiclo();
      return;
    }
    if (segundos === 0) {
      minutos--;
      segundos = 59;
    } else {
      segundos--;
    }

    atualizarDisplay();
  }, 1000);
};

// Função de pausar
const pausarCronometro = () => {
  clearInterval(cronometroId);
  cronometroId = null;
  timerPrevisao.textContent = "Em Pausa";
};

// Função de reset
const resetarCronometro = () => {
  clearInterval(cronometroId);
  minutos = TEMPO_FOCO_MIN;
  segundos = TEMPO_FOCO_SEG;
  modoAtual = "foco";
  ciclosConcluidos = 0;
  atualizarDisplay();
  atualizarStatusTexto();
  cronometroId = null;
  //renderizar o diplay resetado
  botaoIniciar.classList.remove("redondo");
  botaoIniciar.textContent = "Iniciar Ciclo ▶️";
  botaoReset.classList.add("escondido");
  painelSetas.classList.remove("escondido");
  timerPrevisao.innerHTML = "<strong>Você terá apenas 1 intervalo</strong>";
};

// Função de Ciclos
const gerenciarFimDeCiclo = () => {
  emitirBeep(); // Aviso sonoro toca no fim

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
      painelSetas.classList.remove("escondido");
      botaoIniciar.classList.remove("redondo");
      secaoEstatisticas.hidden = false;
      timerPrevisao.hidden = true;
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
  atualizarDisplay();
  atualizarStatusTexto();
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
      elMinutosOntem.textContent =  `Ontem ${formatarTempoAcumulado(pomodoroMinutosOntem)}`;
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
      elOfensiva.textContent = `${pomodoroOfensiva}🔥`;
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
    elOfensiva.textContent = `${pomodoroOfensiva}🔥`;
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
botaoIniciar.addEventListener("click", () => {
  // verifica se cronometro estar parado
  if (cronometroId === null) {
    iniciarCronometro();
    botaoIniciar.classList.add("redondo");
    botaoIniciar.innerHTML = `<i data-lucide="pause"></i>`;
    lucide.createIcons();
    display.style.color = "#61afef";
    botaoReset.classList.remove("remove");
  } else {
    pausarCronometro();
    botaoIniciar.innerHTML = `<i data-lucide="play"></i>`;
    lucide.createIcons();
    botaoReset.classList.remove("escondido");
    display.style.color = "#ffffff";
  }
});
botaoReset.addEventListener("click", () => {
  resetarCronometro();
});
// carrega o escript antes de renderizar o DOM
document.addEventListener("DOMContentLoaded", inicializarAplicativo);
