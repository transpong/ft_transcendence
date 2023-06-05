import { Flex, Input, Button } from "@chakra-ui/react";

type obj = {
    inputMessage: string;
    setInputMessage: (i: string) => void;
    handleSendMessage: () => void;
}

const Footer = ({ inputMessage, setInputMessage, handleSendMessage }: obj) => {
  return (
    <Flex w="100%" mt="5" marginBottom={"1vh"}>
      <Input
        placeholder="Type Something..."
        border="none"
        borderRadius="none"
        _focus={{
          border: "1px solid black",
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
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
        disabled={inputMessage.trim().length <= 0}
        onClick={handleSendMessage}
      >
        Send
      </Button>
    </Flex>
  );
};

export default Footer;