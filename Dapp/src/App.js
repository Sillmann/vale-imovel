import React from "react";
import { NativeBaseProvider } from "native-base";
import ValeImovel from './ValeImovel';
import Instrucoes from './Instrucoes';
import Detalhes from './Detalhes';
import { BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
    return (
    <NativeBaseProvider>

      <AppContainer />
      
    </NativeBaseProvider>
  );
}

function AppContainer() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<ValeImovel />} />
        <Route path="/instrucoes" element={<Instrucoes />} />
        <Route path="/detalhes/:address" element={<Detalhes />} />
      </Routes>
   </BrowserRouter>
    
  );
}

export default App;