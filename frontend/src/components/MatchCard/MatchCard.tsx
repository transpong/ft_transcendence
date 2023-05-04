import { Box, Text, Badge, Avatar, Flex, HStack } from "@chakra-ui/react";

interface IPlayerMatch {
  points: number
  nickname: string;
  avatar?: string;
}

interface Props {
  winner: IPlayerMatch;
  loser: IPlayerMatch;
}

export default function MatchCard(props: Props) {
  const { winner, loser } = props;

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
        <Avatar src={winner.avatar || "https://bit.ly/sage-adebayo"} />
        <Box ml="3">
          <Text fontWeight="bold">{winner.nickname}</Text>
          <Badge ml="1" colorScheme="green">
            Vitória
          </Badge>
        </Box>
      </Flex>
      <Flex>
        <Text ml="10" fontWeight="bold" fontSize="20">
          {winner.points}
        </Text>
        <Text ml="10" fontWeight="bold" fontSize="20">
          x
        </Text>
        <Text ml="10" fontWeight="bold" fontSize="20">
          {loser.points}
        </Text>
      </Flex>
      <Flex>
        <Avatar ml="10" src={loser.avatar || "https://bit.ly/dan-abramov"} />
        <Box ml="3">
          <Text fontWeight="bold">{loser.nickname}</Text>
          <Badge ml="1" colorScheme="red">
            Derrota
          </Badge>
        </Box>
      </Flex>
    </HStack>
  );
}
