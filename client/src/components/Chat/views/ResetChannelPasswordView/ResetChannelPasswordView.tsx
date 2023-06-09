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

const ResetChannelPasswordView = ({ channelInfo }: Props) => {

  const [inputPassword, setInputPassword] = useState("");

  const handleSendPassword = async () => {
    if (!inputPassword.trim().length) {
      return;
    }
    const data = inputPassword.trim();
    if (channelInfo) {
      const isValid = await chatService.updateChannelPassword(channelInfo.id, data);
      if(isValid) window.location.reload();
    }
  };

  return (
    <Flex
      h="100vh"
      justifyContent="space-around"
      flexDirection="column"
      padding="5"
    >
      <Text textAlign="center" textStyle="bold" fontSize="16">
        Configurar Nova Senha
      </Text>
      <Input
        placeholder="Nova Senha"
        type="password"
        colorScheme={"purple"}
        onChange={(e) => setInputPassword(e.target.value)}
      />
      <Button colorScheme={"purple"} onClick={handleSendPassword}>
        Atualizar
      </Button>
    </Flex>
  );
};

export default ResetChannelPasswordView;
