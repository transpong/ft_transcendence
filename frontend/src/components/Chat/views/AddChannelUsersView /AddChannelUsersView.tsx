import { Button, Input, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { ScreensObject } from "../../Chat";

interface Props {
  setScreenNavigation: React.Dispatch<
    React.SetStateAction<keyof ScreensObject>
  >;
}

const AddChannelUsersView = ({ setScreenNavigation }: Props) => {

  const [inputNickname, setInputNickname] = useState("");

  const handleAddUser = async () => {
    if (!inputNickname.trim().length) {
      return;
    }
    const data = inputNickname.trim();
    console.log(data)
    setScreenNavigation(3);
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
        Adiconar
      </Button>
    </Flex>
  );
};

export default AddChannelUsersView;
