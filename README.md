# WebTech – Sistema de Controle de Manutenção de Equipamentos

Trabalho desenvolvido para a disciplina **Desenvolvimento Web II**, do curso de Análise e Desenvolvimento de Sistemas da Universidade Federal do Paraná (UFPR – SEPT).

O WebTech é um sistema web destinado ao gerenciamento de solicitações de manutenção de equipamentos. A aplicação permite que clientes registrem equipamentos com defeito, acompanhem seus orçamentos e consultem o andamento dos serviços. Os funcionários podem gerenciar as solicitações, elaborar orçamentos, realizar manutenções e redirecionar serviços.

## 1. Funcionalidades

O sistema possui dois perfis de acesso: **Cliente** e **Funcionário**.

### 1.1. Cliente

O cliente pode:

- Realizar autocadastro no sistema.
- Efetuar login.
- Cadastrar solicitações de manutenção.
- Informar os dados do equipamento e a descrição do defeito.
- Consultar suas solicitações.
- Visualizar os orçamentos recebidos.
- Aprovar ou rejeitar um orçamento.
- Consultar o histórico de alterações de cada solicitação.
- Acompanhar o andamento da manutenção.
- Realizar o pagamento após a conclusão do serviço, conforme o fluxo implementado.

### 1.2. Funcionário

O funcionário pode:

- Efetuar login no sistema.
- Consultar as solicitações cadastradas.
- Visualizar os dados dos equipamentos e dos clientes.
- Elaborar e registrar orçamentos.
- Registrar informações sobre a manutenção realizada.
- Adicionar orientações destinadas ao cliente.
- Redirecionar solicitações para outros funcionários.
- Consultar o histórico das alterações.

---

## 2. Fluxo das solicitações

As solicitações passam por diferentes estados durante o processo de manutenção:

| Status | Descrição |
|---|---|
| ABERTA | Solicitação cadastrada pelo cliente. |
| ORÇADA | Orçamento elaborado pelo funcionário. |
| APROVADA | Orçamento aprovado pelo cliente. |
| REJEITADA | Orçamento rejeitado pelo cliente. |
| REDIRECIONADA | Solicitação encaminhada para outro funcionário. |
| ARRUMADA | Manutenção registrada como concluída. |
| PAGA | Pagamento realizado pelo cliente. |
| FINALIZADA | Processo de manutenção encerrado. |

Cada alteração de status deve ser registrada no histórico da solicitação, permitindo acompanhar as etapas do atendimento.

---

## 3. Tecnologias utilizadas

| Camada | Tecnologias |
|---|---|
| Front-end | Angular, TypeScript, HTML, CSS e Bootstrap |
| Componentes e interface | Angular Standalone, Signals e ng-bootstrap |
| Recursos adicionais | ngx-mask, jsPDF e Font Awesome |
| Back-end | Java, Spring Boot e Spring Web |
| Persistência | Spring Data JPA e Hibernate |
| Validação | Jakarta Bean Validation |
| Comunicação | API REST e JSON |
| Banco de dados | MySQL 8 |

---

## 4. Estrutura do repositório

```text
Trabalho_WEB2/
│
├── banco/
│   ├── webtech_schema.sql
│   └── webtech_massa_dados.sql
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── shared/
│   │   ├── guards/
│   │   └── ...
│
├── webtech/
│   ├── src/
│   │   └── main/
│   │       ├── java/br/net/webtech/webtech/
│   │       │   ├── model/
│   │       │   ├── repository/
│   │       │   ├── service/
│   │       │   ├── rest/
│   │       │   └── seguranca/
│   │       └── resources/
│   │
│   └── pom.xml
│
├── package.json
└── README.md
```

### Organização do back-end

- **model:** entidades JPA e DTOs utilizados na comunicação da aplicação.
- **repository:** interfaces responsáveis pelo acesso e persistência dos dados.
- **service:** regras de negócio e operações do sistema.
- **rest:** controladores responsáveis pelos endpoints da API.
- **seguranca:** recursos relacionados à segurança e ao tratamento de senhas.

### Organização do front-end

- **components:** telas e componentes da interface.
- **services:** comunicação HTTP com o back-end e demais serviços.
- **shared:** modelos e recursos compartilhados.
- **guards:** controle de acesso às rotas.
- **assets:** imagens e outros arquivos estáticos.

---

## 5. Banco de dados

O sistema utiliza MySQL 8 para armazenar as informações dos clientes, funcionários, equipamentos, solicitações e históricos.

Os scripts SQL estão disponíveis na pasta `banco/`:

- `webtech_schema.sql`: criação da estrutura do banco de dados.
- `webtech_massa_dados.sql`: inserção dos dados iniciais para testes.

O histórico das solicitações é armazenado separadamente, permitindo registrar as alterações realizadas durante o atendimento.

---

## 6. Como executar o projeto

### 6.1. Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Git.
- JDK compatível com o projeto.
- Node.js (versão LTS).
- Angular CLI.
- MySQL 8.
- MySQL Workbench.

### 6.2. Clonar o repositório
