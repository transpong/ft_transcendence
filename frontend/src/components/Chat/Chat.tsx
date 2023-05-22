import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { IChannelChat } from "../../services/chat-service";
import { IApiUserMe } from "../../services/users-service";
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
  directInfo?: IApiUserMe; // TODO: change IApiUserMe when back implements it
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
    useState<keyof ScreensObject>(props.type == 'group' ? 5 : 1);

  const screensObject: ScreensObject = {
    1: <MessagesView channelInfo={props.channelInfo} directInfo={props.directInfo}/>,
    2: <ConfigChannelView setScreenNavigation={setScreenNavigation} group_type={props.group_type} user_access_type={props.user_access_type} />,
    3: <ListChannelUsersView setScreenNavigation={setScreenNavigation} user_access_type={props.user_access_type} />,
    4: <AddChannelUsersView setScreenNavigation={setScreenNavigation} />,
    5: <PasswordChannelView setScreenNavigation={setScreenNavigation} />,
    6: <ResetChannelPasswordView setScreenNavigation={setScreenNavigation} />,
  };

  const minimize = () => setMinimized(!isMinimized);
  const getStatusMinimized = () => isMinimized;

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