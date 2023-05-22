import {MinusIcon, AddIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";

type Props = {
  minimized: () => void;
  getStatusMinimized: () => boolean;
} 

const Header = (props: Props) => {
  return (
    <Flex minHeight={"60px"} backgroundColor={"#805AD5"} borderTopRadius={"20px"} justify={"center"} cursor={"pointer"} onClick={() => props.minimized()}>
      <Flex flexDirection="column" mx="5" justify="center">
        <Text color={"white"} fontSize="larger" fontWeight="bold">
          CHAT
        </Text>
      </Flex>
      <Flex align={"center"} flexDirection={"row-reverse"}>
      {
          (props.getStatusMinimized() ? 
          <MinusIcon/> : 
          <AddIcon/> )
      }
      </Flex>
    </Flex>
  );
};

export default Header;
