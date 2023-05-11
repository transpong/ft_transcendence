import { Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { ScreensObject } from "../../Chat";
import ChatUser from "./ChatUser";

interface Props {
  setScreenNavigation: React.Dispatch<
    React.SetStateAction<keyof ScreensObject>
  >;
  user_access_type?: number;
}

export interface IUser {
  id: number
  nickname: string;
  avatar?: string;
  status: number;
  banned_at?: Date;
  kicked_at?: Date;
  muted_until?: Date;
  user_access_type: number;
}

const ListChannelUsersView = ({ setScreenNavigation, user_access_type }: Props) => {

  const [users, setUsers] = useState<IUser[]>([
    {
      id: 1,
      nickname: "string",
      avatar: "https://bit.ly/dan-abramov",
      status: 2,
      user_access_type: 1,
    },
    {
      id: 3,
      nickname: "string",
      avatar: "https://bit.ly/dan-abramov",
      status: 2,
      user_access_type: 1,
      banned_at: new Date()
    },
    {
      id: 4,
      nickname: "string",
      avatar: "https://bit.ly/dan-abramov",
      status: 2,
      user_access_type: 1,
      kicked_at: new Date(),
    },
    {
      id: 5,
      nickname: "string",
      avatar: "https://bit.ly/dan-abramov",
      status: 2,
      user_access_type: 1,
      muted_until: new Date()
    },
    {
      id: 7,
      nickname: "string",
      avatar: "https://bit.ly/dan-abramov",
      status: 2,
      user_access_type: 2,
    },
    {
      id: 8,
      nickname: "string",
      avatar: "https://bit.ly/dan-abramov",
      status: 2,
      user_access_type: 3,
    },
  ]);

  return (
    <Box
      h="100vh"
      padding="2"
      overflowY="scroll"
    >
      <Text textAlign="center" textStyle="bold" fontSize="20" mb="2">
        Lista de Usuários
      </Text>
      {
        users.map(user => <ChatUser user={user} user_access_type={user_access_type} />)
      }

    </Box>
  );
};

export default ListChannelUsersView;
