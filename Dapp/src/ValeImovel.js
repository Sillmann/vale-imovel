import React, { useState, useEffect } from 'react';
import { Button, Box, Text, VStack, HStack, Divider, FlatList, Center, Image  } from 'native-base';
import Web3 from "web3";
import ABI from "./ABI.json";
import ABI_LINK from './ABI_LINK.json'; // ABI do contrato LINK
import { useNavigate } from 'react-router-dom';
// import { Link } from "react-router-dom";
import ItemList from './ItemList';

function ValeImovel() {

  const [message, setMessage] = useState('');
  const [account, setAccount] = useState('');
  const web3 = new Web3(window.ethereum);

  // Endereço do contrato ValeImovel na Sepolia
  const contractAddress = "0x3eC0DC35Fd64c5357F637603A75EAcf1DDc8aF4a"; 

  // Endereço do dono do contrato ValeImovel na Sepolia
  const contractOwner = "0x1b69be7141228ad3D2D0977F03AE5043a989C1cD";

  // Endereço do contrato LINK na Sepolia
  const LINK_ADDRESS = '0x779877A7B0D9E8603169DdbD7836e478b4624789';

  const contract = new web3.eth.Contract(ABI, contractAddress);
  const [compradores, setCompradores] = useState([]);

  // Auxiliares para a formatacao de valores
  const [totalSupply, setTotalSupply] = useState(null); 
  const [contractBalance, setContractBalance] = useState(null); 
  const [totalDisponivel, setTotalDisponivel] = useState(null); 

  // const [isHovered, setIsHovered] = useState(false);

  const [compraFinalizada, setcompraFinalizada] = useState(false);

  const DECIMALS = 18;

  const navigate = useNavigate();

  async function btnLoginClick() {

    try {
    
      const account = await doLogin();
    
      setAccount(account);

    } catch (err) {
        
      setMessage(err.message); 
    }

  }

  async function doLogin() {

    if (!window.ethereum) throw new Error(`MetaMask não está instalada!`);
    
    const accounts = await web3.eth.requestAccounts();
  
    if (!accounts || !accounts.length) throw new Error(`MetaMask não foi autorizada!`);
  
    localStorage.setItem("wallet", accounts[0]);
    
    return accounts[0];

  }

  async function buyTokens() {

    if (!window.ethereum) throw new Error(`MetaMask não está instalada!`);
    
    // Certificar de que está passando o endereço correto
    if (!account) {
      setMessage("Endereço não encontrado");
      return;
    }

    try {

      setcompraFinalizada(false);

      // Conecte-se ao contrato LINK
      const linkContract = new web3.eth.Contract(ABI_LINK, LINK_ADDRESS);

      // Quantidade a ser aprovada (1 LINK em unidades de wei)
      const amountToApprove = '1000000000000000000';

      // Fazer o approve para o contrato `ValeImovell` gastar o LINK
      await linkContract.methods.approve(contractAddress, amountToApprove).send({ from: account });

      const tx = await contract.methods.comprarImovel(account).send({ from: account });
      setMessage("Compra efetuada com sucesso!");

      setcompraFinalizada(true);

    } catch (err) {
      setMessage("Erro na transação: " + err.message);
    }


  }

  async function fetchCompradores() {
    try {
      const compradoresList = await contract.methods.getAllCompradores().call();
      setCompradores(compradoresList);
    } catch (err) {
      setMessage("Erro ao buscar compradores: " + err.message);
    }
  }

  async function fetchContractData() {
    try {

      // Buscar o totalSupply do contrato
      const totalSupplyValue = await contract.methods.totalSupply().call();
      
      // Ajusta para os decimais do contrato
      const formattedTotalSupply = parseFloat(totalSupplyValue) / (10 ** DECIMALS);
      setTotalSupply(formattedTotalSupply);

      // Buscar o balanceOf do contrato
      const totalBalanceValue = await contract.methods.balanceOf(contractOwner).call();
     
      // Ajusta para os decimais do contrato
      const formattedBalanceValue = parseFloat(totalBalanceValue) / (10 ** DECIMALS);
      setContractBalance(formattedBalanceValue);

      // Calcula o saldo disponivel no contrato
      setTotalDisponivel(formattedTotalSupply - formattedBalanceValue);

      // Atualizar a lista de compradores
      fetchCompradores();

    } catch (err) {
      setMessage("Erro ao buscar dados do contrato: " + err.message);
    }
  }


  useEffect(() => {

    fetchContractData();  // Busca dados do contrato ao montar o componente

  }, []);

 
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

            <Center my="4">
              <Image
                source={{ uri: '/vai.jpg' }}
                alt="Simbolo do Vale-Imovel"
                size="20vh"
                resizeMode="contain"
              />
            </Center>

            <Text color="white" fontSize="lg" mb="4">VALE-IMOVEL</Text>
            
            {!account && (
            <Button colorScheme="teal" mb="4" w="40" onPress={btnLoginClick}>
                Conectar MetaMask
            </Button>
            )}


            {account && (
                <Text color="white" fontSize="md">
                    {account}
                </Text>
            )}

            
            <Center my="4">
            <HStack space={4} justifyContent="center">
              <Image
                source={{ uri: '/predio1.jpg' }}
                alt="Imagem de um Prédio"
                size="50vh"
                resizeMode="contain"
              />
              <Image
                source={{ uri: '/predio2.jpg' }}
                alt="Imagem de um Prédio"
                size="50vh"
                resizeMode="contain"
              />
              <Image
                source={{ uri: '/predio3.jpg' }}
                alt="Imagem de um Prédio"
                size="50vh"
                resizeMode="contain"
              />
            </HStack>
            </Center>

            <VStack space={4}>
                
                <Center>

                <Button 
                  colorScheme="teal" 
                  mt="4" 
                  onPress={() => navigate("/instrucoes")}
                >
                  Instruções
                </Button>

                <Button colorScheme="teal" w="40" mt="4" onPress={buyTokens}>
                    Comprar 1 VAI
                </Button>


                <Text color="white" fontSize="md">
                {message}
                </Text> 


                <Center my="4">
        
                {compraFinalizada && (
                    <Image
                      source={{ uri: '/contrato1vai.jpg' }}
                      alt="Imagem de um Prédio"
                      size="50vh"
                      resizeMode="contain"
                    />
                )}

                </Center>

                <VStack space={4} alignItems="flex-start" width="110%"  mt="6">
                  <HStack width="100%" justifyContent="space-between">
                    <Text color="white" fontSize="md">
                      Total de VAI Emitido:
                    </Text>
                    <Text color="white" fontSize="lg">
                      {totalSupply !== null ? totalSupply.toFixed(0) : 'Carregando...'}
                    </Text>
                  </HStack>

                  <HStack width="100%" justifyContent="space-between">
                    <Text color="white" fontSize="md">
                      Total de VAI Comprado:
                    </Text>
                    <Text color="white" fontSize="lg">
                      {contractBalance !== null ? contractBalance.toFixed(0) : 'Carregando...'}
                    </Text>
                  </HStack>

                  <HStack width="100%" justifyContent="space-between">
                    <Text color="white" fontSize="md">
                      Total de VAI Disponivel:
                    </Text>
                    <Text color="white" fontSize="lg">
                      {totalDisponivel !== null ? totalDisponivel.toFixed(0) : 'Carregando...'}
                    </Text>
                  </HStack>
                </VStack>

                

                </Center>
                
            </VStack>

            <Divider mt="8" w="80%" />

            <Text color="white" fontSize="lg" mt="6">Lista de Compradores</Text>

            <ItemList items={compradores} />

            {/* <FlatList 
                data={compradores}
                renderItem={({ item }) => (
                  <Center>

                    <Box borderBottomWidth="1" borderColor="gray.600" py="2" width="40%">

                    

                    <Link to={`/detalhes/${item}`}>
                      <Text 
                        color="teal.300" 
                        fontSize={isHovered ? "lg" : "md"} // Aumenta o tamanho quando hovered
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        // transition="" // Adiciona uma transição suave
                      >{item}</Text>
                    </Link>

                        // <Text color="white" fontSize="md">{item}</Text> 
                    </Box>

                  </Center>
                )}
                keyExtractor={(item, index) => index.toString()}
                width="100%"
                mt="4"
                mb="16"
            /> */}

            

        </Box>

);
}

export default ValeImovel;  
