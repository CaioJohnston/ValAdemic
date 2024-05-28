# ValAdemic

ValAdemic é uma solução baseada em blockchain para o cadastro e consulta de diplomas acadêmicos. Utiliza Solidity para contratos inteligentes, Truffle para desenvolvimento e implantação, Ganache como blockchain local para testes e Metamask para interação com a blockchain.

## Requisitos

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Truffle](https://www.trufflesuite.com/truffle)
- [Ganache CLI](https://www.trufflesuite.com/ganache)
- [Metamask](https://metamask.io/)

## Instalação

### Passo 1: Instalar Node.js e npm

Faça o download e instale o Node.js e o npm a partir do [site oficial do Node.js](https://nodejs.org/).

### Passo 2: Instalar Truffle e Ganache CLI

Instale Truffle e Ganache CLI globalmente usando npm:

```bash
npm install -g truffle ganache-cli
```

### Passo 3: Clonar o Repositório

Clone este repositório para sua máquina local:

```bash
git clone https://github.com/seuusuario/ValAdemic.git
cd ValAdemic
```

### Passo 4: Instalar Dependências

Instale as dependências do projeto:

```bash
npm install
```

## Configuração

### Passo 1: Iniciar o Ganache CLI

Inicie o Ganache CLI para simular a blockchain local:

```bash
ganache-cli
```

### Passo 2: Compilar e Migrar Contratos

Compile e migre os contratos inteligentes para a blockchain local:

```bash
truffle compile
truffle migrate --reset
```

### Passo 3: Servir a Aplicação

Use `http-server` para servir a aplicação:

1. Instale `http-server` se ainda não estiver instalado:

   ```bash
   npm install -g http-server
   ```

2. Sirva a pasta do projeto:

   ```bash
   http-server
   ```

3. Acesse a aplicação no navegador:

   ```plaintext
   http://127.0.0.1:8080
   ```

### Passo 4: Configurar Metamask

1. **Adicionar Rede Personalizada no Metamask**:
   - Nome da Rede: Ganache
   - Nova URL RPC: `http://127.0.0.1:8545`
   - ID da Cadeia: 1337 (ou 5777, dependendo da configuração do Ganache)
   - Símbolo da Moeda: ETH

2. **Importar Conta do Ganache para Metamask**:
   - No Metamask, vá para "Importar Conta".
   - Escolha "Chave Privada".
   - Cole uma das chaves privadas fornecidas pelo Ganache.

## Uso

### Consulta de Diploma

1. Insira o hash do diploma no campo de consulta.
2. Clique em "Consultar".
3. Veja os detalhes do diploma consultado.

### Cadastro de Diploma

1. Insira a chave da conta no campo de autorização.
2. Clique em "Autorizar Cadastro".
3. Preencha os detalhes do diploma (nome do estudante, ID do estudante, instituição e data).
4. Clique em "Cadastrar Diploma".
5. Veja o hash do diploma registrado.

## Estrutura do Projeto

- `contracts/ValAdemic.sol`: Contrato inteligente para gerenciamento de diplomas.
- `migrations/2_deploy_contracts.js`: Script de migração para implantar o contrato.
- `build/contracts/ValAdemic.json`: Artefato do contrato compilado.
- `index.html`: Interface do usuário para interação com o contrato.
- `app.js`: Script JavaScript para conectar a interface do usuário com a blockchain.
- `truffle-config.js`: Configuração do Truffle.

## Licença

Este projeto está licenciado sob os termos da licença MIT.
