import { Button, Flex } from "@chakra-ui/react";
import { ScreensObject } from "../../Chat";

interface Props {
  setScreenNavigation: React.Dispatch<
    React.SetStateAction<keyof ScreensObject>
  >;
  group_type?: number;
  user_access_type?: number;
}

const ConfigChannelView = ({ setScreenNavigation, group_type, user_access_type }: Props) => {

  const handleChannelUpdate = async () => {

    console.log("data")
    setScreenNavigation(1);
  };

  return (
    <Flex
      h="100vh"
      justifyContent="space-around"
      flexDirection="column"
      padding="2"
    >
      <Button colorScheme={"purple"} onClick={() => setScreenNavigation(4)}>
        Adicionar Integrantes
      </Button>
      <Button colorScheme={"purple"} onClick={() => setScreenNavigation(3)}>
        Listar Intergrantes
      </Button>
      {
        user_access_type != 3 ? null :
        (
          group_type == 2 ?
            <>
              <Flex justifyContent="space-around" h="12vh">
                <Button colorScheme={"purple"} onClick={handleChannelUpdate} h="100%" w="45%" fontSize="14px">
                  Tornar Público
                </Button>
                <Button colorScheme={"purple"} onClick={handleChannelUpdate} h="100%" w="45%" fontSize="14px">
                  Tornar Privado
                </Button>
              </Flex>
              <Button colorScheme={"red"} onClick={() => setScreenNavigation(6)}>
                Configurar Senha
              </Button>
            </>
          : ( group_type == 3 ?
              <Flex justifyContent="space-around" h="12vh">
                <Button colorScheme={"purple"} onClick={() => setScreenNavigation(6)} h="100%" w="45%" fontSize="14px">
                  Tornar Protegido
                </Button>
                <Button colorScheme={"purple"} onClick={handleChannelUpdate} h="100%" w="45%" fontSize="14px">
                  Tornar Público
                </Button>
              </Flex>
            :
              <Flex justifyContent="space-around" h="12vh">
                <Button colorScheme={"purple"} onClick={() => setScreenNavigation(6)} h="100%" w="45%" fontSize="14px">
                  Tornar Protegido
                </Button>
                <Button colorScheme={"purple"} onClick={handleChannelUpdate} h="100%" w="45%" fontSize="14px">
                  Tornar Privado
                </Button>
              </Flex>
          )
        )
      }
      <Button colorScheme={"red"} onClick={handleChannelUpdate}>
        Sair
      </Button>
    </Flex>
  );
};

export default ConfigChannelView;
