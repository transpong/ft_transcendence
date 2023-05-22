import { Fragment, useMemo, useState } from "react";
import { chatService, IApiDirectMessagesList, IChannelChat } from "../../../../services/chat-service";
import { IApiUserMe } from "../../../../services/users-service";
import Divider from "../../Divider";
import Footer from "./Footer";
import Messages from "./Messages";

interface Props {
  channelInfo?: IChannelChat
  directInfo?: IApiUserMe; // TODO: change IApiUserMe when back implements it
}

const MessagesView = (props: Props) => {
  const [messages, setMessages] = useState<IApiDirectMessagesList>();
  const [inputMessage, setInputMessage] = useState("");

  useMemo(async () => {
    if (props.directInfo) {
      const messagesList = await chatService.getDirectMessages(
        props.directInfo.nickname
      );
      setMessages(messagesList);
    }
  }, [props.directInfo]);


  const handleSendMessage = async () => {
    if (props.directInfo) {
      await chatService.sendDirectMessages(props.directInfo.nickname, inputMessage);
      setInputMessage("");
      const messagesList = await chatService.getDirectMessages(
        props.directInfo.nickname
      );
      setMessages(messagesList);
    }
  };

  return (
          <Fragment>
            {messages && <Messages messages={messages} />}
            <Divider />
            <Footer
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
            />
          </Fragment>
        )
};

export default MessagesView;
