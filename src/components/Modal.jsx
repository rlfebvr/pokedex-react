import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import shinyImg from '../asset/shiny.png';

export default function Modal() {
  const { id: pokemonID } = useParams();
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState({});
  const [pokemon, setPokemon] = useState(null);

  function cryUrl(pokemonID) {
    return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonID}.ogg`;
  }

  function imgUrl(pokemonID) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png`;
  }

  function shinyImgUrl(pokemonID) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemonID}.png`;
  }

  const toggleImage = (pokemonID) => {
    setCurrentImage((prevState) => ({
      ...prevState,
      [pokemonID]:
        prevState[pokemonID] === shinyImgUrl(pokemonID)
          ? imgUrl(pokemonID)
          : shinyImgUrl(pokemonID),
    }));
  };

  const pokemonTypes = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };

  const getTypeStyle = (types) => {
    const typeColors = types.map((t) => pokemonTypes[t.type.name]);
    return typeColors.length === 1
      ? { background: `radial-gradient(circle, #fff, ${typeColors[0]} )` }
      : { background: `radial-gradient(circle, ${typeColors.join(", ")})` };
  };

  useEffect(() => {
    const asyncFetch = async () => {
      try {
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
        const pokemonData = await pokemonResponse.json();

        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonID}`);
        const speciesData = await speciesResponse.json();

        const encountersResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}/encounters`);
        const encountersData = await encountersResponse.json();

        setPokemon({
          ...pokemonData,
          description:
            speciesData.flavor_text_entries.find((entry) => entry.language.name === 'en')?.flavor_text ||
            'No description available.',
          location_area_encounters: encountersData
            .map((encounter) => encounter.location_area.name)
            .join(', ') || 'No locations available.',
        });
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };

    if (pokemonID) asyncFetch();
    return () => {
      setPokemon(null);
    };
  }, [pokemonID]);

  const handleOnClose = () => {
    navigate('/');
  };

  return (
    <>
      {pokemon && (
        <div className="modal">
          <button onClick={handleOnClose}>❌</button>
          <div className="modal-content">
            <div id="content" style={getTypeStyle(pokemon.types)}>
              <div id="upperData">
                <div id="data">
                  <h2>
                    Pokemon <img id="imgOne" src={shinyImg} onClick={() => toggleImage(pokemon.id)} />
                  </h2>
                  <p>
                    <strong>Name </strong>
                    {pokemon.name.toUpperCase()}
                  </p>
                  <p>
                    <strong>Weight </strong>
                    {pokemon.weight / 10} kg
                  </p>
                  <p>
                    <strong>Height </strong>
                    {pokemon.height / 10} m
                  </p>
                  <audio controls>
                    <source src={cryUrl(pokemon.id)} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <img id="imgTwo" src={currentImage[pokemon.id] || imgUrl(pokemon.id)} alt={pokemon.name} />
              </div>
              <div id="desc">
                <div id='description'>
                  <strong>Description: </strong>
                  {pokemon.description}
                </div>
                <div id='locations'>
                  <strong>Locations</strong><br/>
                  {pokemon.location_area_encounters}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
