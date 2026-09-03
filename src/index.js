import { getEstado, resetarCronometro, pausarCronometro, iniciarCronometro } from "./modules/pomodoro/pomodoro.js";
import { renderizarPomodoro, atualizarStatusTexto, atualizarDisplay } from "./modules/pomodoro/render.js";
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
    //render
    botaoIniciar.innerHTML = `<i data-lucide="play"></i>`;
    lucide.createIcons();
    botaoReset.classList.remove("escondido");
    display.style.color = "#ffffff";
  } else {
    //Altera estado
    iniciarCronometro(() => {
      const estadoAtual = getEstado();
      atualizarDisplay(estadoAtual);
    });
    //render
    botaoIniciar.classList.add("redondo");
    botaoIniciar.innerHTML = `<i data-lucide="pause"></i>`;
    lucide.createIcons();
    display.style.color = "#61afef";
    botaoReset.classList.remove("remove");
  }
  const novoEstado = getEstado();
  atualizarStatusTexto(novoEstado);
 
});
console.log("b - listener registrado");
botaoReset.addEventListener("click", () => {
  resetarCronometro();
  const estado = getEstado();
  renderizarPomodoro(estado);
});
