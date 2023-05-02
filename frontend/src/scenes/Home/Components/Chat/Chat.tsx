import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import Divider from "./Divider";
import Footer from "./Footer";
import Header from "./Header";
import Messages from "./Messages";

type Props =  {
  name: string;
  deleteChat: () => void;
}

const Chat = (props: Props) => {
  const [messages, setMessages] = useState<Array<{from: string, text: string}>>([
    { from: "computer", text: "Hi, My Name is HoneyChat" },
    { from: "me", text: "Hey there" },
    { from: "me", text: "Myself"},
    {
      from: "computer",
      text:
        "Nice to meet you. You can send me message and i'll reply you with same message."
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isMinimized, setMinimized] = useState(true);

  const minimize = () => setMinimized(!isMinimized);
  const getStatusMinimized = () => isMinimized;

  const handleSendMessage = () => {
    if (!inputMessage.trim().length) {
      return;
    }
    const data = inputMessage;

    setMessages((old) => [...old, { from: "me", text: data }]);
    setInputMessage("");

    setTimeout(() => {
      setMessages((old) => [...old, { from: "computer", text: data }]);
    }, 1000);
  };

  return (
    <Flex justify="end" backgroundColor={"white"} marginLeft={"2vh"} borderTopRadius={"30px"}>
      <Flex w={"17vw"} minWidth={"250px"} maxH={"50vh"} flexDir="column" borderTopRadius={"30px"}>
        <Header minimized={minimize} getStatusMinimized={getStatusMinimized} name={props.name} deleteChat={props.deleteChat}/>
        {isMinimized ? (
        <React.Fragment>
          <Messages messages={messages} />
          <Divider />
          <Footer
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
          />
        </React.Fragment>) : null}
      </Flex>
    </Flex>
  );
};

export default Chat;