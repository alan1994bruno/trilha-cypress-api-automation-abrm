# 🧪 CI/CD Pipeline: Cypress, GitHub Actions e Cypress Cloud

Guia direto para configurar a integração contínua (CI) executando testes Cypress via GitHub Actions, com gravação centralizada no Cypress Cloud.

---

## 1. Configurando o Cypress Cloud

1. Crie um projeto no [Cypress Cloud](https://cloud.cypress.io/) e anote o **Project ID** e a **Record Key**.
2. Adicione o `projectId` gerado ao arquivo `cypress.config.js` na raiz do projeto:

```javascript
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: "SEU_PROJECT_ID_AQUI", 
  e2e: {
    setupNodeEvents(on, config) {
      // configurações
    },
  },
})
```

---

## 2. Protegendo a Credencial (GitHub Secrets)

A `Record Key` é sensível e **não deve** ficar no código. 

1. No repositório do GitHub, acesse: **Settings > Secrets and variables > Actions**.
2. Clique em **New repository secret**.
3. **Name:** `CYPRESS_RECORD_KEY`
4. **Secret:** Cole o valor da chave gerada e salve.

---

## 3. Criando o Workflow no GitHub Actions

Crie o arquivo `.github/workflows/cypress-run.yml`. O workflow abaixo reflete a configuração real utilizada, executando exclusivamente na branch `main`. 

Ele utiliza uma imagem Docker oficial com permissões ajustadas (`--user 1001`), garante a versão correta do Node.js, faz a instalação limpa das dependências (`npm ci`) e executa um script customizado (`npm run run-other-tests`) usando o Chrome.

```yaml
name:  Run Cypress Tests

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    container:
      image: cypress/browsers:node18.12.0-chrome106-ff106
      options: --user 1001
      
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Set up Node.js
        uses: actions/setup-node@v3.8.1
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Cypress run
        uses: cypress-io/github-action@v6
        with:
          command: npm run run-other-tests 
          browser: chrome
          record: true
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Com esta configuração, qualquer `push` ou `pull_request` na `main` acionará a esteira, executará os testes no Chrome e registrará os resultados no Cypress Cloud.


# Demostrativos no Cypress Cloud

<img width="2514" height="1366" alt="image" src="https://github.com/user-attachments/assets/33035d0d-623f-4aed-b270-d918dd34e469" />
---
<img width="2514" height="1366" alt="image" src="https://github.com/user-attachments/assets/a0682385-7d94-4d4c-bef5-8ac02764b31e" />



