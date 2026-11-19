import { EventoInfo } from "./tipos.js";

export abstract class ErroDeNegocio extends Error {
  constructor(mensagem: string, readonly status: number) {
    super(mensagem);
    this.name = new.target.name;
  }
}

export class DadosInvalidosErro extends ErroDeNegocio {
  constructor(mensagem: string) {
    super(mensagem, 400);
  }
}

export class NaoEncontradoErro extends ErroDeNegocio {
  constructor(mensagem: string) {
    super(mensagem, 404);
  }
}

export class PoltronaOcupadaErro extends ErroDeNegocio {
  constructor(mensagem: string) {
    super(mensagem, 409);
  }
}

export class PagamentoErro extends ErroDeNegocio {
  constructor(mensagem: string) {
    super(mensagem, 502);
  }
}

export class Evento {
  #vendidas: number[] = [];

  constructor(
    readonly id: number,
    readonly nome: string,
    readonly preco: number,
    readonly capacidade: number
  ) {}

  get disponivel(): number {
    return this.capacidade - this.#vendidas.length;
  }

  reservar(poltronas: number[]): void {
    if (!poltronas || poltronas.length === 0) {
      throw new DadosInvalidosErro("A lista de poltronas não pode ser vazia.");
    }

    if (new Set(poltronas).size !== poltronas.length) {
      throw new DadosInvalidosErro("Não é permitido repetir poltronas no mesmo pedido.");
    }

    for (const poltrona of poltronas) {
      if (!Number.isInteger(poltrona) || poltrona < 1 || poltrona > this.capacidade) {
        throw new DadosInvalidosErro(`Poltrona ${poltrona} inválida para este evento.`);
      }
    }

    for (const poltrona of poltronas) {
      if (this.#vendidas.includes(poltrona)) {
        throw new PoltronaOcupadaErro(`A poltrona ${poltrona} já foi vendida.`);
      }
    }

    this.#vendidas.push(...poltronas);
  }

  liberar(poltronas: number[]): void {
    if (new Set(poltronas).size !== poltronas.length) {
      throw new DadosInvalidosErro("Poltronas repetidas na liberação.");
    }

    for (const poltrona of poltronas) {
      if (!this.#vendidas.includes(poltrona)) {
        throw new DadosInvalidosErro(`A poltrona ${poltrona} não estava vendida.`);
      }
    }

    this.#vendidas = this.#vendidas.filter((p) => !poltronas.includes(p));
  }

  info(): EventoInfo {
    return {
      id: this.id,
      nome: this.nome,
      preco: this.preco,
      capacidade: this.capacidade,
      disponivel: this.disponivel,
    };
  }
}