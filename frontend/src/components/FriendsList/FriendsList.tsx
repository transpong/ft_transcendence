import { Flex } from "@chakra-ui/react";
import { Fragment, useMemo, useState } from "react";
import { chatService, IChatList } from "../../services/chat-service";
import Divider from "./Divider";
import Header from "./Header";
import List from "./List";

type Props = {
  addChat: (chat : React.ReactElement) => void;
  deleteChat: () => void;
}

const FriendsList = (props: Props) => {
  const [isMinimized, setMinimized] = useState(false);
  const [chats, setChats] = useState<IChatList>()


  const minimize = () => setMinimized(!isMinimized);
  const getStatusMinimized = () => isMinimized;

  useMemo(async () => {
    const chatList = await chatService.getChats()
    setChats(chatList);
  }, [])

  return (
    <Flex justify="end" backgroundColor={"white"} marginLeft={"2vh"} borderTopRadius={"30px"}>
      <Flex minWidth={"250px"} w={"15vw"} maxH={"80vh"} flexDir="column" borderTopRadius={"30px"}>
        <Header  minimized={minimize} getStatusMinimized={getStatusMinimized}/>
        {isMinimized ? (
          <Fragment>
          {chats && <List list={chats} addChat={props.addChat} deleteChat={props.deleteChat}/>}
          <Divider />
          </Fragment>
        ): null}
      </Flex>
    </Flex>
  );
};

export default FriendsList;