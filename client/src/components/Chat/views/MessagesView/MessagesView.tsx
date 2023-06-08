import { Fragment, useEffect, useMemo, useState } from "react";
import { chatService, IApiSender, IChannelChat, IMessage } from "../../../../services/chat-service";
import { IUserProfile } from "../../../../services/users-service";
import Divider from "../../Divider";
import Footer from "./Footer";
import Messages from "./Messages";

interface Props {
  channelInfo?: IChannelChat;
  directInfo?: IUserProfile;
}

const MessagesView = (props: Props) => {
  const [messages, setMessages] = useState<IMessage[]>();
  const [inputMessage, setInputMessage] = useState("");
  const [sender, setSender] = useState<IApiSender>();

  useMemo(async () => {
    if (props.directInfo) {
      try {
        const messagesList = await chatService.getDirectMessages(
          props.directInfo.nickname
        );
        setMessages(messagesList.messages);
        setSender(messagesList.user);
      } catch {}
    }

    if (props.channelInfo) {
      const messagesList = await chatService.getChannelMessages(
        props.channelInfo.id
      );
      setMessages(messagesList);
    }
  }, [props.directInfo, props.channelInfo]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (props.directInfo) {
        chatService.getDirectMessages(
          props.directInfo.nickname
        ).then(messagesList => {
          setMessages(messagesList.messages);
          setSender(messagesList.user);
        }).catch()
      }

      if (props.channelInfo) {
        chatService.getChannelMessages(
          props.channelInfo.id
        ).then(messagesList => setMessages(messagesList))
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);


  const handleSendMessage = async () => {
    if (props.directInfo) {
      await chatService.sendDirectMessages(props.directInfo.nickname, inputMessage);
      setInputMessage("");
      try {
        const messagesList = await chatService.getDirectMessages(
          props.directInfo.nickname
        );
        setMessages(messagesList.messages);
      } catch {}
    }

    if (props.channelInfo) {
      await chatService.sendChannelMessages(props.channelInfo.id, inputMessage);
      setInputMessage("");
      const messagesList = await chatService.getChannelMessages(
        props.channelInfo.id
      );
      setMessages(messagesList);
    }
  };

  return (
          <Fragment>
            {messages && <Messages messages={messages} sender={sender}/>}
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
