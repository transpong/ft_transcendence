import { useEffect, useRef } from "react";
import { Avatar, Flex, Text } from "@chakra-ui/react";
import { IApiDirectMessagesList } from "../../../../services/chat-service";
import { avatarUrl } from "../../../../helpers/avatar-url";


interface Props {
  messages: IApiDirectMessagesList;
}

const Messages = ({messages} : Props) => {
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef<HTMLInputElement>(null);
        useEffect(() => {
            if( elementRef.current)
            elementRef.current.scrollIntoView()
        });
        return <div ref={elementRef} />;
         };

  return (
    <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
      {messages.messages.map((item, index) => {
        if (item.am_i_sender) {
          return (
            <Flex key={index} w="100%" justify="flex-end">
              <Flex
                bg="#805AD5"
                color="white"
                minW="100px"
                maxW="350px"
                my="1"
                p="3"
                borderRadius={"10px"}
              >
                <Text wordBreak={"break-word"} overflowWrap={"break-word"}  fontSize={"smaller"}>{item.message_text}</Text>
              </Flex>
            </Flex>
          );
        } else {
          return (
            <Flex key={index} w="100%">
              <Avatar
                name={messages.user.nickname}
                src={avatarUrl(messages.user.avatar)}
                bg="blue.300"
              ></Avatar>
              <Flex
                bg="gray.100"
                color="black"
                minW="100px"
                maxW="350px"
                my="1"
                p="3"
                borderRadius={"10px"}
              >
              <Text  wordBreak={"break-word"} overflowWrap={"break-word"}  fontSize={"smaller"}>{item.message_text}</Text>
              </Flex>
            </Flex>
          );
        }
      })}
      <AlwaysScrollToBottom />
    </Flex>
  );
};

export default Messages;
