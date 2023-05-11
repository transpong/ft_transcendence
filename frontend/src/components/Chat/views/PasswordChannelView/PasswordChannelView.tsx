import { Button, Input, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { ScreensObject } from "../../Chat";

interface Props {
  setScreenNavigation: React.Dispatch<
    React.SetStateAction<keyof ScreensObject>
  >;
}

const PasswordChannelView = ({ setScreenNavigation }: Props) => {

  const [inputPassword, setInputPassword] = useState("");

  const handleSendPassword = async () => {
    if (!inputPassword.trim().length) {
      return;
    }
    const data = inputPassword.trim();
    console.log(data)
    setScreenNavigation(1);
  };

  return (
    <Flex
      h="100vh"
      justifyContent="space-around"
      flexDirection="column"
      padding="5"
    >
      <Text textAlign="center" textStyle="bold" fontSize="20">
        Canal privado
      </Text>
      <Text textAlign="center" textStyle="bold">
        Digite a senha para entrar
      </Text>
      <Input
        placeholder="Senha"
        type="password"
        colorScheme={"purple"}
        onChange={(e) => setInputPassword(e.target.value)}
      />
      <Button colorScheme={"purple"} onClick={handleSendPassword}>
        Entrar
      </Button>
    </Flex>
  );
};

export default PasswordChannelView;
