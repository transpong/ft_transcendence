import { AvatarBadge } from "@chakra-ui/react";

import { UserEnum } from "../../services/users-service";

type Props = {
  status: UserEnum;
};

const UserBadageStatus = ({ status }: Props) => {
  return status == UserEnum.ONLINE ? (
    <AvatarBadge boxSize="1.25em" bg="green.500" />
  ) : status == UserEnum.OFFLINE ? (
    <AvatarBadge boxSize="1.25em" bg="gray.500" />
  ) : status == UserEnum.ONGAME ? (
    <AvatarBadge boxSize="1.25em" bg="blue.500" />
  ) : status == UserEnum.INLOBBY ? (
    <AvatarBadge boxSize="1.25em" bg="yellow.500" />
  ) : null;
};

export default UserBadageStatus;
