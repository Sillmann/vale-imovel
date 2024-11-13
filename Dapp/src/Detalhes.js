import React, { useEffect, useState } from "react";
import { Box, Text, FlatList, Center, NativeBaseProvider } from "native-base";
import Web3 from "web3";
import ABI from "./ABI.json";
import { useParams } from "react-router-dom";

function Detalhes() {
  const { address } = useParams();
  const [compras, setCompras] = useState([]);
  const [message, setMessage] = useState("");
  const web3 = new Web3(window.ethereum);
  const contractAddress = "0x3eC0DC35Fd64c5357F637603A75EAcf1DDc8aF4a"; 
  const contract = new web3.eth.Contract(ABI, contractAddress);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const comprasList = await contract.methods.getCompras(address).call();
        console.log(comprasList);
        setCompras(comprasList);
      } catch (err) {
        setMessage("Erro ao buscar compras: " + err.message);
      }
    };

    fetchCompras();
  }, [address]);

  // Função para converter o timestamp Unix em uma data legível
  function formatDate(timestamp) {
    // const date = new Date(timestamp * 1000); // Converta para milissegundos
    const date = new Date(Number(timestamp) * 1000); // Multiplique por 1000 para obter milissegundos
 
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  return (


    <Box 
      safeArea 
      flex={1} 
      minHeight="100vh" 
      width="100%" 
      bg="black" 
      alignItems="center" 
      justifyContent="center"
    >

    <Center>
      <Text color="white" fontSize="lg" mb="4">
        Compras de VAI para o endereço: {address}
      </Text>
      <FlatList
        data={compras}
        renderItem={({ item }) => (
          <Box borderBottomWidth="1" borderColor="gray.600" py="2" width="80%">
            {/* console.log('item: ', item); */}
            {/* <Text color="white" fontSize="md">Compra: {item}</Text> */}
            <Text color="white" fontSize="md">Comprador: {item.comprador}</Text>
            <Text color="white" fontSize="md">Quantidade: {Number(item.amount) / 1e18} VAI</Text>
            <Text color="white" fontSize="md">Item: {item.item}</Text>
            <Text color="white" fontSize="md">Data da Compra: {formatDate(item.datacompra)}</Text>
          </Box>
        )}
        keyExtractor={(item, index) => index.toString()}
        width="100%"
      />
      {message && <Text color="red.500">{message}</Text>}
    </Center>

    </Box>

  );
}

export default Detalhes;
