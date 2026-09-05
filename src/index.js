import { getEstado, resetarCronometro, pausarCronometro, iniciarCronometro } from "./modules/pomodoro/pomodoro.js";
import { renderizarPomodoro, atualizarStatusTexto, atualizarDisplay, atualizarControles } from "./modules/pomodoro/render.js";
import { botaoIniciar, botaoReset, display } from "./modules/pomodoro/DOM.js";
window.botaoDoModulo = botaoIniciar;
console.log("A - antes de registrar")
botaoIniciar.addEventListener("click", () => {
  console.log("C - handler do index")
  // 1 - Consulta do estado
  const estado = getEstado();
  // 2 - Decisão / Orquestração
  // verifica se cronometro estar parado
  if (estado.status === "executando") {
    //Altera estado
    pausarCronometro();
  } else {
    //Altera estado
    iniciarCronometro(() => {
      const estadoAtual = getEstado();
      atualizarDisplay(estadoAtual);
    });
  }
  const novoEstado = getEstado();
  renderizarPomodoro(novoEstado)
 
});
console.log("b - listener registrado");
botaoReset.addEventListener("click", () => {
  resetarCronometro();
  const estado = getEstado();
  renderizarPomodoro(estado);
});
