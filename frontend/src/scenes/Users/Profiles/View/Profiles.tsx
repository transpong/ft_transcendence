import { Flex } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";

export default function Profile(){
  return (
    <Flex backgroundColor={"red"} h='100%' w={"100%"} borderRadius={"20px"} align={"center"} justify={"center"}>
      <Text fontSize={"40px"} fontWeight={"bold"}>Profile</Text>
    </Flex>
  );
}