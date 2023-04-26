import { Box, Text, Badge, Avatar, Flex, HStack } from "@chakra-ui/react";

export default function MatchCard() {
  return (
    <HStack
      align="center"
      justify="space-evenly"
      padding="10px"
      margin="10px"
      border="1px"
      borderRadius="10"
    >
      <Flex>
        <Avatar src="https://bit.ly/dan-abramov" />
        <Box ml="3">
          <Text fontWeight="bold">Nickname</Text>
          <Badge ml="1" colorScheme="green">
            Vitória
          </Badge>
        </Box>
      </Flex>
      <Flex>
        <Text ml="10" fontWeight="bold" fontSize="20">
          10
        </Text>
        <Text ml="10" fontWeight="bold" fontSize="20">
          x
        </Text>
        <Text ml="10" fontWeight="bold" fontSize="20">
          7
        </Text>
      </Flex>
      <Flex>
        <Avatar ml="10" src="https://bit.ly/sage-adebayo" />
        <Box ml="3">
          <Text fontWeight="bold">Nickname</Text>
          <Badge ml="1" colorScheme="red">
            Derrota
          </Badge>
        </Box>
      </Flex>
    </HStack>
  );
}
