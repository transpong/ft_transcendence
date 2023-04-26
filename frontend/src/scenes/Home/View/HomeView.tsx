import { Button, Flex, HStack, Image, Stack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import "./Home.css"
import NavBar from '../../../components/NavBar/NavBar';

export default function HomeView(){

    return (
      <Flex className='HomeBackground' h={"100vh"}>
        <HStack>
          <NavBar></NavBar>
        </HStack>
      </Flex>
    );
}