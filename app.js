const btnAumentar = document.getElementById("btnAumentar");
const btnDiminuir = document.getElementById("btnDiminuir");
const painelSetas = document.getElementById("painelSetas")
const botao = document.getElementById("btnIniciar");
const botaoReset = document.getElementById("btnResetar")
const display = document.getElementById("tempoDisplay");
const timerStatus = document.getElementById("timerStatus")
const contadorPainel = document.getElementById("contadorPainel");
const timerPrevisao = document.getElementById("timerPrevisao");
const secaoEstatisticas = document.querySelector(".estatisticas");


// Variáveis do cronômetro
const isTestMode = false;
let TEMPO_FOCO_MIN = isTestMode ? 0 : 25;
let TEMPO_FOCO_SEG = isTestMode ? 5 : 0;
let minimo = 20;
let maximo = 120;
let minutos = TEMPO_FOCO_MIN
let segundos = TEMPO_FOCO_SEG
let cronometroId = null; 
let modoAtual = "foco"; 
let ciclosConcluidos = 0;
let totalCiclosDoDia = 0;

// função de renderizar
const atualizarDisplay = () => {

    // variáveis que recebem minutos e segundos formatados
    let minutosFormatados = minutos.toString().padStart(2, "0");
    let segundosFormatados = segundos.toString().padStart(2, "0");

    // renderiza o cronômetro
    display.textContent = `${minutosFormatados}:${segundosFormatados}`;
}

const atualizarStatusTexto = () => {
    if(modoAtual === "foco"){
        if(ciclosConcluidos === 0){
            timerStatus.textContent = "Período de foco (1 de 2)";

            if(TEMPO_FOCO_MIN >= 60){
                timerPrevisao.innerHTML = "A Seguir: <strong>10 min de intervalor</strong>"
            }else{
               timerPrevisao.innerHTML = "A seguir: <strong>5 min de intervalo</strong>"; 
            }
            botao.textContent = "Iniciar Ciclo ▶️";
        }else if(ciclosConcluidos === 1){
            timerStatus.textContent = "Período de foco (2 de 2)";
            timerPrevisao.innerHTML = "A seguir: <strong>fim do bloco</strong>"
        }
    }
    else if(modoAtual === "descanso"){
        timerStatus.textContent = "Intervalo ☕"
        timerPrevisao.innerHTML = "A seguir: <strong>25 min de foco</strong>"
    }
}

// função cronômetro
const iniciarCronometro = () => {

    // verifica se o cronômetro já foi iniciado
    if(cronometroId !== null) return;

    atualizarStatusTexto();
    secaoEstatisticas.hidden = true;
    timerPrevisao.hidden = false;
    painelSetas.classList.add("escondido")
    
    // API assíncrona (temporizador do browser)
    cronometroId = setInterval(() => {
    // verifica se minutos e segundos são 0 
    if(segundos === 0 && minutos === 0){
        emitirBeep()
        gerenciarFimDeCiclo();
        return;
    }
    if( segundos === 0){
        minutos--;
        segundos = 59;
    }else{
        segundos--;
    }

    atualizarDisplay();

}, 1000);
}

// função de pausar
const pausarCronometro = () => {
    clearInterval(cronometroId);
    cronometroId = null;
    timerPrevisao.textContent = "Em Pausa"
}

// função de Resetar
const resetarCronometro = () => {
    clearInterval(cronometroId);
    minutos = TEMPO_FOCO_MIN;
    segundos = TEMPO_FOCO_SEG;
    modoAtual = "foco"
    ciclosConcluidos = 0;
    atualizarDisplay()
    atualizarStatusTexto()
    cronometroId = null;
    //renderizar o diplay resetado
    botao.textContent = "Iniciar Ciclo ▶️";
    botaoReset.hidden = true;
    painelSetas.classList.remove("escondido")

}

// Função de Ciclos
const gerenciarFimDeCiclo = () => {
    emitirBeep(); // Aviso sonoro toca no fim

    if(modoAtual === "foco"){
        ciclosConcluidos++; // adiciona +1 ao contador
        totalCiclosDoDia++; // adiciona +1 ao Ciclos totais do Dia

        contadorPainel.textContent = totalCiclosDoDia;

        if(ciclosConcluidos === 1){
            // Verifica se o tempo é maior ou igual 1h para adicionar 10 min
            modoAtual = "descanso";
            if(TEMPO_FOCO_MIN >= 60){
                minutos = isTestMode ? 0 : 10;
                segundos = isTestMode ? 5 : 0;
            }else{
                minutos = isTestMode ? 0 : 5;
                segundos = isTestMode ? 5 : 0;
            }
        }
        else if(ciclosConcluidos === 2){
            // Segundo ciclo acabou
            clearInterval(cronometroId);
            cronometroId = null;
            ciclosConcluidos = 0;
            modoAtual = "foco"
            minutos = TEMPO_FOCO_MIN;
            segundos = TEMPO_FOCO_SEG;
            secaoEstatisticas.hidden = false;
            timerPrevisao.hidden = true;
            painelSetas.classList.remove("escondido")
        }
    }
    else if(modoAtual === "descanso"){
        // Descanso de 5 min acabou -> segundo ciclo de foco
        modoAtual = "foco"
        minutos = TEMPO_FOCO_MIN;
        segundos = TEMPO_FOCO_SEG;
    }

    atualizarDisplay(); // Atualiza os números da tela 
    atualizarStatusTexto();
}

// função para emitir o som de aviso (Buzzer)
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
}

// Acrecenta 5 min no cronometro
btnAumentar.addEventListener("click", () =>{
    if(TEMPO_FOCO_MIN < maximo){
        TEMPO_FOCO_MIN += 5;
        minutos = TEMPO_FOCO_MIN;
        atualizarDisplay();
    }
})

// Decrescenta 5 min do cronometro
btnDiminuir.addEventListener("click", () =>{
    if(TEMPO_FOCO_MIN > 20){
        TEMPO_FOCO_MIN -= 5;
        minutos = TEMPO_FOCO_MIN;
        atualizarDisplay();
    }
})

// Evento de partida
botao.addEventListener("click", () => {
    // verifica se cronometro estar parado
    if(cronometroId === null){
        iniciarCronometro();
        botao.textContent = "Pausar ⏸️"
        display.style.color = "#61afef";
        botaoReset.hidden = true;
    }else{
        pausarCronometro();
        botao.textContent = "Iniciar ⏯️";
        display.style.color = "#ffffff";
        botaoReset.hidden = false;
    }

});

// Evento de resetar
botaoReset.addEventListener("click", () => {
    resetarCronometro()
})