import { Flex } from "@chakra-ui/react";
import NavBar from "../NavBar/NavBar";
import FriendsList from "../../scenes/Home/Components/FriendsList/FriendsList";
import { useState } from "react";
import './PageBase.css'

interface Props {
  PageElement: JSX.Element
}

export default function PageBase(props: Props) {
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
      <Flex h={"100vh"} flexDirection={"row-reverse"}>
        <Flex position={"fixed"} align={"end"} bottom={"0px"}>
          {listChats}
          <FriendsList addChat={addChatList} deleteChat={deleteChatList} />
        </Flex>
        <Flex className="MainView">
          {props.PageElement}
        </Flex>
      </Flex>
    </Flex>
  );
}
