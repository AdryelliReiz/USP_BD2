# 📄 Documentação da Estrutura de Interfaces

## 🤝 Como Colaborar

1. **Clone o projeto**:
    ```bash
    git clone https://github.com/AdryelliReiz/USP_BD1
    ```

2. **Crie uma branch para trabalhar na feature desejada**:
    ```bash
    git checkout frontend
    git branch <feature>:<nome_da_feature>
    git checkout <feature>:<nome_da_feature>
    ```

3. **Acesse o diretório do APP**:
    ```bash
    cd USP_BD1/frontend/<APP>
    ```

4. **Baixe os pacotes de dependências**:
    ```bash
    npm i   # Usando npm
    yarn    # Usando yarn
    ```

5. **Ao finalizar as modificações e testar a feature**, volte para o diretório root, faça um commit e envie as suas modificações para o GitHub:
    ```bash
    cd ../..    #volta para o diretório root
    git add . # Adicionando todos os arquivos modificados
    git commit -m "<ação>:<descrição simples sobre o que foi feito aqui>" # Explicação abaixo
    git push --set-upstream origin <branch_name>
    ```
    **Nota**:
    - `<ação>` é o tipo de ação realizada:
      - `create`: cria uma nova feature
      - `add`: adiciona algo a uma feature existente
      - `fix`: corrige algum bug
      - `edit`: edita alguma lógica da funcionalidade
    - A descrição é uma frase simples que resume o que foi feito (ex: `create: tela home`).

6. **Crie um Pull Request no GitHub** ou peça para algum colega revisar. Para evitar conflitos, use a branch `frontend` para merges, mantendo a organização entre back-end e front-end.

---

## 🚀 Criando Outra Feature

1. **Volte à branch de origem** (`frontend`), puxe as atualizações e comece a trabalhar em outra feature:
    ```bash
    git checkout frontend
    git pull
    ```
2. **Repita os passos anteriores** para criar uma nova branch e trabalhar na nova feature.

---

☕ **Nota Importante**:
- Não se esqueça de fazer pausas para o café!
- Peça ajuda aos colegas se estiver com dificuldades.
- Realize calls com o time sempre que necessário para discutir o progresso e tirar dúvidas.
- Use flex-box para tudo :)
