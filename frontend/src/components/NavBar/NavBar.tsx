import { ButtonGroup, Button, Avatar, HStack} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";

export default function NavBar() {
  return (
    <HStack  h="65px" align="center" justify="space-between">
      <Button colorScheme={"purple"} marginLeft="20px" paddingLeft="70px" paddingRight="70px">
        Transpong
      </Button>
      <ButtonGroup>
        <Button colorScheme={"purple"}>Jogar</Button>
        <Button colorScheme={"purple"}>Jogos ao vivo</Button>
        <Button colorScheme={"purple"}>Ranking</Button>
      </ButtonGroup>
      <Button  colorScheme={"purple"} leftIcon={<Avatar />} rightIcon={<SettingsIcon />} size="lg">
        Nickname
      </Button>
    </HStack>
  );
}
