import { Button, Flex } from "@chakra-ui/react";
import { ChannelAccessType, chatService, IChannelChat, UserAccessType } from "../../../../services/chat-service";
import { ScreensObject } from "../../Chat";

interface Props {
  setScreenNavigation: React.Dispatch<
    React.SetStateAction<keyof ScreensObject>
  >;
  group_type?: number;
  user_access_type?: number;
  channelInfo?: IChannelChat;
}

const ConfigChannelView = ({ setScreenNavigation, group_type, user_access_type, channelInfo }: Props) => {

  const handleChannelUpdate = async (type: ChannelAccessType) => {
    if (channelInfo) {
      const isValid = await chatService.updateChannelType(channelInfo.id, type);
      if (isValid) window.location.reload();
    }
  };

  const handleLeaveChannel = async () => {
    if (channelInfo) {
      const isValid = await chatService.leaveChannel(channelInfo.id);
      if (isValid) window.location.reload();
    }
  };

  return (
    <Flex
      h="100vh"
      justifyContent="space-around"
      flexDirection="column"
      padding="2"
    >
      {
        user_access_type == UserAccessType.ADMIN || user_access_type == UserAccessType.OWNER ?
        <Button colorScheme={"purple"} onClick={() => setScreenNavigation(4)}>
          Adicionar Integrantes
        </Button> : null
      }
      <Button colorScheme={"purple"} onClick={() => setScreenNavigation(3)}>
        Listar Intergrantes
      </Button>
      {
        user_access_type != UserAccessType.OWNER ? null :
        (
          group_type == ChannelAccessType.PROTECTED ?
            <>
              <Flex justifyContent="space-around" h="12vh">
                <Button colorScheme={"purple"} onClick={() => handleChannelUpdate(ChannelAccessType.PUBLIC)} h="100%" w="45%" fontSize="14px">
                  Tornar Público
                </Button>
                <Button colorScheme={"purple"} onClick={() => handleChannelUpdate(ChannelAccessType.PRIVATE)} h="100%" w="45%" fontSize="14px">
                  Tornar Privado
                </Button>
              </Flex>
              <Button colorScheme={"red"} onClick={() => setScreenNavigation(6)}>
                Configurar Senha
              </Button>
            </>
          : ( group_type == ChannelAccessType.PRIVATE ?
              <Flex justifyContent="space-around" h="12vh">
                <Button colorScheme={"purple"} onClick={() => setScreenNavigation(6)} h="100%" w="45%" fontSize="14px">
                  Tornar Protegido
                </Button>
                <Button colorScheme={"purple"} onClick={() => handleChannelUpdate(ChannelAccessType.PUBLIC)} h="100%" w="45%" fontSize="14px">
                  Tornar Público
                </Button>
              </Flex>
            :
              <Flex justifyContent="space-around" h="12vh">
                <Button colorScheme={"purple"} onClick={() => setScreenNavigation(6)} h="100%" w="45%" fontSize="14px">
                  Tornar Protegido
                </Button>
                <Button colorScheme={"purple"} onClick={() => handleChannelUpdate(ChannelAccessType.PRIVATE)} h="100%" w="45%" fontSize="14px">
                  Tornar Privado
                </Button>
              </Flex>
          )
        )
      }
      <Button colorScheme={"red"} onClick={handleLeaveChannel}>
        Sair
      </Button>
    </Flex>
  );
};

export default ConfigChannelView;
