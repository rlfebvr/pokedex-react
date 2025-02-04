import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "./pages/Layout";


const router = createBrowserRouter([
  {
    path:"/",
    element:<Layout/>,
    loader: async () => {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1025");
      const data = await response.json();
      const pokemonData = data.results.map((pokemon, index) => ({
        index: index + 1,  
        name: pokemon.name,
          url: pokemon.url
      }));
        return pokemonData;
    },
    children:[
      {
    
          path:"pokemon/:id",
          element:null,
      }
    ]
  },
  {
    path:"pokemon:pokemonID",
    element:<Layout />
  }


])

function App() {
    return (
    <RouterProvider
      router={router}
    ></RouterProvider>

    )
}

export default App