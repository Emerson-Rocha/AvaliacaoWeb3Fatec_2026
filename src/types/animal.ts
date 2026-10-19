export type TipoAnimal = "cao" | "gato";
export type PorteAnimal = "pequeno" | "medio" | "grande";
export type SexoAnimal = "macho" | "femea";

export type StatusAnimal =
  | "indisponivel"
  | "disponivel"
  | "passeando"
  | "festa_pijama"
  | "falecido"
  | "adotado";

export interface Animal {
  id: number;
  nome: string;
  rg: string;
  tipo: TipoAnimal;
  porte: PorteAnimal;
  raca: string;
  idade: string;
  sexo: SexoAnimal;

  status: StatusAnimal;

  fotos: string[];
  fotoPrincipal: string;

  prontuario: {
    castrado: boolean;
    vermifugado: boolean;
    vacinado: boolean;
    vacinas: string[];
    observacoes: string;
  };

  adestramento: {
    comandos: string[];
    observacoes: string;
  };

  falecimento?: {
    causa: string;
    data: string;
  };

  criadoEm: string;
  atualizadoEm?: string;
}