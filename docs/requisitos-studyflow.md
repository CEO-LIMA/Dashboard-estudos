# StudyFlow

**Documentação Inicial de Requisitos e Domínio - v0.1**  
**Status:** Em definição  
**Objetivo:** estabelecer uma base funcional e de domínio antes da evolução arquitetural do projeto.

---

## 1. Visão do Produto

O StudyFlow é uma aplicação voltada à organização, acompanhamento e foco nos estudos.

A ideia central do sistema é o conceito de **Flow**.

Um Flow representa um espaço dedicado ao acompanhamento de um assunto específico de estudo, como:

- Módulos ES6
- Autenticação com Google
- Flexbox
- Modelagem de Domínio
- Estruturas de Dados

Cada Flow concentra informações relacionadas ao processo de aprendizagem daquele assunto:

- Topics
- Tasks
- StudySessions
- Notes
- progresso
- métricas

---

## 2. Objetivo do Produto

- Mostrar ao usuário o que ele está estudando.
- Evidenciar o que está pendente, em andamento e dominado/concluído.
- Organizar tarefas dentro do contexto de estudo correto.
- Registrar tempo e sessões dedicadas a cada Flow.
- Manter histórico para consulta e revisão futura.
- Evitar informações e tarefas de estudo sem contexto.

---

## 3. Conceitos do Domínio

### 3.1 Flow

Um Flow é o espaço de acompanhamento de um assunto de estudo.

- Pode conter Topics, Tasks, StudySessions, Notes, progresso e métricas.
- Possui ciclo de vida próprio.
- Estados inicialmente previstos:
  - Planejado
  - Em estudo
  - Em prática
  - Concluído
- A conclusão é uma decisão explícita do usuário.

### 3.2 Topic

Um Topic representa um tópico específico dentro do assunto estudado em um Flow.

Exemplos:

- Named exports
- Default exports
- Imports
- Dynamic imports

Estados inicialmente previstos:

- Pendente
- Estudando
- Dominado

O estado representa a percepção do usuário sobre sua evolução naquele tópico.

### 3.3 Task

Uma Task representa uma ação concreta que o usuário deseja realizar durante seus estudos.

- Toda Task pertence obrigatoriamente a um Flow.
- Uma Task pode opcionalmente estar vinculada a um Topic.
- Estados inicialmente previstos:
  - Pendente
  - Em andamento
  - Concluída

Exemplos:

- fazer exercício
- refatorar uma feature
- escrever resumo
- revisar conteúdo

### 3.4 StudySession

Uma StudySession representa um período efetivamente dedicado ao estudo.

- Toda sessão pertence obrigatoriamente a um Flow.
- Pode estar vinculada opcionalmente a um Topic.
- Pode estar vinculada opcionalmente a uma Task.
- O Pomodoro funciona como mecanismo para executar e registrar StudySessions.

---

## 4. Relações Iniciais do Domínio

| Entidade | Relacionamento |
|---|---|
| Flow | possui 0..N Topics, 0..N Tasks e 0..N StudySessions |
| Topic | pertence a 1 Flow |
| Task | pertence a 1 Flow e pode pertencer a 0..1 Topic |
| StudySession | pertence a 1 Flow e pode apontar para 0..1 Topic e 0..1 Task |

---

## 5. Requisitos Funcionais - RF

