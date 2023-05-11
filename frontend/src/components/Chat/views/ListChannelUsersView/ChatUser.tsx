import { Button, Flex, Text, Avatar } from "@chakra-ui/react";
import { IUser } from "./ListChannelUsersView";

interface Props {
  user: IUser;
  user_access_type?: number;
}


const ChatUser = ({ user , user_access_type }: Props) => {

  return (
    <Flex
      h="55px"
      backgroundColor="white"
      borderRadius="10px"
      border="1px solid"
      margin="4px 0px"
      align="center"
      key={user.id}
      padding="1"
    >
      <Avatar src={user.avatar} maxWidth="25%" />
      <Text ml="3" fontWeight="bold" w="40%">
        {user.nickname}
      </Text>
      {
        user_access_type != user.user_access_type && (user_access_type == 3 || (user_access_type == 2 && user.user_access_type != 3))?
        <>
          {
            user.user_access_type == 1 ?
            <Button color="white" backgroundColor="purple" opacity="90%" fontSize="9" w="20%" minW="0" padding="0" mr="4px" wordBreak="break-word" whiteSpace="normal">
              Tornar Admin
            </Button>
            :
            <Button color="white" backgroundColor="purple" opacity="90%" fontSize="9" w="20%" minW="0" padding="0" mr="4px" wordBreak="break-word" whiteSpace="normal">
              Remover Admin
            </Button>
          }
          <Flex h="100%" w="15%" flexDirection="column">
            <Button color="white" backgroundColor="purple" opacity="90%" h="100%" w="100%" fontSize="8" minW="0">{user.kicked_at ? "Unkick" : "Kick"}</Button>
            <Button color="white" backgroundColor="purple" opacity="90%" h="100%" w="100%" fontSize="8" minW="0">{user.banned_at ? "Unban" : "Ban"}</Button>
            <Button color="white" backgroundColor="purple" opacity="90%" h="100%" w="100%" fontSize="8" minW="0">{user.muted_until ? "Unmute" : "Mute"}</Button>
          </Flex>
        </>
        : null
      }
    </Flex>
  );
};

export default ChatUser;
