export interface Pokemon {
  id: number;
  name: string;
}

export interface PokemonCardProps {
  pokemon: Pokemon;
}

export interface PokemonListProps {
  pokemons: Pokemon[];
}

export interface FavoritesState {
  favorites: string[];
}
