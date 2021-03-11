import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, VStack, Wrap } from "@chakra-ui/layout";
import { Button, IconButton } from "@chakra-ui/react";
import { range } from "lodash";
import React, { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";
import BuySeedModal from "../components/BuySeedModal";
import Header from "../components/Header";
import PageHeader from "../components/PageHeader";
import { getContractStorage } from "../service/bcd";
import { useApp } from "../state/app";
import config from "../config";
import selectObjectByKeys from "../utils/selectObjectByKeys";
import { getPriceFromId } from "../utils/price";

// const scrollToCreateMandala = document
//   .querySelector("#create-mandala")
//   .scrollIntoView({ behavior: "smooth" });

const MainPage = () => {
  //   const scrollToCreateMandala = document
  //     .querySelector("#create-mandala")
  //     ?.scrollIntoView({ behavior: "smooth" });

  const { connectWallet, buySeed, wallet } = useApp();
  const [nextId, setNextId] = useState(1);
  const handleGetMandala = async () => {
    if (!wallet) {
      await connectWallet();
    }

    buySeed();
  };
  const getCurrentPosition = async () => {
    const storage = await getContractStorage(config.contract);
    const nextId = selectObjectByKeys(storage, {
      type: "nat",
      name: "next_id",
    })?.value;
    setNextId(parseInt(nextId || 2) - 1);
  };
  useEffect(() => getCurrentPosition(), []);
  return (
    <VStack maxW="100%">
      <Flex h="calc(100vh - 104px)" align="center">
        <VStack spacing={8} maxW="100%">
          <Text fontSize="5xl" align="center">
            Tezos Mandala: a Generative Art Project
          </Text>
          {/* <PageHeader></PageHeader> */}
          <Text fontSize="3xl" align="center" fontWeight="300">
            Сreate your unique digital mandalas as NFTs. All the mandalas are
            recorded in the Tezos blockchain forever, so that they are truly
            decentralized.
          </Text>
          <Flex w="100%" justify="center">
            <HashLink to="/#create-mandala">
              <IconButton
                colorScheme="orange"
                isRound
                icon={<ChevronDownIcon />}
              />
            </HashLink>
          </Flex>
        </VStack>
      </Flex>
      <Flex h="100vh" align="center" id="create-mandala" maxW="100%">
        <VStack spacing={16} maxW="100%">
          <Text fontSize="5xl" align="center">
            Create Your Mandala
          </Text>
          {/* <PageHeader></PageHeader> */}
          <Text fontSize="3xl" align="center" fontWeight="300">
            Сreate your unique digital mandalas as NFTs. All the mandalas are
            recorded in the Tezos blockchain forever, so that they are truly
            decentralized.
          </Text>
          <Wrap>{/* 6 mandalas here */}</Wrap>
          <VStack w="100%">
            <Flex
              className="line"
              w="100%"
              h="4px"
              background="orange.500"
              position="relative"
            >
              {range(1, 20).map((stage) => (
                <Flex
                  className={`stage-${stage}-end`}
                  position="absolute"
                  h="100%"
                  left={`${stage * 5}%`}
                  w="1px"
                  background="black"
                />
              ))}
              <Flex
                className="left-to-mint"
                position="absolute"
                top="-24px"
                left={`calc(${(nextId / 2000) * 100}% - 7px)`}
              >
                <Text fontSize="xs">{`${2000 - nextId}`}</Text>
              </Flex>
              <Flex
                className="current-pointer"
                position="absolute"
                w="10px"
                h="10px"
                background="red.500"
                borderRadius="100%"
                top="-2.5px"
                left={`${(nextId / 2000) * 100}%`}
              />
            </Flex>
            <Box
              display={{ base: "none", md: "flex" }}
              className="prices"
              w="100%"
              justifyContent="space-around"
            >
              {range(1, 21).map((stage) => (
                <Flex className={`stage-${stage}-price`} marginLeft="12px">
                  <Text
                    fontSize="xs"
                    visibility={
                      getPriceFromId(nextId) === stage * 5 ? "show" : "hidden"
                    }
                  >{`${stage * 5}tz`}</Text>
                </Flex>
              ))}
            </Box>
          </VStack>
          <Flex w="100%" justify="center">
            <BuySeedModal />
          </Flex>
        </VStack>
      </Flex>
      <Flex minHeight="100vh" align="center" id="why-tezos-mandala">
        <VStack spacing={16}>
          <Text fontSize="5xl" align="center">
            Why Tezos Mandala
          </Text>
          {/* <PageHeader></PageHeader> */}
          <VStack spacing={8} align="start">
            <Text fontSize="lg" align="left" fontWeight="300">
              Tezos Mandala is computer-generated art. It’s an experiment based
              on Western psychological interpretation of mandala.
            </Text>
            <Text fontSize="lg" align="left" fontWeight="300">
              It all started with Carl Jung:
            </Text>
            <Text fontSize="lg" align="left" fontWeight="300">
              I sketched every morning in a notebook a small circular drawing,
              ... which seemed to correspond to my inner situation at the time.
              ... Only gradually did I discover what the mandala really is: ...
              the Self, the wholeness of the personality, which if all goes well
              is harmonious.
            </Text>
            <Text fontSize="lg" align="left" fontWeight="300">
              — Carl Jung, Memories, Dreams, Reflections, pp. 195–196.
            </Text>
            <Text fontSize="lg" align="left" fontWeight="300">
              Mandala for Jung was a way of interaction with our unconscious
              meaning, a way of plunging into inner self and rebalancing.
            </Text>
            <Text fontSize="lg" align="left" fontWeight="300">
              Jung was talking about physical mandalas which a person was
              drawing here and now. A person is drawing a digital Tezos Mandala
              here and now by one’s unique hash. You click the button, send the
              transaction and the smart contract generates a mandala from the
              hash of this transaction. No one knows how your mandala will look
              like. We only can tell you that it will be a unique mandala built
              from elements of a different degree of rarity. The rarest elements
              are an eye and the Tezos sign in the centre of mandala.
            </Text>
            <Text fontSize="lg" align="left" fontWeight="300">
              Tezos Mandala is generated from an initial name. There will be
              some kind words for you. A month later, when you meet your Mandala
              for the first time you can name it. It will be more difficult to
              change the name of your Mandala after that and only possible after
              three months of its nonstop possession.
            </Text>
            <Text fontSize="lg" align="left" fontWeight="300">
              There will be generated 2000 mandala altogether. Take a look at
              the counter at the top of the screen to know how many mandalas are
              left for generating.
            </Text>

            <Flex w="100%" justify="center">
              <BuySeedModal />
            </Flex>
          </VStack>
        </VStack>
      </Flex>

      <Flex h="100vh" align="center" id="NFT Marketplacey Is Coming">
        <VStack spacing={16}>
          <Text fontSize="5xl" align="center">
            NFT Marketplacey Is Coming
          </Text>
          {/* <PageHeader></PageHeader> */}
          <Text fontSize="lg" fontWeight="300">
            Мы команда The Buttonists, призеры Tezos DeFi Hackathon. Мы создали
            Tezos Mandala, потому что мы любим цифровое искусство и NFT.
            Основной проект, над которым мы сейчас работаем, это NFT Button. Это
            NFT-маркетплейс, на котором можно будет торговать Tezos Mandalas и
            любыми There will be generated *how many?* mandala altogether. Take
            a look at the counter at the top of the screen to know how many
            mandalas are left for generating.
          </Text>
        </VStack>
      </Flex>
    </VStack>
  );
};

export default MainPage;
