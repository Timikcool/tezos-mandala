import { Flex, HStack, Text, VStack, Wrap, WrapItem } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { Spinner } from "@chakra-ui/spinner";
import { orderBy, sortBy, startCase } from "lodash";
import React, { useState, ChangeEvent, useEffect } from "react";
import RaritySelector from "../components/RaritySelector";
import { getBigMapKeys, getContractStorage } from "../service/bcd";
import config from "../config.json";
import selectObjectByKeys from "../utils/selectObjectByKeys";
import MandalaCard from "../components/MandalaCard";

const sortBySorter = (mandalas, sorter) => {
  if (sorter === "new") {
    return orderBy(mandalas, "timestamp", ["desc"]);
  }

  if (sorter === "price") {
    return mandalas;
  }

  if (sorter === "rarity") {
    const orderedRarities = ["tezos", "eye", "unique", "seed"];
    return sortBy(mandalas, (mandala) =>
      orderedRarities.indexOf(mandala.rarity.toLowerCase())
    );
  }
};

export const ExplorePage = () => {
  const [rarityFilter, setRarityFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [filteredMandalas, setFilteredMandalas] = useState([]);
  const [totalMandalas, setTotalMandalas] = useState([]);
  const [sort, setSort] = useState("new");

  const getStorage = async () => {
    setLoading(true);
    try {
      const storage = await getContractStorage(config.contract);
      const tokensMapId = selectObjectByKeys(storage, {
        type: "big_map",
        name: "token_metadata",
      })?.value;
      const ownersMapId = selectObjectByKeys(storage, {
        type: "big_map",
        name: "ledger",
      })?.value;
      const [tokens, owners] = await Promise.all([
        getBigMapKeys(tokensMapId, 2000),
        getBigMapKeys(ownersMapId, 2000),
      ]);

      const totalMandalas = tokens.reduce((acc, token) => {
        //   const id = selectObjectByKeys(token, {type:'nat', name:'key'})
        const id = token.data.key_string;
        if (id === "0") return acc;

        const timestamp = token.data.timestamp;
        const rarity = selectObjectByKeys(token.data.value, {
          type: "bytes",
          name: "name",
        })?.value?.replace(/['"]+/g, "");
        const hash = token.data.key_hash;
        const owner = owners.find(
          (owner) =>
            selectObjectByKeys(owner.data.key, {
              type: "nat",
              name: "token_id",
            })?.value === id
        );
        const ownerAddress = selectObjectByKeys(owner?.data.key, {
          type: "address",
          name: "owner",
        }).value;

        return [...acc, { id, timestamp, rarity, hash, ownerAddress }];
      }, []);

      // const keys = await get;
      console.log({ storage, tokens, owners, totalMandalas });
      setTotalMandalas(totalMandalas);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => getStorage(), []);

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
            <Text fontSize="lg" align="left" fontWeight="300" w="65px">
              Sort by:
            </Text>
            <Select
              variant="flushed"
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSort(e.target.value)
              }
              w="75px"
            >
              <option value="new" key="new">
                new
              </option>
              <option value="rarity" key="rarity">
                rarity
              </option>
              <option value="price" key="price">
                price
              </option>
            </Select>
          </HStack>

          <Wrap spacing="30px" justify="center" w="100%">
            {filteredMandalas.map((mandala) => (
              <WrapItem>
                <MandalaCard mandala={mandala} />
              </WrapItem>
            ))}
          </Wrap>
        </>
      )}
    </VStack>
  );
};
