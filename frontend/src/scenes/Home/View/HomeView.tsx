import { Flex } from '@chakra-ui/react'
import "./Home.css"
import NavBar from '../../../components/NavBar/NavBar';
import FriendsList from '../Components/FriendsList/FriendsList';
import { useState } from 'react';

export default function HomeView(){

  const [listChats, setListChats] = useState<React.ReactElement | null>(null);

  const addChatList = (newChat : React.ReactElement ) => {
    setListChats(newChat)
  }

  const deleteChatList = () => {
    setListChats(null);
  }
    return (
      <Flex className='MainBackground' h={"100vh"}>
          <NavBar></NavBar>
          <Flex h={"100vh"} flexDirection={"row-reverse"}>
            <Flex position={"fixed"} align={"end"} bottom={"0px"}>
              {listChats}
              <FriendsList addChat={addChatList} deleteChat={deleteChatList}/>
            </Flex>
            <Flex height={"100%"} width={"100vw"}>{/*inserir aqui os elementos das proximas telas*/}</Flex>
          </Flex>
      </Flex>
    );
}