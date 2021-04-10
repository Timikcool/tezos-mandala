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
import { Button, IconButton, Image } from "@chakra-ui/react";
import { range } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { HashLink } from "react-router-hash-link";
import BuySeedModal from "../components/BuySeedModal";
import config from "../config.json";
import { getPriceFromId } from "../utils/price";
import exampleMandala1 from "../assets/img/example-mandala-1.svg";
import exampleMandala2 from "../assets/img/example-mandala-2.svg";
import exampleMandala3 from "../assets/img/example-mandala-3.svg";
import exampleMandala4 from "../assets/img/example-mandala-4.svg";
import exampleMandala5 from "../assets/img/example-mandala-5.svg";
import exampleMandala6 from "../assets/img/example-mandala-6.svg";
import howItWorksMobile from "../assets/img/how-it-works-mobile.png";
import howItWorksDesktop from "../assets/img/how-it-works-desktop.png";
import { useApp } from "../state/app";
import { Helmet } from "react-helmet";
import { useBreakpointValue } from "@chakra-ui/react";

const exampleMandalas = [
  exampleMandala1,
  exampleMandala2,
  exampleMandala3,
  exampleMandala4,
  exampleMandala5,
  exampleMandala6,
];

const newRange = range(7, 21);
let newRangePrices = [];
newRange.forEach((stage) => stage);

