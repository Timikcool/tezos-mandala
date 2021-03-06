import { ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, Text, VStack } from "@chakra-ui/layout";
import { Button, IconButton } from "@chakra-ui/react";
import React from "react";
import { HashLink } from "react-router-hash-link";
import Header from "../components/Header";
import PageHeader from "../components/PageHeader";

// const scrollToCreateMandala = document
//   .querySelector("#create-mandala")
//   .scrollIntoView({ behavior: "smooth" });

const MainPage = () => {
  //   const scrollToCreateMandala = document
  //     .querySelector("#create-mandala")
  //     ?.scrollIntoView({ behavior: "smooth" });
  return (
    <VStack>
      <Flex h="calc(100vh - 104px)" align="center">
        <VStack spacing={8}>
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
      <Flex h="100vh" align="center" id="create-mandala">
        <VStack spacing={16}>
          <Text fontSize="5xl" align="center">
            Create Your Mandala
          </Text>
          {/* <PageHeader></PageHeader> */}
          <Text fontSize="3xl" align="center" fontWeight="300">
            Сreate your unique digital mandalas as NFTs. All the mandalas are
            recorded in the Tezos blockchain forever, so that they are truly
            decentralized.
          </Text>
          <Flex w="100%" justify="center">
            <Button colorScheme="orange">Create Mandala</Button>
          </Flex>
        </VStack>
      </Flex>
      <Flex h="100vh" align="center" id="why-tezos-mandala">
        <VStack spacing={16}>
          <Text fontSize="5xl" align="center">
            Why Tezos Mandala
          </Text>
          {/* <PageHeader></PageHeader> */}
          <Text fontSize="lg" fontWeight="300">
            Tezos Mandala это цифровое генеративное искусство. Это эксперимент
            на тему западной психологической интерпретации мандалы. Все началось
            с К. Юнга: I sketched every morning in a notebook a small circular
            drawing, ... which seemed to correspond to my inner situation at the
            time. ... Only gradually did I discover what the mandala really is:
            ... the Self, the wholeness of the personality, which if all goes
            well is harmonious. — Carl Jung, Memories, Dreams, Reflections, pp.
            195–196. Для Юнга мандала это способ взаимодействия с
            бессознательным, способ погружения в себя и ребалансировки. Юнг
            говорил о физических мандалах, которые человек рисует здесь и
            сейчас. Цифровые Tezos Mandalas человек рисует здесь и сейчас своим
            уникальным хешем. Чтобы создать свою мандалу, вам понадобится
            mandala seed. Вы можете сгенерировать мандалу из своего mandala seed
            в любой момент, когда посчитаете нужным. Для этого вам нужно перейти
            в My Collections, выбрать mandala seed и нажать кнопку “create
            mandala”. Вы отправляете транзакцию, и смарт-контракт генерирует
            мандалу из хеша этой транзакции. Ни мы, ни вы, никто не знает, какой
            будет ваша мандала. Мы можем сказать только, что это будет
            уникальная мандала, построенная из элементов разной степени
            редкости. Самые редкие элементы это глаз или знак Tezos в центре
            мандалы. Гамма цветов элементов мандалы связана со значением этих
            элементов, а гамма фона мандалы о цветах экосистемы Tezos. Только
            несколько мандал не будут соответствовать этим правилам. Tezos
            Mandala генерируется с initial name. В нем будут добрые слова. Через
            месяц, когда вы познакомитесь со своей мандалой, вы сможете дать ей
            свое имя. После этого изменить имя мандалы будет сложнее: нужно
            владеть ею без перерыва минимум два месяца. После этого мандалу
            можно будет переименовать через четыре месяца, потом через восемь
            месяцев и так далее - после каждого переименования срок будет
            увеличиваться вдвое. Tezos Mandalas хранятся не в облаке Amazon и
            даже не в IPFS - они навсегда записаны в блокчейн Tezos. Всего будет
            сгенерировано 2000 мандал. Mandala seeds will be sold at increasing
            price to reward early adopters of the project. Для генерации
            осталось [Х] мандал.
          </Text>
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