| ID | Nome | Descrição |
|---|---|---|
| RF01 | Criar Flow | O usuário deve poder criar um novo Flow informando o assunto que deseja acompanhar. |
| RF02 | Visualizar Flows ativos | O usuário deve poder visualizar os Flows que ainda não foram concluídos. |
| RF03 | Acessar Flow | O usuário deve poder acessar individualmente um Flow e visualizar suas informações. |
| RF04 | Criar Topic | O usuário deve poder adicionar Topics a um Flow. |
| RF05 | Alterar estado de Topic | O usuário deve poder alterar o estado de um Topic entre Pendente, Estudando e Dominado. |
| RF06 | Criar Task | O usuário deve poder criar uma Task dentro de um Flow. |
| RF07 | Vincular Task a Topic | O usuário deve poder opcionalmente vincular uma Task a um Topic do mesmo Flow. |
| RF08 | Alterar estado de Task | O usuário deve poder alterar o estado de uma Task. |
| RF09 | Visualizar Tasks | O usuário deve visualizar todas as Tasks do Flow juntas, tenham ou não Topic associado. |
| RF10 | Distinguir Tasks por estado | A interface deve evidenciar Tasks pendentes, em andamento e concluídas. |
| RF11 | Iniciar StudySession | O usuário deve poder iniciar uma sessão de estudo dentro de um Flow. |
| RF12 | Utilizar Pomodoro | O usuário deve poder utilizar o Pomodoro durante uma StudySession. |
| RF13 | Vincular sessão a Topic | O usuário pode opcionalmente informar qual Topic está estudando. |
| RF14 | Vincular sessão a Task | O usuário pode opcionalmente relacionar a sessão a uma Task. |
| RF15 | Registrar sessão | O sistema deve registrar informações da StudySession concluída. |
| RF16 | Visualizar progresso | O usuário deve poder visualizar informações de progresso do Flow. |
| RF17 | Concluir Flow | O usuário deve poder marcar manualmente um Flow como concluído. |
| RF18 | Visualizar Flows concluídos | O usuário deve acessar uma área separada para Flows concluídos. |
| RF19 | Consultar Flow concluído | Flows concluídos devem permanecer acessíveis para consulta e revisão. |

---

## 6. Regras de Negócio - RN

| ID | Regra |
|---|---|
| RN01 | Um Flow representa o espaço de acompanhamento de um assunto de estudo. |
| RN02 | Um Flow pode existir inicialmente sem Topics cadastrados. |
| RN03 | O usuário pode adicionar Topics a um Flow posteriormente. |
| RN04 | Toda Task deve pertencer obrigatoriamente a um Flow. |
| RN05 | Uma Task pode existir sem estar vinculada a um Topic. |
| RN06 | Task e Topic relacionados devem pertencer ao mesmo Flow. |
| RN07 | Concluir todas as Tasks não conclui automaticamente o Flow. |
| RN08 | Concluir/dominar todos os Topics não conclui automaticamente o Flow. |
| RN09 | Um Flow só pode ser concluído por ação explícita do usuário. |
| RN10 | Um Flow concluído deve permanecer armazenado. |
| RN11 | Flows concluídos permanecem disponíveis para consulta e revisão. |
| RN12 | Toda StudySession deve pertencer obrigatoriamente a um Flow. |
| RN13 | Uma StudySession pode existir sem Topic ou Task associados. |
| RN14 | Uma StudySession pode ser vinculada opcionalmente a um Topic. |
| RN15 | Uma StudySession pode ser vinculada opcionalmente a uma Task. |
| RN16 | Topic ou Task associados a uma StudySession devem pertencer ao mesmo Flow. |
| RN17 | O estado de um Topic é controlado pelo usuário. |
| RN18 | Concluir uma Task não significa automaticamente dominar seu Topic. |
| RN19 | Marcar um Topic como dominado não implica concluir automaticamente as Tasks relacionadas. |

---

## 7. Requisitos Não Funcionais - RNF

Estes requisitos são iniciais e podem evoluir conforme a arquitetura e o escopo técnico forem definidos.

| ID | Nome | Descrição |
|---|---|---|
| RNF01 | Modularidade | O JavaScript deve ser organizado por responsabilidade/feature, evitando concentração excessiva de responsabilidades. |
| RNF02 | Responsividade | A interface deve ser utilizável em diferentes tamanhos de tela. |
| RNF03 | Persistência | Os dados devem permanecer disponíveis após fechar e abrir a aplicação. A tecnologia de persistência ainda não está definida. |
| RNF04 | Feedback visual | Mudanças importantes de estado devem possuir feedback visual claro. |
| RNF05 | Manutenibilidade | Features diferentes devem possuir responsabilidades claramente separadas. |
| RNF06 | Consistência visual | Flows, Topics, Tasks e respectivos estados devem ter representação visual consistente. |

---

## 8. Casos de Uso Iniciais

### UC01 - Criar Flow

- **Ator:** Usuário.
- **Objetivo:** criar um espaço para acompanhar determinado assunto.
- **Fluxo principal:** solicitar criação -> informar assunto -> confirmar -> sistema cria o Flow -> Flow aparece entre os ativos.
- **Pós-condição:** existe um novo Flow disponível para organização.

### UC02 - Criar Topic

- **Ator:** Usuário.
- **Pré-condição:** Flow existente.
- **Fluxo principal:** acessar Flow -> solicitar Topic -> informar tópico -> confirmar -> sistema adiciona ao Flow.

