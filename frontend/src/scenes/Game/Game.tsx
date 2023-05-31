import {
  Text,
  HStack,
  VStack,
  Stack,
  RadioGroup,
  Radio,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

export default function Me(){
  const [selectedField, setSelectedField] = useState('None')
  const [selectedMode, setSelectedMode] = useState('Online')
  const [selectedNumberPlayers, setSelectedNumberPlayers] = useState('1')


  return  (
    <>
      <VStack h="100%" w={"100%"} borderRadius={"20px"} align={"center"} background={"black"}>
        <Text
          fontSize={"70px"}
          fontWeight={"bold"}
          textColor="white"
          textAlign="center"
        >
            Pong
        </Text>
        <HStack w={"100%"} h={"50%"} background={"red"} justify={"center"} >
          <VStack background={"white"} border={"8px"} borderColor={"#805AD5"} borderTopRadius={"20px"} borderBottomRadius={"20px"}>
            <Text
              fontSize={"20px"}
              fontWeight={"bold"}
              textColor="black"
              textAlign="center"
            >
              Modo
            </Text>
            <RadioGroup onChange={setSelectedMode} value={selectedMode}>
              <Stack spacing={5}>
                <Radio value='Online' size={"lg"}>Online</Radio>
                <Radio value='Offline' size={"lg"}>Offline</Radio>
              </Stack>
            </RadioGroup>
          </VStack>
          {selectedMode == "Offline" ? (
            <VStack background={"white"} border={"8px"} borderColor={"#805AD5"} borderTopRadius={"20px"} borderBottomRadius={"20px"}>
              <Text
                fontSize={"20px"}
                fontWeight={"bold"}
                textColor="black"
                textAlign="center"
              >
                {"Player(s)"}
              </Text>
              <RadioGroup onChange={setSelectedNumberPlayers} value={selectedNumberPlayers}>
                <Stack spacing={5}>
                  <Radio value='1' size={"lg"}>1 Player</Radio>
                  <Radio value='2' size={"lg"}>2 Players</Radio>
                </Stack>
              </RadioGroup>
            </VStack>) : null}
          <VStack background={"white"} border={"8px"} borderColor={"#805AD5"} borderTopRadius={"20px"} borderBottomRadius={"20px"}>
            <Text
              fontSize={"20px"}
              fontWeight={"bold"}
              textColor="black"
              textAlign="center"
            >
              Campo
            </Text>
            <RadioGroup onChange={setSelectedField} value={selectedField}>
              <Stack spacing={5}>
                <Radio value='None' size={"lg"} fontWeight={"bold"}>None</Radio>
                <Radio value='Futebol' size={"lg"}>Futebol</Radio>
                <Radio value='Basquete' size={"lg"}>Basquete</Radio>
                <Radio value='Hoquei' size={"lg"}>Hoquei</Radio>
              </Stack>
            </RadioGroup>
          </VStack>
        </HStack>
        <Button
        colorScheme={"purple"}
        marginLeft="20px"
        paddingLeft="70px"
        paddingRight="70px"
        onClick={() => console.log("foi!")}
        >
        {selectedMode == "Online" ? "Pesquisar" : "Jogar"}
        </Button>
      </VStack>
    </>
  );
}