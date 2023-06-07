import { Box, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { chatService, IApiChannelUsers, IChannelChat } from "../../../../services/chat-service";
import { ScreensObject } from "../../Chat";
import ChatUser from "./ChatUser";

interface Props {
  setScreenNavigation: React.Dispatch<
    React.SetStateAction<keyof ScreensObject>
  >;
  user_access_type?: number;
  channelInfo?: IChannelChat;
}

const ListChannelUsersView = ({ setScreenNavigation, user_access_type, channelInfo }: Props) => {

  const [users, setUsers] = useState<IApiChannelUsers[]>([])

  useMemo(async () => {
    if (channelInfo) {
      const channelUsers = await chatService.getChannelUsers(channelInfo.id)
      setUsers(channelUsers);
    }
  }, [channelInfo])

  async function updateUsers() {
    if (channelInfo) {
      const channelUsers = await chatService.getChannelUsers(channelInfo.id);
      setUsers(channelUsers);
    }
  }

  return (
    <Box h="100vh" padding="2" overflowY="scroll">
      <Text textAlign="center" textStyle="bold" fontSize="20" mb="2">
        Lista de Usuários
      </Text>
      {users.map((user) => (
        <ChatUser
          user={user}
          user_access_type={user_access_type}
          channelInfo={channelInfo}
          setScreenNavigation={setScreenNavigation}
          updateUsers={updateUsers}
          key={user.id}
        />
      ))}
    </Box>
  );
};

export default ListChannelUsersView;
