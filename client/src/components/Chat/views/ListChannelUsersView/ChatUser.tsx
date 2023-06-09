import { Button, Flex, Text, Avatar } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import { useNavigate } from "react-router";
import { avatarUrl } from "../../../../helpers/avatar-url";
import { chatService, IApiChannelUsers, IChannelChat, UserAccessRestrictions, UserAccessType } from "../../../../services/chat-service";
import { ScreensObject } from "../../Chat";
import { FaCrown } from "react-icons/fa";

interface Props {
  user: IApiChannelUsers;
  user_access_type?: number;
  channelInfo?: IChannelChat;
  setScreenNavigation: React.Dispatch<
    React.SetStateAction<keyof ScreensObject>
  >;
  updateUsers: () => Promise<void>;
}


const ChatUser = ({ user , user_access_type, channelInfo, setScreenNavigation }: Props) => {
  const navigate = useNavigate();

  const handleUserType = async (nickname: string, type: UserAccessType) => {
    if (channelInfo) {
      const isValid = await chatService.updateUserChannelType(channelInfo.id, nickname, type);
      if (isValid) setScreenNavigation(2);
    }
  };

  const handleUserRestrictions = async (nickname: string, restriction: UserAccessRestrictions) => {
    if (channelInfo) {
      if (restriction === UserAccessRestrictions.KICK)
        await chatService.removeUserFromChannel(channelInfo.id, nickname);
      else
        await chatService.updateUserChannelRestrictions(channelInfo.id, nickname, restriction);
      setScreenNavigation(2);
    }
  };

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
      <Avatar src={avatarUrl(user.avatar)} maxWidth="25%" onClick={() => navigate(`/home/profile/${user.nickname}`)} cursor="pointer"/>
      <Text ml="3" fontWeight="bold" w="40%" onClick={() => navigate(`/home/profile/${user.nickname}`)} cursor="pointer">
        {user.nickname}
      </Text>
      {
        (user.user_access_type == UserAccessType.OWNER) && <Icon  as={FaCrown} color="yellow" boxSize="2em" />
      }
      {
        user_access_type != user.user_access_type && (user_access_type == UserAccessType.OWNER || (user_access_type == UserAccessType.ADMIN && user.user_access_type != UserAccessType.OWNER )) ?
        <>
          {
            user.user_access_type == UserAccessType.MEMBER ?
            <Button color="white" backgroundColor="purple" opacity="90%" fontSize="9" w="20%" minW="0" padding="0" mr="4px" wordBreak="break-word" whiteSpace="normal"
              onClick={() => handleUserType(user.nickname, UserAccessType.ADMIN)}>
              Tornar Admin
            </Button>
            :
            <Button color="white" backgroundColor="purple" opacity="90%" fontSize="9" w="20%" minW="0" padding="0" mr="4px" wordBreak="break-word" whiteSpace="normal"
              onClick={() => handleUserType(user.nickname, UserAccessType.MEMBER)}>
              Remover Admin
            </Button>
          }
          <Flex h="100%" w="15%" flexDirection="column">
            <Button color="white" backgroundColor="purple" opacity="90%" h="100%" w="100%" fontSize="8" minW="0"
              onClick={() => handleUserRestrictions(user.nickname, user.kicked_at ? UserAccessRestrictions.UNKICK : UserAccessRestrictions.KICK)} >
              {user.kicked_at ? "Unkick" : "Kick"}
            </Button>
            <Button color="white" backgroundColor="purple" opacity="90%" h="100%" w="100%" fontSize="8" minW="0"
              onClick={() => handleUserRestrictions(user.nickname, user.banned_at ? UserAccessRestrictions.UNBLOCK : UserAccessRestrictions.BLOCK)}>
              {user.banned_at ? "Unban" : "Ban"}
            </Button>
            <Button color="white" backgroundColor="purple" opacity="90%" h="100%" w="100%" fontSize="8" minW="0"
              onClick={() => handleUserRestrictions(user.nickname, user.muted_until ? UserAccessRestrictions.UNMUTE : UserAccessRestrictions.MUTE)}>
              {user.muted_until ? "Unmute" : "Mute"}
            </Button>
          </Flex>
        </>
        : null
      }
    </Flex>
  );
};

export default ChatUser;
