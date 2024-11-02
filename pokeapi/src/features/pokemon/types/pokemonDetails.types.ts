export interface Move {
  move: { name: string };
}

export interface PokemonDetails {
  name: string;
  weight: number;
  height: number;
  abilities: { ability: { name: string } }[];
  sprites: {
    front_default: string;
  };
  base_experience: number;
  moves: Move[];
}
