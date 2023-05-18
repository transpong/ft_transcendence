import { Box, Text, Badge, Avatar, Flex, HStack } from "@chakra-ui/react";
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
        <Avatar src={match.user1.avatar} />
        <Box ml="3">
          <Text fontWeight="bold">{match.user1.nickname}</Text>
          {match.user1.isWinner ? (
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
          {match.user1.score}
        </Text>
        <Text ml="10" fontWeight="bold" fontSize="20">
          x
        </Text>
        <Text ml="10" fontWeight="bold" fontSize="20">
          {match.user2.score}
        </Text>
      </Flex>
      <Flex>
        <Avatar ml="10" src={match.user2.avatar} />
        <Box ml="3">
          <Text fontWeight="bold">{match.user2.nickname}</Text>
          {match.user2.isWinner ? (
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
