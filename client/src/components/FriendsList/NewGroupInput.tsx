import { Flex, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import { ChannelAccessType, chatService } from "../../services/chat-service";

const NewGroupInput = () => {
  const [channelName, setChannelName] = useState("");

  const handleCreateChannel = async () => {
      const isValid = await chatService.createChannel({
        name: channelName,
        type: ChannelAccessType.PRIVATE,
      });

      if(isValid) window.location.reload()
  };

  return (
    <Flex w="100%" mt="5" marginBottom={"1vh"}>
      <Input
        placeholder="Nome do novo canal"
        border="none"
        borderRadius="none"
        _focus={{
          border: "1px solid black",
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleCreateChannel();
          }
        }}
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
      />
      <Button
        bg="#805AD5"
        color="white"
        borderRadius="10px"
        _hover={{
          bg: "white",
          color: "black",
          border: "1px solid black",
        }}
        disabled={channelName.trim().length <= 0}
        onClick={handleCreateChannel}
      >
        Criar
      </Button>
    </Flex>
  );
};

export default NewGroupInput;