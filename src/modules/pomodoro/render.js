import {
  botaoIniciar,
  botaoReset,
  painelSetas,
  timerStatus,
  timerPrevisao,
  display,
  elCiclosHoje
} from "./DOM.js";

export const atualizarDisplay = (estado) => {
  const minutosFormatados = estado.minutos.toString().padStart(2, "0");

  const segundosFormatados = estado.segundos.toString().padStart(2, "0");

  display.textContent = `${minutosFormatados}:${segundosFormatados}`;
};

// Controla as mensagens no painel orientando o usuário
export const atualizarStatusTexto = (estado) => {
  
  if (estado.modoAtual === "foco") {
    if (estado.ciclosConcluidos === 0) {
      timerStatus.textContent = "Período de foco (1 de 2)";

      if (estado.tempoFocoMin >= 60) {
        timerPrevisao.innerHTML =
          "A Seguir: <strong>10 min de intervalor</strong>";
      } else {
        timerPrevisao.innerHTML =
          "A seguir: <strong>5 min de intervalo</strong>";
      }
      botaoIniciar.textContent = "Iniciar Ciclo ▶️";
    } else if (estado.ciclosConcluidos === 1) {
      timerStatus.textContent = "Período de foco (2 de 2)";
      timerPrevisao.innerHTML = "A seguir: <strong>fim do bloco</strong>";
    }
  } else if (estado.modoAtual === "descanso") {
    timerStatus.textContent = "Intervalo ☕";
    timerPrevisao.innerHTML = "A seguir: <strong>25 min de foco</strong>";
  }
};

export const atualizarControles = (estado) => {
  if (estado.status === "parado") {
    botaoIniciar.classList.remove("redondo");
    botaoIniciar.textContent = "Iniciar Ciclo ▶️";
    botaoReset.classList.add("escondido");
    painelSetas.classList.remove("escondido");
    timerPrevisao.innerHTML = "<strong>Você terá apenas 1 intervalo</strong>";
  } else if (estado.status === "executando") {
    botaoIniciar.classList.add("redondo");
    botaoIniciar.innerHTML = `<i data-lucide="pause"></i>`;
    lucide.createIcons();
    display.style.color = "#61afef";
    botaoReset.classList.remove("remove");
  } else if (estado.status === "pausado") {
    botaoIniciar.innerHTML = `<i data-lucide="play"></i>`;
    lucide.createIcons();
    botaoReset.classList.remove("escondido");
    display.style.color = "#ffffff";
  }
};
export const renderizarEstatisticas = (estado) => {
  elCiclosHoje.textContent = estado.pomodoroCiclosHoje;
}
export const renderizarPomodoro = (estado) => {
  atualizarDisplay(estado);
  atualizarStatusTexto(estado);
  atualizarControles(estado);
  renderizarEstatisticas(estado);
};
