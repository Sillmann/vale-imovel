// ItemList.js
import React, { useState } from 'react';
import { Box, Text, Center, FlatList } from 'native-base';
import { Link } from 'react-router-dom';

const ItemList = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null); // Mantém o estado de hover para cada item

  return (
    <FlatList
      data={items}
      renderItem={({ item, index }) => (
        <Center>
          <Box borderBottomWidth="1" borderColor="gray.600" py="2" width="40%">
            <Link to={`/detalhes/${item}`} style={{textDecoration: 'none'}}>
              <Text
                color="teal.300"
                fontSize={hoveredIndex === index ? "lg" : "md"} // Ajusta o tamanho quando o item está em hover
                onMouseEnter={() => setHoveredIndex(index)} // Define o índice do item que está em hover
                onMouseLeave={() => setHoveredIndex(null)}  // Restaura ao sair do hover
                transition="font-size 0.8s ease-in-out" // Adiciona uma transição suave
              >
                {item}
              </Text>
            </Link>
          </Box>
        </Center>
      )}
      keyExtractor={(item, index) => index.toString()}
      width="100%"
      mt="4"
      mb="16"
    />
  );
};

export default ItemList;
