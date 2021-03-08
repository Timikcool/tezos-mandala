import { Button } from '@chakra-ui/button';
import { Flex, Text } from '@chakra-ui/layout';
import React from 'react'
import { useApp } from '../state/app';
import sampleMandala from '../assets/img/sample-mandala.svg'
import { Image } from '@chakra-ui/image';

const MandalaCard = ({ mandala }) => {
    const { userAddress } = useApp();
    console.log({ mandala });

    const isSeed = mandala.rarity === 'Seed';
    const userOwns = mandala.ownerAddress === userAddress

    const showConvertButton = isSeed && userOwns;
    const showDownloadButton = !isSeed && userOwns;
    return (
        <Flex w="250px" h="346px" borderRadius="6px"
            background="#ffffff"
            boxShadow="18px 18px 36px #ebebeb,
                     -18px -18px 36px #ffffff"
            flexDirection="column"
        >
            <Flex padding="8px" justify="flex-end">
                <Text fontSize="md" fontWeight="500">{mandala.rarity}</Text>
            </Flex>
            <Flex w="100%" h="250px">
                {
                    isSeed ? <Image w="100%" h="100%" opacity="0.1" src={sampleMandala} alt="sample" /> : mandala.id
                }
            </Flex>
            <Flex padding="8px" justify="flex-end" h="56px" align="center">
                {showConvertButton && <Button boxShadow="none" background="linear-gradient(145deg, #ffffff, #e6e6e6)" variant="mandala-card">Create Mandala</Button>}
                {showDownloadButton && <Button boxShadow="none" background="linear-gradient(145deg, #ffffff, #e6e6e6)" variant="mandala-card">Download</Button>}
                {!userOwns && <Text fontSize="xs" w="50%" isTruncated >{mandala.ownerAddress}</Text>}
            </Flex>
        </Flex>
    )
}

export default MandalaCard;