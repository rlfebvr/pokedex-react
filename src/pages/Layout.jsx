import { useNavigate, useLoaderData } from "react-router-dom";
import Input from "../components/Input"

import { useState, useLayoutEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import shinyImg from '../asset/shiny.png';
import Modal from "../components/Modal";

const Layout = () => {
  const pokemonList = useLoaderData();

  const navigate = useNavigate();
  const toLoad = 10;
  const [display, setDisplay] = useState([])
  const [row, setRow] = useState(toLoad)
  const [last, setLast] = useState(0)
  const [currentImage, setCurrentImage] = useState({}); 
  
  useLayoutEffect(() => {
    const asyncLoad = async ()=> {
      const toDisplay = pokemonList.slice(0, toLoad+row)
                                   .map((pokemon) => fetch(pokemon.url)
                                   .then(response => response.json()))
      const syncToDisplay = await Promise.all(toDisplay)
      setDisplay(syncToDisplay)
    }
    asyncLoad();
       },[pokemonList])
 
 
   const fetchData = async () => {

     const asyncLoad = async ()=> {
      let checkMax = row + toLoad *2;
      if (checkMax > pokemonList.length)
        checkMax = pokemonList.length
      setLast(checkMax)
       const toNextLine = pokemonList.slice(row + toLoad, checkMax)
       .map((pokemon) =>fetch(pokemon.url).then(response => response.json()))
     
     const syncToNextLine = await Promise.all(toNextLine)
     return syncToNextLine
   }
   let stock=[]
   if(display.slice(-1)[0].id < pokemonList.length){
    stock = await asyncLoad()
   }
   setRow(row + toLoad)
   setDisplay((display) => [...display, ...stock])
     return display;
   }
 
   function imgUrl(pokemonID){
     return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png`
   }
 
   function shinyImgUrl(pokemonID) {
     return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemonID}.png`
   }
 
   const toggleImage = (pokemonID) => {
     setCurrentImage((prevState) => ({
       ...prevState,
       [pokemonID]: prevState[pokemonID] === shinyImgUrl(pokemonID)
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
     fairy: "#D685AD"
   };
 
   const getTypeStyle = (types) => {
     const typeColors = types.map((t) => pokemonTypes[t.type.name]);
     return typeColors.length === 1
       ? { background: `radial-gradient(circle, #fff, ${typeColors[0]} )`}
       : { background: `radial-gradient(circle, ${typeColors.join(", ")})`};
   };
 
   const getTypeColor = (type) => {
     return {
       backgroundColor: pokemonTypes[type], // Couleur associée au type
     };
   };
   const viewPokemon = (pokemon) => {
     const id = pokemon.id;
     navigate('/pokemon/' + id);
   };

  return (
    <>
      <Input pokemonList={pokemonList}/>
      
      <div className="display">
            <InfiniteScroll
              dataLength={display.length}
              next={fetchData}
              hasMore={last < pokemonList.length} // Condition pour arrêter le scroll infini
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>Time to catch them all !!!</b>
                </p>
              }
              className="display-grid"
            >
              {display.map((pokemon) => (
                <div key={pokemon.id}  >
                  <img id='imgOne' src={shinyImg} onClick={() => toggleImage(pokemon.id)}/>
                  <img id='imgTwo' onClick={() => viewPokemon(pokemon)} src={currentImage[pokemon.id] || imgUrl(pokemon.id)} alt={pokemon.name} style={
                    getTypeStyle(pokemon.types)
                  }></img>
                  <p onClick={() => viewPokemon(pokemon)}>  {pokemon.name.toUpperCase()}</p>
                  <div id="types" onClick={() => viewPokemon(pokemon)}>
                    {pokemon.types.map((typeObj, index) => (
                      <p key={index} style={getTypeColor(typeObj.type.name)}>
                        {typeObj.type.name}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          </div>

      <Modal />
    </>
  )
};

export default Layout;