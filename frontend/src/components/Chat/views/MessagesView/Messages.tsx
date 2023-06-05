import { useEffect, useRef } from "react";
import { Avatar, Flex, Text } from "@chakra-ui/react";
import { IApiSender, IMessage } from "../../../../services/chat-service";
import { avatarUrl } from "../../../../helpers/avatar-url";
import { useNavigate } from "react-router";


interface Props {
  messages: IMessage[];
  sender?: IApiSender;
}

const Messages = ({messages, sender} : Props) => {
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef<HTMLInputElement>(null);
        useEffect(() => {
            if( elementRef.current)
            elementRef.current.scrollIntoView()
        });
        return <div ref={elementRef} />;
         };

  const navigate = useNavigate();

  return (
    <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
      {messages.map((item, index) => {
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
                name={sender?.nickname || item.sender?.nickname}
                src={avatarUrl(sender?.avatar || item.sender?.avatar)}
                bg="blue.300"
                onClick={() => navigate(`/home/profile/${sender?.nickname || item.sender?.nickname}`)}
                cursor="pointer"
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
