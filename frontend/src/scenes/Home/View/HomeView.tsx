import { Flex } from "@chakra-ui/react";
// import NavBar from "../NavBar/NavBar";
import NavBar from "../../../components/NavBar/NavBar";
import FriendsList from "../../../components/FriendsList/FriendsList";
import { useState } from "react";
import './Home.css'
import { Outlet } from "react-router-dom";


export default function PageBase() {
  const [listChats, setListChats] = useState<React.ReactElement | null>(null);

  const addChatList = (newChat: React.ReactElement) => {
    setListChats(newChat);
  };

  const deleteChatList = () => {
    setListChats(null);
  };
  
  return (
    <Flex className="MainBackground" h={"100vh"}>
      <NavBar></NavBar>
      <Flex h={"85%"} flexDirection={"row-reverse"}>
        <Flex position={"fixed"} align={"end"} bottom={"0px"}>
          {listChats}
          <FriendsList addChat={addChatList} deleteChat={deleteChatList} />
        </Flex>
        <Flex className="MainView">
          <Outlet/>
        </Flex>
      </Flex>
    </Flex>
  );
}
