import { useEffect, useRef } from "react";
import { Avatar, Flex, Text } from "@chakra-ui/react";
interface msg  {
    from: string;
    text: string;
}

interface obj{
    messages: Array<msg>;
}

const Messages = ({messages} : obj) => {
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
      {messages.map((item, index) => {
        if (item.from === "me") {
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
                <Text wordBreak={"break-word"} overflowWrap={"break-word"}  fontSize={"smaller"}>{item.text}</Text>
              </Flex>
            </Flex>
          );
        } else {
          return (
            <Flex key={index} w="100%">
              <Avatar
                name="Computer"
                src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
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
              <Text  wordBreak={"break-word"} overflowWrap={"break-word"}  fontSize={"smaller"}>{item.text}</Text>
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
