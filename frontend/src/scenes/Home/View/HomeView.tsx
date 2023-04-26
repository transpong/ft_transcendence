import { Flex } from '@chakra-ui/react'
import "./Home.css"
import NavBar from '../../../components/NavBar/NavBar';

export default function HomeView(){

    return (
      <Flex className='HomeBackground' h={"100vh"}>
          <NavBar></NavBar>
      </Flex>
    );
}