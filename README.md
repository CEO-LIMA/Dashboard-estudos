# Dashboard de Estudos

Um ecossistema integrado focado em produtividade e gerenciamento de tempo para estudantes de programação e hardware.

## Mapa de Arquitetura e Próximos Passos

### Fase 1: Reestruturação do DOM (HTML)

- [ ] Criar a tag `<main>` principal para gerenciar o Layout Global.
- [ ] Implementar a `<section id="sidebar">` para navegação futura.
- [ ] Isolar o bloco do Pomodoro Timer.
- [ ] Criar a seção de estatísticas contendo os cards: _Ciclos Concluídos_, _Minutos de Foco_ e _Tarefas Prontas_.
- [ ] Dividir a lista To-Do em dois blocos: _Tarefas em Andamento_ e _Tarefas Concluídas_.

### Fase 2: Engenharia de Layout (CSS)

- [ ] Implementar `display: grid` no container principal.
- [ ] Definir linhas e colunas responsivas utilizando a unidade de fração (`fr`).
- [ ] Estilizar os blocos independentes no formato de cards modernos com fundo escuro.

### Fase 3: Persistência e Lógica Aplicada (JavaScript)

- [ ] Refatorar a mira dos seletores do Pomodoro para injetar os ciclos nos novos cards de estatísticas.
- [ ] Implementar o pilar bônus de salvamento e recuperação automática usando `localStorage` (`JSON.stringify` / `JSON.parse`).
