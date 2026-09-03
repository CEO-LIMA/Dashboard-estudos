import {
  botaoIniciar,
  botaoReset,
  painelSetas,
  timerPrevisao,
  display,
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

export const renderizarPomodoro = (estado) => {
  atualizarDisplay(estado);
  //renderizar o diplay resetado
  botaoIniciar.classList.remove("redondo");
  botaoIniciar.textContent = "Iniciar Ciclo ▶️";
  botaoReset.classList.add("escondido");
  painelSetas.classList.remove("escondido");
  timerPrevisao.innerHTML = "<strong>Você terá apenas 1 intervalo</strong>";
};