const MainPage = () => {
  const [nextId, setNextId] = useState(1);
  const { contract: contractInstance, setupContract } = useApp();
  const timeoutId = useRef(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const getCurrentPosition = useCallback(async () => {
    // const storage = await getContractStorage(config.contract);
    // const nextId = selectObjectByKeys(storage, {
    //   type: "nat",
    //   name: "next_id",
    // })?.value;
    const contract = contractInstance || (await setupContract());
    const storage = await contract.storage();
    const nextId = storage.next_id.toNumber();
    console.log({ nextId, contractInstance });
    setNextId(parseInt(nextId || 2) - 1);
  }, [setNextId]);

  useEffect(() => {
    getCurrentPosition();
    timeoutId.current = setTimeout(function run() {
      getCurrentPosition();
      timeoutId.current = setTimeout(run, 15000);
    }, 15000);
    return () => clearTimeout(timeoutId.current);
  }, [getCurrentPosition]);
  return (
    <VStack maxW="100%" spacing="115px" marginTop="96px !important">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Tezos Mandala: a Generative Art Project on Tezos</title>
        <meta
          name="description"
          content="Create your unique digital mandalas as NFTs. All mandalas are recorded in the Tezos blockchain. This makes them truly decentralized, trustless, and ever-lasting."
        />

        <meta
          property="og:title"
          content="Tezos Mandala: a Generative Art Project on Tezos"
        />
        <meta
          property="og:description"
          content="Create your unique digital mandalas as NFTs. All mandalas are recorded in the Tezos blockchain. This makes them truly decentralized, trustless, and ever-lasting."
        />
        <meta property="og:url" content="http://tezos-mandala.art/" />
      </Helmet>
      <Flex align="center">
        <VStack spacing={8} maxW="100%">
          <Text fontSize="5xl" align="center">
            Tezos Mandala: a Generative Art Project
          </Text>
          {/* <PageHeader></PageHeader> */}
          <Text fontSize="3xl" align="center" fontWeight="300">
            Create your unique digital mandalas as NFTs. All mandalas are
            recorded in the Tezos blockchain. This makes them truly
            decentralized, trustless, and ever-lasting.
          </Text>
          <Flex
            w="100%"
            justify="center"
            display={{ base: "none", md: "flex" }}
          >
            <HashLink to="/#create-mandala">
              <IconButton
                colorScheme="orange"
                isRound
                icon={<ChevronDownIcon w="2em" h="2em" />}
                size="lg"
              />
            </HashLink>
          </Flex>
        </VStack>
      </Flex>
      <Flex minH="100vh" align="center" id="create-mandala" maxW="100%">
        <VStack spacing={8} maxW="100%">
          <Text fontSize="5xl" align="center">
            Create Your Mandala
          </Text>

          <Wrap justify="center" spacing="16px">
            {/* 6 mandalas here */}

            {exampleMandalas.map((src) => (
              <WrapItem w={{ base: "100%", md: "auto" }}>
                <Image
                  src={src}
                  w={{ base: "100%", md: "320px" }}
                  h={{ base: "calc(100vw - 30px)", md: "320px" }}
                />
              </WrapItem>
            ))}
          </Wrap>

          <VStack>
            <Text fontSize="xl" align="center" fontWeight="300">
              Mandala price starts from 5 tez and increases by 5 tez every 100
              mandalas until 600 mandalas are sold.
            </Text>
            <Text fontSize="xl" align="center" fontWeight="300">
              After that, the price increases by 5 tez after 70 mandalas are
              sold. Then the price increases by 5 tez every (N - 5) mandalas,
              where N is the number of mandalas in the previous iteration.
            </Text>
            <Text fontSize="xl" align="center" fontWeight="300">
              The final 5 mandalas will be sold for 100 tez per mandala.
            </Text>
            <Text fontSize="xl" align="center" fontWeight="300">
              Only 1,124 mandalas will be generated overall.
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
                left={`calc(${(nextId / 1124) * 100}% - 7px)`}
              >
                <Text fontSize="xs">{`${1124 - nextId} mandalas left`}</Text>
              </Flex>
              <Flex
                className="current-price"
                position="absolute"
                top="12px"
                left={`calc(${(nextId / 1124) * 100}% - 7px)`}
              >
                <Text fontSize="xs">{`${getPriceFromId(nextId)} tez`}</Text>
              </Flex>
              <Flex
                className="current-pointer"
                position="absolute"
                w="10px"
                h="10px"
                background="red.500"
                borderRadius="100%"
                top="-2.5px"
                left={`${(nextId / 1124) * 100}%`}
              />
            </Flex>
            <Box
              display="flex"
              className="prices"
              w="100%"
              justifyContent="space-around"
              position="relative"
            >
              {range(1, 21).map((stage) => (
                <Flex
                  className={`stage-${stage}-price`}
                  key={stage.toString()}
                  position="absolute"
                  left={
                    stage === 20
                      ? `calc(${(stage / 20) * 100}% - 45px)`
                      : `calc(${(stage / 20) * 100}% - 4%)`
                  }
                  display={stage === 1 || stage === 20 ? "block" : "none"}
                >
                  <Text fontSize="xs">{`${stage * 5} tez`}</Text>
                </Flex>
              ))}
            </Box>
          </VStack>
          <Flex w="100%" justify="center">
            <BuySeedModal />
          </Flex>
        </VStack>
      </Flex>
      <Flex minHeight="100vh" align="center" id="how-it-works">
        <VStack spacing={8}>
          <Text fontSize="5xl" align="center">
            How It Works
          </Text>
          {isMobile ? (
            <Image src={howItWorksMobile} />
          ) : (
            <Image src={howItWorksDesktop} />
          )}
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
              It all started with Carl Jung (
              <Link
                href="https://en.wikipedia.org/wiki/Memories,_Dreams,_Reflections"
                target="_blank"
                rel="noopener noreferrer"
                color="#0a58ca"
                textDecoration="underline"
              >
                Memories, Dreams, Reflections
              </Link>
              , pp. 195–196):
            </Text>
            <Text
              fontSize="lg"
              align="left"
              fontWeight="300"
              fontStyle="italic"
              borderLeft="2px solid var(--chakra-colors-gray-200)"
              paddingLeft="20px"
            >
              "I sketched every morning in a notebook a small circular drawing,
              ... which seemed to correspond to my inner situation at the time.
              ... Only gradually did I discover what the mandala really is: ...
              the Self, the wholeness of the personality, which if all goes well
              is harmonious."
            </Text>

            <Text fontSize="lg" align="left" fontWeight="300">
              For Jung, mandala was a way of interacting with the unconscious, a
              way of plunging into inner self and rebalancing.
            </Text>
            <Text fontSize="lg" align="left" fontWeight="300">
              Jung was talking about physical mandalas a person draws here and
              now. Digital Tezos Mandalas are also drawn by a person here and
              now but this time with their unique hash.
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
                target="_blank"
                rel="noopener noreferrer"
              >
                smart contract
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
              will consist of some kind words. In a month, when you meet your
              mandala, you can rename it. Afterward, you will only be able to
              change its name again once you have owned the mandala for two
              months. Then, you can rename your mandala in 4 months, then in 8
              months, and so on, with the time span doubling after each
              renaming. Tezos Mandalas are not stored on the Amazon cloud and
              not even on IPFS, they are recorded in the Tezos blockchain
              forever. That is why they are truly decentralized and trustless.
            </Text>

            <Text fontSize="lg" align="left" fontWeight="300">
              {`In total, there will be 1,1124 mandalas generated. Mandala seeds will be sold at a gradually increasing price in order to reward early adopters of the project. Right now, ${
                1124 - nextId
              } mandalas left.`}
            </Text>

            <Text fontSize="sm" fontWeight="300">
              Disclaimer: Tezos Mandala is an art experiment with an unaudited
              smart contract aimed at showcasing tools for Tezos, such as
              Beacon, Taquito, etc.
            </Text>

            <Flex w="100%" justify="center">
              <BuySeedModal />
            </Flex>
          </VStack>
        </VStack>
      </Flex>

      <Flex align="center" id="nft-marketplace">
        <VStack spacing={8}>
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
            is a new type of all-pay auction we call Buttonist auction. It will
            be fun, so stay tuned.
          </Text>
        </VStack>
      </Flex>
    </VStack>
  );
};

export default MainPage;
