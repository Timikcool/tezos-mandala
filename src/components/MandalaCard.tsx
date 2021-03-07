import { Box, Flex, Text } from '@chakra-ui/layout';
import React from 'react'

const MandalaCard = ({ mandala }) => {
    return (
        <Flex w="250px" h="310px" borderRadius="6px"
            background="#ffffff"
            boxShadow="18px 18px 36px #ebebeb,
                     -18px -18px 36px #ffffff">
            <Flex>
                <Text fontSize="sm">{mandala.rarity}</Text>
            </Flex>
            <Flex w="100%" h="250px">
                {mandala.id}
            </Flex>
            <Flex>
                Functions
            </Flex>
        </Flex>
    )
}

export default MandalaCard;