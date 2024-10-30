export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonDetails {
  sprites: {
    front_default: string | null;
  };
  types: PokemonType[];
}

export interface Pokemon {
  name: string;
  url: string;
  sprite?: string | null;
  typeNames?: string[];
}

export interface TypeResponse {
  name: string;
  pokemon: PokemonTypeResponse[];
}

export interface PokemonTypeResponse {
  slot: number;
  pokemon: Pokemon;
}

export interface TypeResult {
  name: string;
  url: string;
}

export interface TypesApiResponse {
  count: number;
  results: TypeResult[];
}
