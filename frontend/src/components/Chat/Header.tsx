import {MinusIcon, AddIcon, CloseIcon } from "@chakra-ui/icons";
import { Flex, Avatar, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { avatarUrl } from "../../helpers/avatar-url";
import { IChannelChat } from "../../services/chat-service";
import { IUserProfile } from "../../services/users-service";
import ChannelTypeIcon from "../ChannelTypeIcon/ChannelTypeIcon";
import UserBadageStatus from "../UserStatus/UserBadgeStatus";
import UserTextStatus from "../UserStatus/UserTextStatus";
import { ScreensObject } from "./Chat";
import HeaderNavgation from "./HeaderNavigation";

type Props = {
  minimized: () => void;
  getStatusMinimized: () => boolean;
  name: string;
  type: "group" | "individual";
  deleteChat: () => void;
  screenNavigation: number;
  channelInfo?: IChannelChat;
  directInfo?: IUserProfile;
  setScreenNavigation: React.Dispatch<
    React.SetStateAction<keyof ScreensObject>
  >;
};

const Header = (props: Props) => {
  const navigate = useNavigate();

  function handleNameClick() {
    if (props.directInfo)
      navigate(`/home/profile/${props.directInfo.nickname}`);
  }

  return (
    <Flex paddingBottom={"10px"} paddingTop={"1px"} backgroundColor={"#805AD5"} borderTopRadius={"20px"} justifyContent="space-between">
      <Flex w={"60%"} onClick={handleNameClick}>
      <Avatar size="md" name={props.name} src={props.directInfo ? avatarUrl(props.directInfo.avatar) : undefined}>
        { props.directInfo ? <UserBadageStatus status={props.directInfo.status} /> : null }
      </Avatar>
      <Flex flexDirection="column" mx="5" justify="center">
        <Text color={"white"} fontSize="sm" fontWeight="bold">
          {props.name}
        </Text>
        { props.directInfo ? <UserTextStatus status={props.directInfo.status} /> : null }
        { props.channelInfo ? <ChannelTypeIcon type={props.channelInfo.type} /> : null }
      </Flex>
      </Flex>
      <Flex align={"center"} >
        <HeaderNavgation type={props.type} screenNavigation={props.screenNavigation} setScreenNavigation={props.setScreenNavigation}
          channelInfo={props.channelInfo} directInfo={props.directInfo}/>
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
