import { Text } from "@chakra-ui/react";

import { UserEnum } from "../../services/users-service";

type Props = {
  status: UserEnum;
};

const UserTextStatus = ({ status }: Props) => {
  return status == UserEnum.ONLINE ? (
    <Text fontSize={"small"} color="green.500" fontWeight={"extrabold"}>
      Online
    </Text>
  ) : status == UserEnum.OFFLINE ? (
    <Text fontSize={"small"} color="gray.500" fontWeight={"extrabold"}>
      Offline
    </Text>
  ) : status == UserEnum.ONGAME ? (
    <Text fontSize={"small"} color="blue.500" fontWeight={"extrabold"}>
      In Game
    </Text>
  ) : status == UserEnum.INLOBBY ? (
    <Text fontSize={"small"} color="yellow.500" fontWeight={"extrabold"}>
      In Lobby
    </Text>
  ) : null;
};

export default UserTextStatus;
