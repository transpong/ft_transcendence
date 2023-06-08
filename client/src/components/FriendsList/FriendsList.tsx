import { Flex } from "@chakra-ui/react";
import { Fragment, useMemo, useState } from "react";
import { Socket } from "socket.io-client";
import { chatService, IChatList } from "../../services/chat-service";
import Divider from "./Divider";
import Header from "./Header";
import List from "./List";
import NewGroupInput from "./NewGroupInput";

type Props = {
  addChat: (chat: React.ReactElement) => void;
  deleteChat: () => void;
  socketGame?: Socket | null;
};

const FriendsList = (props: Props) => {
  const [isMinimized, setMinimized] = useState(false);
  const [chats, setChats] = useState<IChatList>()


  const minimize = () => setMinimized(!isMinimized);
  const getStatusMinimized = () => isMinimized;

  useMemo(async () => {
    try {
      const chatList = await chatService.getChats()
      setChats(chatList);
    } catch {}
  }, [])

  return (
    <Flex justify="end" backgroundColor={"white"} marginLeft={"2vh"} borderTopRadius={"30px"}>
      <Flex minWidth={"250px"} w={"15vw"} maxH={"80vh"} flexDir="column" borderTopRadius={"30px"}>
        <Header  minimized={minimize} getStatusMinimized={getStatusMinimized}/>
          {isMinimized ? (
            <Fragment>
            <NewGroupInput />
            {chats && <List list={chats} addChat={props.addChat} deleteChat={props.deleteChat} socketGame={props.socketGame}/>}
            <Divider />
            </Fragment>
          ): null}
      </Flex>
    </Flex>
  );
};

export default FriendsList;