import { Evento } from "./dominio.js";
import { criarPagamentoFalso } from "./pagamento.js";
import { criarBilheteria } from "./bilheteria.js";
import { criarServidor } from "./servidor.js";

const eventos = [
  new Evento(1, "Show Principal", 100, 100),
  new Evento(2, "Peça Teatral", 60, 50),
  new Evento(3, "Festival Rock", 80, 120),
];

const pagar = criarPagamentoFalso({
  latenciaMs: 80,
  taxaDeFalha: 0.1,
});

const bilheteria = criarBilheteria({
  eventos,
  pagar,
  limitePagamentoMs: 500,
});

const app = criarServidor(bilheteria);

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});