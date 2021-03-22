import { Flex, HStack, Text, VStack, Wrap, WrapItem } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { Spinner } from "@chakra-ui/spinner";
import { isObjectLike, orderBy, sortBy, startCase } from "lodash";
import React, {
  useState,
  ChangeEvent,
  useEffect,
  useCallback,
  useRef,
} from "react";
import RaritySelector from "../components/RaritySelector";
import { getBigMapKeys, getContractStorage } from "../service/bcd";
import config from "../config.json";
import selectObjectByKeys from "../utils/selectObjectByKeys";
import MandalaCard from "../components/MandalaCard";
import { processMandalas } from "../utils/data";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useApp } from "../state/app";
import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";
import axios from "axios";
import BuySeedModal from "../components/BuySeedModal";
import { Helmet } from "react-helmet";

const sortBySorter = (mandalas, sorter) => {
  if (sorter === "new") {
    return orderBy(mandalas, (mandala) => parseInt(mandala?.id || 0), ["desc"]);
  }

  if (sorter === "price") {
    return mandalas;
  }

  if (sorter === "rarity") {
    const orderedRarities = ["tezos", "eye", "unique", "seed"];
    return sortBy(mandalas, (mandala) =>
      orderedRarities.indexOf(mandala?.rarity?.toLowerCase())
    );
  }
};

export const ExplorePage = () => {
  const [rarityFilter, setRarityFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [filteredMandalas, setFilteredMandalas] = useState([]);
  const [totalMandalas, setTotalMandalas] = useState([]);
  const [sort, setSort] = useState("rarity");
  const timeoutId = useRef(null);

  const getStorage = useCallback(
    async (toggleLoading = true) => {
      toggleLoading && setLoading(true);
      try {
        const response = await axios.get(config.tokensCache);
        console.log({ response });
        if (!isObjectLike(response?.data)) {
          throw new Error("Bad cache data");
        }
        const totalMandalas = processMandalas(response.data);
        setTotalMandalas(totalMandalas);
        toggleLoading && setLoading(false);
      } catch (error) {
        console.log(error);
        toggleLoading && setLoading(false);
      }
    },
    [setLoading, setTotalMandalas]
  );

  useEffect(() => {
    getStorage();
    timeoutId.current = setTimeout(function run() {
      getStorage(false);
      timeoutId.current = setTimeout(run, 15000);
    }, 15000);
    return () => clearTimeout(timeoutId.current);
  }, [getStorage]);

  useEffect(() => {
    // * filter mandalas by filter
    if (rarityFilter === "all") {
      setFilteredMandalas(sortBySorter(totalMandalas, sort));
    } else {
      setFilteredMandalas(
        sortBySorter(
          totalMandalas.filter(
            (mandala) => mandala.rarity.toLowerCase() === rarityFilter
          ),
          sort
        )
      );
    }
    // * sort mandalas by sort
  }, [sort, rarityFilter, totalMandalas]);
  return (
    <VStack spacing={16} w="100%">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Tezos Mandala: Explore Mandalas on Tezos</title>
        <meta
          name="description"
          content="Explore all Tezos Mandalas. All mandalas are recorded in the Tezos blockchain. This makes them truly decentralized, trustless, and ever-lasting."
        />

        <meta
          property="og:title"
          content="Tezos Mandala: Explore Mandalas on Tezos"
        />
        <meta
          property="og:description"
          content="Explore all Tezos Mandalas. All mandalas are recorded in the Tezos blockchain. This makes them truly decentralized, trustless, and ever-lasting."
        />
        <meta property="og:url" content="http://tezos-mandala.art/explore" />
      </Helmet>
      <Text fontSize="5xl" align="center">
        Explore Mandalas
      </Text>

      {loading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="orange.500"
          size="xl"
        />
      ) : (
        <>
          <RaritySelector onChange={setRarityFilter} value={rarityFilter} />
          <Flex justify="center" w="100%">
            <Text align="center" fontSize="3xl">
              {`${startCase(rarityFilter)} (${filteredMandalas.length})`}
            </Text>
          </Flex>

          <HStack spacing={4} w="100%">
            {filteredMandalas.length > 0 ? (
              <>
                <Text fontSize="lg" align="left" fontWeight="300" w="65px">
                  Sort by:
                </Text>
                <Select
                  variant="unstyled"
                  color="orange.500"
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setSort(e.target.value)
                  }
                  w="75px"
                >
                  <option value="rarity" key="rarity">
                    rarity
                  </option>
                  <option value="new" key="new">
                    new
                  </option>
                  {/* <option value="price" key="price">
                    price
                  </option> */}
                </Select>
              </>
            ) : (
              <VStack w="100%" spacing={4}>
                <Text fontSize="xl">No mandalas found :(</Text>
                <BuySeedModal />
              </VStack>
            )}
          </HStack>

          <Wrap spacing="30px" justify="start" w="100%">
            {filteredMandalas.map((mandala) => (
              <WrapItem key={mandala.id} w={{ base: "100%", md: "auto" }}>
                <MandalaCard mandala={mandala} />
              </WrapItem>
            ))}
          </Wrap>
        </>
      )}
    </VStack>
  );
};
