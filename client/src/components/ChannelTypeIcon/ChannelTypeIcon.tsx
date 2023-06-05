import { Icon } from "@chakra-ui/icons";
import { ChannelAccessType } from "../../services/chat-service";
import { BsShieldLock } from "react-icons/bs";
import { RxLockOpen2, RxLockClosed } from "react-icons/rx";

type Props = {
  type: ChannelAccessType;
};

const ChannelTypeIcon = ({ type }: Props) => {
  return type == ChannelAccessType.PUBLIC ? (
    <Icon boxSize="1.2em" as={RxLockOpen2} color="green" />
  ) : type == ChannelAccessType.PRIVATE ? (
    <Icon boxSize="1.2em" as={RxLockClosed} color="red" />
  ) : type == ChannelAccessType.PROTECTED ? (
    <Icon boxSize="1.2em" as={BsShieldLock} color="black" display="Protected" />
  ) : null;
};

export default ChannelTypeIcon;