### UC03 - Criar Task

- **Ator:** Usuário.
- **Pré-condição:** Flow existente.
- **Fluxo principal:** acessar Flow -> criar Task -> informar descrição -> opcionalmente selecionar Topic -> confirmar.
- **Fluxo alternativo:** sem Topic, a Task permanece pertencendo diretamente ao Flow.

### UC04 - Alterar estado de Task

- **Ator:** Usuário.
- **Fluxo:** selecionar Task -> alterar estado -> sistema registra -> interface atualiza feedback visual.

### UC05 - Alterar estado de Topic

- **Ator:** Usuário.
- **Fluxo:** selecionar Topic -> alterar estado -> sistema registra -> interface apresenta o novo estado.

### UC06 - Iniciar StudySession

- **Ator:** Usuário.
- **Pré-condição:** Flow existente.
- **Fluxo:** acessar Flow -> iniciar sessão -> opcionalmente selecionar Topic/Task -> iniciar Pomodoro -> sistema inicia StudySession.

### UC07 - Finalizar StudySession

- **Ator:** Usuário.
- **Fluxo:** finalizar sessão -> sistema registra duração e relacionamentos -> dados ficam disponíveis para histórico e métricas.

### UC08 - Concluir Flow

- **Ator:** Usuário.
- **Pré-condição:** Flow ativo.
- **Fluxo:** solicitar conclusão -> sistema pede confirmação -> usuário confirma -> status muda para concluído -> Flow sai dos ativos e aparece nos concluídos.
- **Regra:** Tasks ou Topics pendentes não impedem automaticamente a conclusão.

### UC09 - Consultar Flow concluído

- **Ator:** Usuário.
- **Fluxo:** acessar Flows concluídos -> selecionar Flow -> sistema apresenta histórico e informações armazenadas.

---

## 9. Modelo Inicial das Entidades

### Flow

```text
id
title
status
createdAt
completedAt?
```

### Topic

```text
id
flowId
title
status
createdAt
```

### Task

```text
id
flowId
topicId?
title
status
createdAt
completedAt?
```

### StudySession

```text
id
flowId
topicId?
taskId?
startedAt
finishedAt
duration
```

### Note

Entidade candidata. Estrutura ainda não definida.

---

## 10. Métricas

Neste momento, Metrics não será tratada automaticamente como entidade.

Métricas inicialmente previstas:

- Tempo total estudado.
- Quantidade de sessões.
- Quantidade de Tasks concluídas.
- Progresso do Flow.

Esses valores podem inicialmente ser calculados a partir de Flow, Task, Topic e StudySession.

Uma entidade própria só deve surgir se requisitos futuros justificarem.

---

## 11. Estrutura Conceitual do Produto

```text
Dashboard geral
    ↓
Flows ativos
    ↓
Flow individual
    ↓
Topics / Tasks / StudySessions / Notes / Progresso
    ↓
Flows concluídos e histórico
```

---

## 12. Escopo Inicial Sugerido

### v0.2 - Estabilização

- Modularizar Pomodoro.
- Modularizar Tasks.
- Corrigir regressões.
- Separar responsabilidades.
- Estabilizar o comportamento existente.
- Evitar implementar todo o domínio novo enquanto a base atual estiver quebrada.

### v0.3 - Fundação de Flow

- Criar Flow.
- Listar Flows.
- Acessar Flow.
- Criar Topics.
- Criar Tasks associadas ao Flow.
- Vínculo opcional Task -> Topic.
- Estados básicos.

### Evoluções posteriores

- StudySessions integradas ao Flow.
- Histórico e analytics.
- Notes.
- Flows concluídos.
- Revisões e filtros.
- Persistência mais robusta.
- Possível backend e autenticação no futuro.

---

## 13. Princípio Arquitetural Inicial

O sistema deve evoluir baseado em responsabilidade de domínio, evitando módulos organizados apenas pelo tipo técnico de código.

Exemplo conceitual:

```text
features/flow
features/topics
features/tasks
features/pomodoro
features/study-session
shared
```

`shared` deve ser utilizado apenas para responsabilidades realmente compartilhadas.

A estrutura definitiva deve surgir conforme as responsabilidades forem ficando claras durante a implementação.

O objetivo não é prever toda a arquitetura antecipadamente, mas evitar voltar ao modelo em que todas as funcionalidades conhecem e manipulam diretamente tudo no sistema.
