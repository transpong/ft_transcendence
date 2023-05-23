import { LockIcon, UnlockIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { ChannelAccessType } from "../../services/chat-service";

type Props = {
  type: ChannelAccessType;
};

const ChannelTypeIcon = ({ type }: Props) => {
  return type == ChannelAccessType.PUBLIC ? (
    <UnlockIcon color="green" />
  ) : type == ChannelAccessType.PRIVATE ? (
    <LockIcon color="black" />
  ) : type == ChannelAccessType.PROTECTED ? (
    <WarningTwoIcon color="red" />
  ) : null;
};

export default ChannelTypeIcon;
