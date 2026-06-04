// ==========================================
// REQUISITOS DE NEGÓCIO - TODO LIST (MVP)
// ==========================================

// [ ] PILAR 1: CRIAR TAREFA (CREATE)
// -> Capturar o valor do input
const inputTarefa = document.getElementById("inputTarefa");
const btnAdicionarTarefas = document.getElementById("btnAdicionar");
const listaTarefas = document.getElementById("listaTarefas");

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
// Renderização Visual
    let novoItem = document.createElement("li");
// Criar o botão X dinamicamente aqui
    let buttonDelete = document.createElement("button");
    buttonDelete.textContent = "X";
// Escutar o clique no botão
    buttonDelete.addEventListener("click", () => {
        // Pegar o pai do botão e ler o dataset
        let idCapturado = novoItem.dataset.id;
        // [ ] PILAR 2: LISTAR TAREFAS (READ)
        listaDetarefasArray = listaDetarefasArray.filter(tarefa => Number(idCapturado) !== tarefa.id);
        novoItem.remove()
        console.log(listaDetarefasArray);
        
    })
    novoItem.dataset.id = novaTarefa.id;
    let textoNode = document.createTextNode(tarefas)
    novoItem.appendChild(textoNode);
    novoItem.appendChild(buttonDelete);
    listaTarefas.appendChild(novoItem);
// -> Limpar o campo de texto após a criação.
    inputTarefa.value = "";
})

inputTarefa.addEventListener("input", () =>{
    inputTarefa.classList.remove("input-erro");
    inputTarefa.placeholder = "Digite uma nova tarefa..."
})


// [ ] PILAR 2: LISTAR TAREFAS (READ)
// -> Limpar o contêiner HTML antes de renderizar para não duplicar.
// -> Percorrer o array de tarefas (usando forEach).
// -> Criar a estrutura HTML de forma dinâmica para cada tarefa.
// -> Injetar a estrutura na tela.


// [ ] PILAR 3: CONCLUIR TAREFA (UPDATE)
// -> Capturar o clique na caixinha de seleção (checkbox) ou no texto.
// -> Alternar o estado (true/false) da propriedade de conclusão no objeto.
// -> Aplicar o estilo visual de "concluído" (ex: linha cortada no texto).


// [ ] PILAR 4: DELETAR TAREFA (DELETE)
// -> Capturar o clique no botão de lixeira.
// -> Filtrar o array principal para remover o objeto correspondente.
// -> Chamar a função de listar tarefas novamente para atualizar a tela.


// [ ] BÔNUS TÉCNICO: PERSISTÊNCIA (localStorage)
// -> Função para salvar o array atualizado no banco local (convertendo para string).
// -> Função para carregar os dados ao abrir a página (convertendo de volta para objeto).