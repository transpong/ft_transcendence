import { Flex } from "@chakra-ui/layout";
import { Button, Input, Image } from "@chakra-ui/react";
import { useState } from "react";

export default function Me(){
  const [inputMessage, setInputMessage] = useState("");

  return (
    <>
      <Flex h='100%' w={"100%"} borderRadius={"20px"} align={"center"} justify={"center"}>
        <Flex minW={"250px"} width={"30%"} height={"90%"} marginLeft={"1%"} border={"8px"} borderColor={"#805AD5"} align={"center"} justify={"center"} flexDirection={"column"} borderRadius={"20px"}>
          <Image src="../../../../../docs/images/qrcode.png"/>
          <Input
            backgroundColor={"white"}
            marginTop={"50px"}
            marginBottom={"50px"}
            w={"60%"}
            placeholder="Type Something..."
            border="none"
            borderRadius="20px"
            _focus={{
              border: "1px solid black",
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
               console.log("enter");
              }
            }}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
            <Button size={"lg"} colorScheme={"purple"} onClick={() => console.log("Validando...")}>
              Validar
            </Button> :
        </Flex>
      </Flex>
    </>
  );
}