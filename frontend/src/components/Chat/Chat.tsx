import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { ChannelAccessType, IChannelChat } from "../../services/chat-service";
import { IUserProfile } from "../../services/users-service";
import Header from "./Header";
import AddChannelUsersView from "./views/AddChannelUsersView /AddChannelUsersView";
import ConfigChannelView from "./views/ConfigChannelView/ConfigChannelView";
import ListChannelUsersView from "./views/ListChannelUsersView/ListChannelUsersView";
import MessagesView from "./views/MessagesView/MessagesView";
import PasswordChannelView from "./views/PasswordChannelView/PasswordChannelView";
import ResetChannelPasswordView from "./views/ResetChannelPasswordView/ResetChannelPasswordView";

type Props = {
  name: string;
  type: "group" | "individual";
  group_type?: number;
  user_access_type?: number;
  channelInfo?: IChannelChat;
  directInfo?: IUserProfile;
  deleteChat: () => void;
};

export interface ScreensObject {
  1: JSX.Element;
  2: JSX.Element;
  3: JSX.Element;
  4: JSX.Element;
  5: JSX.Element;
  6: JSX.Element;
}

const Chat = (props: Props) => {
  const [isMinimized, setMinimized] = useState(true);
  const [screenNavigation, setScreenNavigation] =
    useState<keyof ScreensObject>(handleInitScreen());

  const screensObject: ScreensObject = {
    1: <MessagesView channelInfo={props.channelInfo} directInfo={props.directInfo}/>,
    2: <ConfigChannelView setScreenNavigation={setScreenNavigation} group_type={props.group_type} user_access_type={props.user_access_type} channelInfo={props.channelInfo} />,
    3: <ListChannelUsersView setScreenNavigation={setScreenNavigation} user_access_type={props.user_access_type} channelInfo={props.channelInfo} />,
    4: <AddChannelUsersView setScreenNavigation={setScreenNavigation} channelInfo={props.channelInfo} />,
    5: <PasswordChannelView setScreenNavigation={setScreenNavigation} channelInfo={props.channelInfo} />,
    6: <ResetChannelPasswordView setScreenNavigation={setScreenNavigation} channelInfo={props.channelInfo} />,
  };

  const minimize = () => setMinimized(!isMinimized);
  const getStatusMinimized = () => isMinimized;

  function handleInitScreen () {
    if (props.channelInfo) {
      switch (props.channelInfo.type) {
        case ChannelAccessType.PUBLIC:
          return 1;
        case ChannelAccessType.PRIVATE:
          return 1;
        case ChannelAccessType.PROTECTED:
          return 5;
        default:
          // eslint-disable-next-line no-case-declarations
          const exaustiveCheck: never = props.channelInfo.type;
          return exaustiveCheck;
      }

    }
    return 1;
  }

  return (
    <Flex justify="end" backgroundColor={"white"} marginLeft={"2vh"} borderTopRadius={"30px"}>
      <Flex w={"17vw"} minWidth={"250px"} maxH={"50vh"} flexDir="column" borderTopRadius={"30px"}>
        <Header minimized={minimize} getStatusMinimized={getStatusMinimized} name={props.name} type={props.type} deleteChat={props.deleteChat}
          screenNavigation={screenNavigation} setScreenNavigation={setScreenNavigation} channelInfo={props.channelInfo} directInfo={props.directInfo}/>
        {isMinimized ? screensObject[screenNavigation] : null}
      </Flex>
    </Flex>
  );
};

export default Chat;