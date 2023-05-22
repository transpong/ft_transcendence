import { Box, Text, Badge, Avatar, Flex, HStack } from "@chakra-ui/react";
import { avatarUrl } from "../../helpers/avatar-url";
import { IApiMatchHistory } from "../../services/game-service";

interface Props {
  match: IApiMatchHistory;
}

export default function MatchCard(props: Props) {
  const { match } = props;

  return (
    <HStack
      align="center"
      justify="space-evenly"
      padding="10px"
      margin="10px"
      border="1px"
      borderRadius="10"
      backgroundColor="rgba(255,255,255, 0.9)"
    >
      <Flex>
        <Avatar src={avatarUrl(match.user_1.avatar)} />
        <Box ml="3">
          <Text fontWeight="bold">{match.user_1.nickname}</Text>
          {match.user_1.is_winner ? (
            <Badge ml="1" colorScheme="green">
              Vitória
            </Badge>
          ) : (
            <Badge ml="1" colorScheme="red">
              Derrota
            </Badge>
          )}
        </Box>
      </Flex>
      <Flex>
        <Text ml="10" fontWeight="bold" fontSize="20">
          {match.user_1.score}
        </Text>
        <Text ml="10" fontWeight="bold" fontSize="20">
          x
        </Text>
        <Text ml="10" fontWeight="bold" fontSize="20">
          {match.user_2.score}
        </Text>
      </Flex>
      <Flex>
        <Avatar ml="10" src={avatarUrl(match.user_2.avatar)} />
        <Box ml="3">
          <Text fontWeight="bold">{match.user_2.nickname}</Text>
          {match.user_2.is_winner ? (
            <Badge ml="1" colorScheme="green">
              Vitória
            </Badge>
          ) : (
            <Badge ml="1" colorScheme="red">
              Derrota
            </Badge>
          )}
        </Box>
      </Flex>
    </HStack>
  );
}
