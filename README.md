# WebTech – Sistema de Controle de Manutenção de Equipamentos
 
Trabalho da disciplina **Desenvolvimento WEB II** (UFPR – SEPT).
Sistema web para controle de manutenção de equipamentos, baseado em **solicitações de serviço** que passam por vários estados (aberta, orçada, aprovada, arrumada, paga, finalizada...) e mantêm o **histórico completo** de cada alteração.
 
O acesso é feito por dois perfis, **Cliente** e **Funcionário**. Todas as funcionalidades exigem login, exceto o autocadastro de clientes e o próprio login.
 
> **Status:** em desenvolvimento. Entrega em **11/11/2026**. Todos os dados do sistema são **fictícios**.

 
## Tecnologias
 
| Camada | Tecnologias |
|---|---|
| Front-end | Angular (componentes standalone, signals), Bootstrap, ng-bootstrap, ngx-mask, jsPDF, Font Awesome |
| Back-end | Java 21, Spring Boot 4.1, Spring Web (REST), Spring Data JPA / Hibernate, Bean Validation, Spring Mail |
| Banco de dados | MySQL 8 |
| Protótipo (temporário) | json-server 0.17.4, usado até todas as telas serem migradas para a API |
 

## Estrutura do repositório
 
```
Trabalho_WEB2/
|---- banco/              scripts SQL (schema + massa de dados)
|--src/                   Angular (telas, services, guard, diretivas, pipes)
|-- webtech/              Back-end Spring Boot
|   |-- src/main/java/br/net/webtech/webtech/
|       |-- model/        entidades JPA e DTOs
|       |-- repository/   acesso ao banco
|       |-- service/      regras de negócio
|       |-- rest/         controllers REST
|       |-- seguranca/    SenhaUtil (salt e hash)
|
```

 
## Como executar 
 
**Pré-requisitos:** Git, JDK 25 LTS, Node.js (LTS), MySQL 8 + Workbench 

1. **Banco:** no MySQL Workbench, como `root`, execute `banco/webtech_schema.sql` e depois `banco/webtech_massa_dados.sql`. Crie o usuário do sistema:
```sql
   CREATE USER IF NOT EXISTS 'webtech'@'localhost' IDENTIFIED BY 'webtech123';
   GRANT ALL PRIVILEGES ON webtech.* TO 'webtech'@'localhost';
   FLUSH PRIVILEGES;
```
2. **Back-end** (terminal 1, na pasta `webtech`):
```
   .\mvnw spring-boot:run
```
3. **json-server** (terminal 2, na raiz do repositório):
```
   npm install
   npm run api
```
4. **Front-end** (terminal 3, na raiz do repositório):
```
   npm start
```
