import { getEstado, resetarCronometro } from "./modules/pomodoro/pomodoro";
import { renderizarPomodoro } from "./modules/pomodoro/render";
import { botaoReset } from "./modules/pomodoro/DOM";

botaoReset.addEventListener("click", () => {
  resetarCronometro();
  const estado = getEstado();
  renderizarPomodoro(estado);
});
