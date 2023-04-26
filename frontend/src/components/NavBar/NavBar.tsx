import { ButtonGroup, Button, Avatar, HStack} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";

export default function NavBar() {
  return (
    <HStack  h="65px" align="center" justify="space-between">
      <Button marginLeft="20px" paddingLeft="70px" paddingRight="70px">
        Transpong
      </Button>
      <ButtonGroup>
        <Button>Jogar</Button>
        <Button>Jogos ao vivo</Button>
        <Button>Ranking</Button>
      </ButtonGroup>
      <Button leftIcon={<Avatar />} rightIcon={<SettingsIcon />} size="lg">
        Nickname
      </Button>
    </HStack>
  );
}
