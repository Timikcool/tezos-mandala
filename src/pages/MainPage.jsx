import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Link,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/layout";
import { Button, IconButton, Img } from "@chakra-ui/react";
import { range } from "lodash";
import React, { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";
import BuySeedModal from "../components/BuySeedModal";

import { getContractStorage } from "../service/bcd";

import config from "../config.json";
import selectObjectByKeys from "../utils/selectObjectByKeys";
import { getPriceFromId } from "../utils/price";
import exampleMandala1 from "../assets/img/example-mandala-1.svg";
import exampleMandala2 from "../assets/img/example-mandala-2.svg";
import exampleMandala3 from "../assets/img/example-mandala-3.svg";
import exampleMandala4 from "../assets/img/example-mandala-4.svg";
import exampleMandala5 from "../assets/img/example-mandala-5.svg";
import exampleMandala6 from "../assets/img/example-mandala-6.svg";
import { useApp } from "../state/app";

const exampleMandalas = [
  exampleMandala1,
  exampleMandala2,
  exampleMandala3,
  exampleMandala4,
  exampleMandala5,
  exampleMandala6,
];

// const scrollToCreateMandala = document
//   .querySelector("#create-mandala")
//   .scrollIntoView({ behavior: "smooth" });

const MainPage = () => {
  //   const scrollToCreateMandala = document
  //     .querySelector("#create-mandala")
  //     ?.scrollIntoView({ behavior: "smooth" });

  const [nextId, setNextId] = useState(1);
  const { subscriber } = useApp();

  const getCurrentPosition = async () => {
    const storage = await getContractStorage(config.contract);
    const nextId = selectObjectByKeys(storage, {
      type: "nat",
      name: "next_id",
    })?.value;
    setNextId(parseInt(nextId || 2) - 1);
  };
  useEffect(() => {
    getCurrentPosition();
    subscriber.on("data", (transaction) => {
      if (["buy"].includes(transaction?.parameters?.entrypoint)) {
        getCurrentPosition();
      }
    });
  }, []);
  return (
    <VStack maxW="100%" spacing={16}>
      <Flex h="calc(100vh - 104px)" align="center">
        <VStack spacing={8} maxW="100%">
          <Text fontSize="5xl" align="center">
            Tezos Mandala: a Generative Art Project
          </Text>
          {/* <PageHeader></PageHeader> */}
          <Text fontSize="3xl" align="center" fontWeight="300">
            Create your unique digital mandalas as NFTs. All the mandalas are
            recorded in the Tezos blockchain forever, so they are truly
            decentralized and trustless.
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
      <Flex minH="100vh" align="center" id="create-mandala" maxW="100%">
        <VStack spacing={16} maxW="100%">
          <Text fontSize="5xl" align="center">
            Create Your Mandala
          </Text>

          <Wrap justify="center">
            {/* 6 mandalas here */}

            {exampleMandalas.map((src) => (
              <WrapItem>
                <Img src={src} w="250px" h="250px" />
              </WrapItem>
            ))}
          </Wrap>

          <VStack>
            <Text fontSize="xl" align="center" fontWeight="300">
              Mandala price starts from 5 tez and increases with 5 tez every 100
              mandalas.
            </Text>
            <Text fontSize="xl" align="center" fontWeight="300">
              There will be only 2,000 mandalas generated.
            </Text>
            <Text fontSize="xl" align="center" fontWeight="300">
              The final 100 mandalas will be sold for 100 tez per mandala
            </Text>
          </VStack>

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
                  w="2px"
                  background="black"
                  key={stage.toString()}
                />
              ))}
              <Flex
                className="left-to-mint"
                position="absolute"
                top="-24px"
                left={`calc(${(nextId / 2000) * 100}% - 7px)`}
              >
                <Text fontSize="xs">{`${2000 - nextId} mandalas left`}</Text>
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
                <Flex
                  className={`stage-${stage}-price`}
                  marginLeft="12px"
                  key={stage.toString()}
                >
                  <Text
                    fontSize="xs"
                    visibility={
                      getPriceFromId(nextId) === stage * 5 || stage === 20
                        ? "show"
                        : "hidden"
                    }
                  >{`${stage * 5} tez`}</Text>
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
              Tezos Mandala is a digital generative art. This is an experiment
              based on the{" "}
              <Link
                color="#0a58ca"
                textDecoration="underline"
                target="_blank"
                rel="noopener noreferrer"
                href="https://en.wikipedia.org/wiki/Mandala#Western_psychological_interpretations"
              >
                Western psychological interpretation of mandala.
              </Link>
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
              — Carl Jung,{" "}
              <Link
                href="https://en.wikipedia.org/wiki/Memories,_Dreams,_Reflections"
                target="_blank"
                rel="noopener noreferrer"
                color="#0a58ca"
                textDecoration="underline"
              >
                Memories, Dreams, Reflections
              </Link>
              , pp. 195–196.
            </Text>
            <Text fontSize="lg" align="left" fontWeight="300">
              Mandala for Jung was a way of interaction with our unconscious, a
              way of plunging into inner self and rebalancing.
            </Text>
            <Text fontSize="lg" align="left" fontWeight="300">
              Jung was talking about physical mandalas which a person is drawing
              here and now. Digital Tezos Mandalas are also being drawn by a
              person here and now but this time by his unique hash.
            </Text>
            <Text fontSize="lg" align="left" fontWeight="300">
              To create your mandala you will need a mandala seed (buy it here
              or get it from someone). You can generate a mandala from your
              mandala seed at any time you wish. To do so you will have to go to
              My Collection, choose a mandala seed and click the Create Mandala
              button. You send the transaction and the{" "}
              <Link
                color="#0a58ca"
                textDecoration="underline"
                href={`https://better-call.dev/${config.network}/${config.contract}/`}
              >
                smart-contract
              </Link>{" "}
              generates a mandala from the hash of this transaction.
            </Text>
            <Text fontSize="lg" align="left" fontWeight="300">
              No one knows how your mandala will look like. We can only tell you
              that it will be a unique mandala built from elements of a
              different degree of rarity. The rarest elements are an eye or the
              Tezos sign in the center of a mandala. The color range of mandala
              elements is linked to their meanings, and the mandala background
              color range is linked to the Tezos ecosystem colors. Only a few
              mandalas will not comply with the rules.
            </Text>

            <Text fontSize="lg" align="left" fontWeight="300">
              While generating, Tezos Mandala is given an initial name. The name
              will consist of some kind words. A month later, when you meet your
              mandala closer, you can rename it. It will be more difficult to
              change the name of your mandala after that and only possible after
              two months of its continuous possession. Then, you can rename your
              mandala after 4 months, then after 8 months, and so on, a time
              will double after each renaming. Tezos Mandalas are not stored on
              the Amazon cloud and not even on IPFS, they are recorded in the
              Tezos blockchain forever. That is why they are truly decentralized
              and trustless.
            </Text>

            <Text fontSize="lg" align="left" fontWeight="300">
              {`In total, there will be 2,000 mandalas generated. Mandala seeds
              will be sold at an increasing price to reward early adopters of
              the project. For now, ${2000 - nextId} mandalas left.`}
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
            NFT Marketplace Is Coming
          </Text>
          {/* <PageHeader></PageHeader> */}
          <Text fontSize="lg" fontWeight="300">
            We are The Buttonists, the awardees of #TezosDeFiHackathon. We
            created Tezos Mandala because we love digital art and NFTs. The main
            project that we are working on is NFT Button. This is an
            NFT-marketplace where people can trade Tezos Mandalas and any other
            NFTs on the Tezos blockchain. The main feature of this marketplace
            is a new type of all-pay auction, which we named Buttonist auction.
            It will be fun, stay tuned.
          </Text>
        </VStack>
      </Flex>
    </VStack>
  );
};

export default MainPage;
