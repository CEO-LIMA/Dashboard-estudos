// ==========================================
// REQUISITOS DE NEGÓCIO - TODO LIST (MVP)
// ==========================================

// [ ] PILAR 1: CRIAR TAREFA (CREATE)
// -> Capturar o valor do input
const inputTarefa = document.getElementById("inputTarefa");
const btnAdicionarTarefas = document.getElementById("btnAdicionar");
const listaTarefas = document.getElementById("listaTarefas");

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
    let novoItem = document.createElement("li");
    novoItem.textContent = tarefas;
    listaTarefas.appendChild(novoItem);
    inputTarefa.value = "";
})
inputTarefa.addEventListener("input", () =>{
    inputTarefa.classList.remove("input-erro");
    inputTarefa.placeholder = "Digite uma nova tarefa..."
})
// -> Criar o objeto da tarefa e empurrar (push) para o array principal.
// -> Limpar o campo de texto após a criação.


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