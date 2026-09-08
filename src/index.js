import { getEstado, resetarCronometro, pausarCronometro, iniciarCronometro } from "./modules/pomodoro/pomodoro.js";
import { renderizarPomodoro } from "./modules/pomodoro/render.js";
import { botaoIniciar, botaoReset } from "./modules/pomodoro/DOM.js";

botaoIniciar.addEventListener("click", () => {

  const estado = getEstado();
  // verifica se cronometro estar executando
  if (estado.status === "executando") {
    pausarCronometro();
  } else {
    iniciarCronometro(() => {
      const estadoAtual = getEstado();
      renderizarPomodoro(estadoAtual);
    });
  }
  const novoEstado = getEstado();
  renderizarPomodoro(novoEstado)
 
});

botaoReset.addEventListener("click", () => {
  resetarCronometro();
  const estado = getEstado();
  renderizarPomodoro(estado);
});
