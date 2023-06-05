import { Button, Input, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { chatService, IChannelChat } from "../../../../services/chat-service";
import { ScreensObject } from "../../Chat";

interface Props {
  setScreenNavigation: React.Dispatch<
    React.SetStateAction<keyof ScreensObject>
  >;
  channelInfo?: IChannelChat;
}

const AddChannelUsersView = ({ setScreenNavigation, channelInfo }: Props) => {

  const [inputNickname, setInputNickname] = useState("");

  const handleAddUser = async () => {
    if (!inputNickname.trim().length) {
      return;
    }
    const data = inputNickname.trim();
    if (channelInfo) {
      await chatService.addChannelUsers(channelInfo.id, data);
      setInputNickname("");
      setScreenNavigation(3);
    }
  };

  return (
    <Flex
      h="100vh"
      justifyContent="space-around"
      flexDirection="column"
      padding="5"
    >
      <Text textAlign="center" textStyle="bold" fontSize="20">
        Adicionar novo integrante
      </Text>
      <Input
        placeholder="Nickname"
        colorScheme={"purple"}
        onChange={(e) => setInputNickname(e.target.value)}
      />
      <Button colorScheme={"purple"} onClick={handleAddUser}>
        Adicionar
      </Button>
    </Flex>
  );
};

export default AddChannelUsersView;
