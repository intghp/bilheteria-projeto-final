import { Pessoa } from "./tipos.js";

export function direitoAMeia(pessoa: Pessoa): boolean {
    return pessoa.estudante || pessoa.pcd || pessoa.idade >= 60;
}