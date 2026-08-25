import {
  botaoIniciar,
  botaoReset,
  painelSetas,
  timerPrevisao,
  display,
} from "./DOM";

const atualizarDisplay = (estado) => {
  const minutosFormatados = estado.minutos.toString().padStart(2, "0");

  const segundosFormatados = estado.segundos.toString().padStart(2, "0");

  display.textContent = `${minutosFormatados}:${segundosFormatados}`;
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
