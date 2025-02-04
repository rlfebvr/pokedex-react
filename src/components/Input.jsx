import { useEffect, useState } from "react";
import submitBall from '../asset/submitBall.png';
import submitBallHover from '../asset/submitBallHover.png';
import pokheader from '../asset/pokheader.png'
import { useNavigate } from "react-router-dom";

function SearchInput(props) {  
    let pokemonList = props.pokemonList;
    const [inputValue, setInputValue] = useState("");
    const [buttonImage, setButtonImage] = useState(submitBall);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const navigate = useNavigate();

    function handleSelectPokemon() {
        const selectedPokemon = pokemonList.find(
            (pokemon) => pokemon.name.toLowerCase() === inputValue.toLowerCase()
        );
        if (selectedPokemon) {
            navigate(`/pokemon/${selectedPokemon.index}`);
        }
    }

    function handleMouseEnter() {
        setButtonImage(submitBallHover);  
    }
    function handleMouseLeave() {
        setButtonImage(submitBall);
    }

    useEffect(() => {
        if (inputValue.trim() === "" || pokemonList.find((pokemon) => pokemon.name.toLowerCase() === inputValue.toLowerCase()
        )) {
            setFilteredPokemon([]);
            return;
        }
        const results = pokemonList
            .filter(pokemon => 
                pokemon.name.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 5);
        setFilteredPokemon(results);
    }, [inputValue])

    return (
        <div className="input-div">
            <div id="left">
                
            </div>
            <div id="middle">
                <h1>Pokemon</h1>
                <div id="search">
                    <input 
                        type="text" 
                        id="todo" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)} 
                        name="todo" 
                        placeholder="Gotta catch 'em all..."
                        list="pokemon-options"
                    />
                    <datalist id="pokemon-options">
                        {filteredPokemon.map((pokemon) => (
                            <option key={pokemon.index} value={pokemon.name} />
                        ))}
                    </datalist>
                    <br />
                    <button 
                        onClick={handleSelectPokemon} 
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <img src={buttonImage} alt="Submit" />
                    </button>
                </div>
            </div>
            <div id="right">
                <img src={pokheader} />
            </div>
        </div>
    );
}

export default SearchInput;
