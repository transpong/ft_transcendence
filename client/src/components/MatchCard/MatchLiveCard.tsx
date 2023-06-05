import { Box, Text, Badge, Avatar, Flex, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { avatarUrl } from "../../helpers/avatar-url";
import { IApiMatchHistory } from "../../services/game-service";

interface Props {
  match: IApiMatchHistory;
}

export default function MatchLiveCard(props: Props) {
  const { match } = props;
  const navigate = useNavigate();

  return (
    <HStack
      align="center"
      justify="space-evenly"
      padding="10px"
      margin="10px"
      border="1px"
      borderRadius="10"
      backgroundColor="rgba(255,255,255, 0.9)"
      onClick={() => navigate(`/home/pong/game/watch/${match.room_id}`)}
      cursor="pointer"
    >
      <Flex align="center">
        <Avatar src={avatarUrl(match.user_1.avatar)} />
        <Box ml="3">
          <Text fontWeight="bold">{match.user_1.nickname}</Text>
        </Box>
      </Flex>
      <Flex>
        <Badge ml="1" colorScheme="blue">
          Ao Vivo - Clique para assistir
        </Badge>
      </Flex>
      <Flex align="center">
        <Avatar ml="10" src={avatarUrl(match.user_2.avatar)} />
        <Box ml="3">
          <Text fontWeight="bold">{match.user_2.nickname}</Text>
        </Box>
      </Flex>
    </HStack>
  );
}
