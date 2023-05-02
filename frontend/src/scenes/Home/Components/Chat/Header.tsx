import {MinusIcon, AddIcon, CloseIcon } from "@chakra-ui/icons";
import { Flex, Avatar, AvatarBadge, Text } from "@chakra-ui/react";

type Props = {
  minimized: () => void;
  getStatusMinimized: () => boolean;
  name: string;
  deleteChat: () => void;
}

const Header = (props: Props) => {
  return (
    <Flex h={"8vh"} backgroundColor={"#805AD5"} padding={"1vh"} borderTopRadius={"20px"}>
      <Flex w={"85%"}>
      <Avatar size="md" name={props.name}>
        <AvatarBadge boxSize="1.25em" bg="green.500" />
      </Avatar>
      <Flex flexDirection="column" mx="5" justify="center">
        <Text color={"white"} fontSize="sm" fontWeight="bold">
          {props.name}
        </Text>
        <Text fontSize={"small"} color="green.500" fontWeight={"extrabold"}>Online</Text>
      </Flex>
      </Flex>
      <Flex align={"start"}>
        {
          (props.getStatusMinimized() ? 
          <MinusIcon  cursor={"pointer"} onClick={() => props.minimized()}/> : 
          <AddIcon cursor={"pointer"} onClick={() => props.minimized()}/> )
        }
        <CloseIcon marginLeft={"1vw"} cursor={"pointer"} onClick={() => props.deleteChat()}/>
      </Flex>
    </Flex>
  );
};

export default Header;
