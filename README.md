# Bilheteria concorrente

Projeto final de Paradigmas de Linguagens de Programação. Enunciado completo no Blackboard.

Os arquivos de `src/` que vocês escrevem já existem, vazios; o `tipos.ts` e o `servidor.ts` vêm prontos. O que vai em cada um está no passo
indicado do enunciado:

| Arquivo | Passo do enunciado |
| :--- | :--- |
| `src/tipos.ts` (pronto) | 1: os tipos |
| `src/regras.ts` | 2: meia-entrada |
| `src/preco.ts` | 3: preço (funcional) |
| `src/dominio.ts` | 4: evento e erros (orientado a objetos) |
| `src/bilheteria.ts` | 5: a venda, onde a concorrência aparece |
| `src/servidor.ts` (pronto) e `src/main.ts` | 6: ligar o servidor |

Não alterem `src/pagamento.ts`, `src/servidor.ts`, `src/bench.ts` nem `testes/`: a correção usa os originais.

Para começar, sigam o `GUIA.md`. Depois dele, os comandos são:

```bash
npm install
npm test          # correção automática: mostra os pontos
npm start         # serviço em http://localhost:3000
npm run bench     # com o serviço no ar: 200 pedidos simultâneos no evento 1, dois por poltrona
```

Exemplo de pedido:

```bash
curl.exe http://localhost:3000/eventos

curl.exe -X POST http://localhost:3000/reservas -H "Content-Type: application/json" -d '{\"eventoId\":1,\"ingressos\":[{\"nome\":\"Ana\",\"idade\":20,\"estudante\":true,\"pcd\":false,\"poltrona\":7}]}'

```

---

## Preencham (avaliado no vídeo)

**Link do vídeo:**
> https://youtu.be/ieQDc7NVwr4

### Integrantes

| RGM |Nome | Usuário do GitHub | Parte principal |
| :--- | :--- | :--- | :---
34371168 |Gustavo Henrique de Lucena Paiva | intghp | O projeto inteiro |
| | | |

### Decisões

1. **Concorrência.** Como vocês garantem que duas pessoas não ficam com a mesma poltrona? Onde estava o `await` perigoso?
> A poltrona é marcada como ocupada antes do pagamento porque o node executa uma linha de código por vez até chegar em um await. O await perigoso seria deixar essa marcação para depois de cobrar o cartão. Considerando que um cliente espera o pagamento aprovar, o segundo veria a poltrona livre e compraria. Caso o pagamento falhasse, a poltrona seria devolvida

2. **OO.** O que o `Evento` esconde e por quê? Por que o `reservar` é tudo ou nada? Por que os erros são uma hierarquia de classes?
> O Evento esconde as poltronas que já foram vendidas para que ninguém consiga mexer nela.
> Antes de confirmar, o sistema verifica se todas as poltronas solicitadas estão livres. Se uma delas estiver ocupada, o pedido inteiro é cancelado para que possa repensar e planejar a compra de ingressos novamente
>Cada classe filha de ErroDeNegocio nasce carregando o seu próprio número de status HTTP para que o servidor não precise devolver diversos if/else

3. **Funcional.** O que ganhamos com `preco.ts` puro? Como vocês testariam ele sem subir o servidor?
> Essas funções não alteram o estado de nada fora delas, ou seja, um pedido nunca atrapalharia o cálculo do outro. Sobre o servidor, é possível realizar testes locais passando dados fictícios e funções que validem

4. **Se fosse em outro paradigma.** Escolham uma das partes e expliquem como ficaria em outro paradigma, e se ficaria melhor ou pior.
> Se a lógica de preco.ts fosse alterada para Orientação a Objetos, teríamos que criar classes com estado interno e instanciar objetos a cada venda, além de gerenciar atributos mutáveis em vez de apenas utilizar funções puras. Portanto, ficaria pior pois geraria mais códigos repetitivos para fazer contas simples.

5. **Concorrente × paralelo.** O Node roda o JavaScript numa linha só: os pedidos de vocês são concorrentes, não paralelos. O que mudaria se a venda rodasse em vários núcleos ao mesmo tempo?
> Ocorreria a chance de duas vendas apontarem para a mesma poltrona no mesmo instante, vendendo para duas pessoas. 

### Resultados do bench

| Cenário | Pedidos | Tempo (ms) | Vendidos | Poltrona ocupada | Falha de pagamento |
| :--- | ---: | ---: | ---: | ---: | ---: |
| Padrão (`main.ts`) | 200 | 198 | 91 | 100 | 9 |

O bench ocupa as poltronas do evento 1: para rodar de novo, parem o `npm start` (Ctrl+C) e subam outra
vez.

O que os números mostram: 
> Os números mostram que dos 200 pedidos, 100 foram barrados na hora por poltronas ocupadas, mostrando que niguém comprou lugar repetido. Dos 100 que foram para o pagamento, 91 deram certo e 9 falharam, batendo com a taxa de 10% de erro simulado, e tiveram as cadeiras devolvidas. Todo esse processo levou 198 ms.
