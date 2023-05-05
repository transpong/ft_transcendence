import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import Header from "./Header";
import MessagesView from "./views/MessagesView/MessagesView";

type Props = {
  name: string;
  type: "group" | "individual";
  deleteChat: () => void;
};

const Chat = (props: Props) => {
  const [isMinimized, setMinimized] = useState(true);

  const minimize = () => setMinimized(!isMinimized);
  const getStatusMinimized = () => isMinimized;

  return (
    <Flex justify="end" backgroundColor={"white"} marginLeft={"2vh"} borderTopRadius={"30px"}>
      <Flex w={"17vw"} minWidth={"250px"} maxH={"50vh"} flexDir="column" borderTopRadius={"30px"}>
        <Header minimized={minimize} getStatusMinimized={getStatusMinimized} name={props.name} type={props.type} deleteChat={props.deleteChat}/>
        {isMinimized ? <MessagesView /> : null}
      </Flex>
    </Flex>
  );
};

export default Chat;