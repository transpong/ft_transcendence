import {MinusIcon, AddIcon, CloseIcon } from "@chakra-ui/icons";
import { Flex, Avatar, AvatarBadge, Text } from "@chakra-ui/react";
import { ScreensObject } from "./Chat";
import HeaderNavgation from "./HeaderNavigation";

type Props = {
  minimized: () => void;
  getStatusMinimized: () => boolean;
  name: string;
  type: "group" | "individual";
  deleteChat: () => void;
  screenNavigation: number;
  setScreenNavigation: React.Dispatch<
    React.SetStateAction<keyof ScreensObject>
  >;
};

const Header = (props: Props) => {
  return (
    <Flex paddingBottom={"10px"} paddingTop={"1px"} backgroundColor={"#805AD5"} borderTopRadius={"20px"} justifyContent="space-between">
      <Flex w={"60%"}>
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
      <Flex align={"center"} >
        <HeaderNavgation type={props.type} screenNavigation={props.screenNavigation} setScreenNavigation={props.setScreenNavigation} />
        {
          (props.getStatusMinimized() ?
          <MinusIcon  cursor={"pointer"} onClick={() => props.minimized()}/> :
          <AddIcon cursor={"pointer"} onClick={() => props.minimized()}/> )
        }
        <CloseIcon marginLeft={"10px"} marginRight={"10px"}cursor={"pointer"} onClick={() => props.deleteChat()}/>
      </Flex>
    </Flex>
  );
};

export default Header;
