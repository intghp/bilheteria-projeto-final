import { Ingresso, Pessoa } from "./tipos.js";

export function valorDoIngresso(precoBase: number) {
  return (tipo: "inteira" | "meia"): number =>
    tipo === "meia" ? Math.round((precoBase / 2) * 100) / 100 : precoBase;
}

export function aplicarTaxa(percentual: number) {
  return (valor: number): number =>
    Math.round(valor * (1 + percentual) * 100) / 100;
}

export function montarIngressos(
  precoBase: number,
  pessoas: Pessoa[],
  temDireitoAMeia: (pessoa: Pessoa) => boolean
): Ingresso[] {
  const calcularValor = valorDoIngresso(precoBase);

  return pessoas.map((pessoa): Ingresso => {
    const tipo = temDireitoAMeia(pessoa) ? "meia" : "inteira";
    return {
      nome: pessoa.nome,
      poltrona: pessoa.poltrona,
      tipo,
      valor: calcularValor(tipo),
    };
  });
}

export function calcularTotal(ingressos: Ingresso[]): number {
  const subtotal = ingressos.reduce((soma, ingresso) => soma + ingresso.valor, 0);
  return aplicarTaxa(0.1)(subtotal);
}