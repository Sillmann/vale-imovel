import React from 'react';
import {Box, Text, Button, Center, VStack, HStack, NativeBaseProvider } from 'native-base';
import { useNavigate } from 'react-router-dom';

function Instrucoes() {

  const navigate = useNavigate();

  return (
    
    <>
      <Box 
            safeArea 
            flex={1} 
            minHeight="100vh" 
            width="100%" 
            bg="black" 
            alignItems="center" 
            justifyContent="center"
        >

        <Text color="white" fontSize="xl" mb="4" textAlign="center" >Instruções sobre a Tokenização de Imóvel</Text>

        <Text color="white" fontSize="md" mb="4" >
          Este projeto exemplifica a tokenização de um imóvel, dividindo-o em 10 partes iguais chamadas VAI-Vale-Imovel.
        </Text>

        <Text color="white" fontSize="md" mb="4">
          Cada token VAI representa 10% do imóvel. 
        </Text>
    
        <Text color="white" fontSize="md" mb="4">
          Para adquirir 1 VAI, você precisa trocá-lo por 1 LINK da rede Sepolia Testnet.
        </Text>

        <Text color="white" fontSize="xl" mb="4" mt="12" textAlign="center">
          O que é Faucet ? 
        </Text>

        <Text color="white" fontSize="md" mb="4">
          Faucets são serviços que distribuem tokens gratuitos para você testar a rede.
        </Text>
        
        <Text color="white" fontSize="md" mb="4">
           Todas as transações aqui são feitas com tokens obtidos via faucet.
        </Text> 

        <Center>
          <Button colorScheme="teal" w="40" onPress={() => navigate(-1)}>Voltar</Button> 
        </Center>

      </Box>

      

    </>
    
  );
}

export default Instrucoes;  