// ==========================================
// REQUISITOS DE NEGÓCIO - TODO LIST (MVP)
// ==========================================

// [ ] PILAR 1: CRIAR TAREFA (CREATE)
// -> Capturar o valor do input
const inputTarefa = document.getElementById("inputTarefa");
const btnAdicionarTarefas = document.getElementById("btnAdicionar");
const listaTarefas = document.getElementById("listaTarefas");
const contadorPainel = document.getElementById("contadorPainel");
const tempoFocoPainel = document.getElementById("tempoFocoPainel")
const ofensivaPainel = document.getElementById("ofensivaPainel");

let listaDetarefasArray = [];

btnAdicionarTarefas.addEventListener("click", (e) =>{
    e.preventDefault();
// -> Validar se o campo não está vazio (remover espaços com .trim()).
    let tarefas = inputTarefa.value.trim();
    if(tarefas === ""){
        inputTarefa.classList.remove("input-erro");
        inputTarefa.offsetWidth;
        inputTarefa.placeholder = "Ei! Escreva uma tarefa real!";
        inputTarefa.classList.add("input-erro");
        inputTarefa.focus()
        return;
    }
// -> Criar o objeto da tarefa e empurrar (push) para o array principal.
    let novaTarefa = {
        id: Date.now(),
        texto: tarefas,
        concluida: false
    }
    listaDetarefasArray.push(novaTarefa);
    // Chama a função de Renderizar e limpar 
    renderizarTarefas();
    // -> Limpar o campo de texto após a criação.
    inputTarefa.value = "";
})
inputTarefa.addEventListener("input", () =>{
    inputTarefa.classList.remove("input-erro");
    inputTarefa.placeholder = "Digite uma nova tarefa..."
})

// [ ] PILAR 2: LISTAR TAREFAS (READ)
const renderizarTarefas = () => {
    // -> Limpar o contêiner HTML antes de renderizar para não duplicar.
    listaTarefas.innerHTML = "";
    // 2. Checa se o disjuntor do array está vazio
    if(listaDetarefasArray.length === 0){
        listaTarefas.innerHTML = "<li>Nenhuma tarefa cadastrada.</li>";
        return;
    }
    // -> Percorrer o array de tarefas.
    listaDetarefasArray.forEach(tarefa => {
    let novoItem = document.createElement("li");
    // Cria o ID do objeto atual no dataset do LI
    novoItem.dataset.id = tarefa.id;
    // Cria o nó de texto usando o texto do objeto atual
    let textoFormatado = tarefa.texto.charAt(0).toUpperCase() + tarefa.texto.slice(1);
    let textoNode = document.createTextNode(textoFormatado);
    novoItem.appendChild(textoNode);
    // Cria e configura o botão
    let buttonDelete = document.createElement("button");
    buttonDelete.textContent = "X";
    // Evento de delete com filter
    buttonDelete.addEventListener("click", () =>{
        let idCapturado = novoItem.dataset.id;
        listaDetarefasArray = listaDetarefasArray.filter(t => Number(idCapturado) !== t.id);
        // Chama a função de Renderizar as Tarefas
        renderizarTarefas();
    });

    // [ ] PILAR 3: CONCLUIR TAREFA (UPDATE)

    // Cria o elemneto input
    let checkBoxConcluir = document.createElement("input");
    novoItem.classList.add("todo-item");
    checkBoxConcluir.type = "checkbox";
    novoItem.classList.add("todo-item");
    checkBoxConcluir.addEventListener("change", () =>{
        // -> Alternar o estado (true/false) da propriedade de conclusão no objeto.
        let tarefaEncontrada = listaDetarefasArray.find(item => item.id === tarefa.id);
        if(tarefaEncontrada){
            tarefaEncontrada.concluida = checkBoxConcluir.checked;
        }
        console.log(tarefaEncontrada)
    })
    novoItem.appendChild(checkBoxConcluir);
    listaTarefas.appendChild(novoItem);

    // -> Aplicar o estilo visual de "concluído" (ex: linha cortada no texto).
    // Cria o elemneto input

    // Junta o botão ao LI e o LI ao UL
    novoItem.appendChild(buttonDelete);
    listaTarefas.appendChild(novoItem);
    });
    // -> Criar a estrutura HTML de forma dinâmica para cada tarefa.
    // -> Injetar a estrutura na tela.
}
const atualizarEstatisticas = () => {
    console.log("Aló")
}

// [ ] BÔNUS TÉCNICO: PERSISTÊNCIA (localStorage)
// -> Função para salvar o array atualizado no banco local (convertendo para string).
// -> Função para carregar os dados ao abrir a página (convertendo de volta para objeto).