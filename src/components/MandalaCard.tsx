import { Button } from '@chakra-ui/button';
import { Flex, Text, Box, VStack } from '@chakra-ui/layout';
import React, { useState } from 'react'
import { useApp } from '../state/app';
import sampleMandala from '../assets/img/sample-mandala.svg'
import { Image } from '@chakra-ui/image';
import { getPriceFromId } from '../utils/price';
import pako from 'pako';
import { saveAs } from 'file-saver';
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/alert';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { Spinner } from '@chakra-ui/spinner';
import { debounce } from 'lodash';
import { useDisclosure } from '@chakra-ui/hooks';

const decodeHexToSvg = (hexString: string) => {
    let packed = hexString;
    if (packed.startsWith('0x')) packed = packed.substr(2)
    const bytes = new Uint8Array(packed?.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
    const dec = new TextDecoder('utf-8')
    return dec.decode(pako.ungzip(bytes))
}

const MandalaCard = ({ mandala }) => {
    const { userAddress, convertSeed } = useApp();
    const [status, setStatus] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    console.log({ mandala });

    const isSeed = mandala.rarity === 'Seed';
    const userOwns = mandala.ownerAddress === userAddress

    const showConvertButton = isSeed && userOwns;
    const showDownloadButton = !isSeed && userOwns;

    const handleCreateMandala = async () => {
        setStatus('processing')
        onOpen();
        try {
            const success = await convertSeed(mandala.id);
            if (success) {
                setStatus('success')
                debounce(onClose, 3500)();
            } else {
                setStatus('error')
            }

        } catch (error) {
            setStatus('error')
        }
    }

    let svg = "";
    if (mandala.imageString) {
        svg = decodeHexToSvg(mandala.imageString)
        if (!svg.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            svg = svg.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!svg.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            svg = svg.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        //add xml declaration
        svg = '<?xml version="1.0" standalone="no"?>\r\n' + svg;
    }

    const handleDownload = () => {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        saveAs(blob, `${mandala.name}.svg`);
    }
    return (
        <>
            <Flex w="230px" h="360px" borderRadius="6px"
                background="#ffffff"
                boxShadow="18px 18px 36px #ebebeb,
                     -18px -18px 36px #ffffff"
                flexDirection="column"
            >
                <Flex padding="8px" justify="space-between">
                    <Text fontSize="md" fontWeight="500" color="gray.200">{mandala.id}</Text>
                    <Text fontSize="md" fontWeight="500">{mandala.rarity}</Text>
                </Flex>
                <Flex w="100%" minH="230px" position="relative">
                    {
                        isSeed ? <Image w="100%" h="250px" opacity="0.1" src={sampleMandala} alt="sample" /> : <Box w="100%" h="100%" dangerouslySetInnerHTML={{ __html: svg }} />
                    }
                </Flex>

                <Flex w="100%" justify="center" h="40px" padding="8px">
                    {mandala.name && mandala.name !== "Seed" && <Text isTruncated>{mandala.name}</Text>}
                </Flex>
                <Flex padding="8px" minH="48px" justify="space-between" align="center">
                    <Text fontSize="sm" fontWeight="500">
                        {`${getPriceFromId(mandala.id)}tz`}
                    </Text>
                    {showConvertButton && <Button boxShadow="none" size="sm" background="linear-gradient(145deg, #ffffff, #e6e6e6)" variant="mandala-card" onClick={handleCreateMandala}>Create Mandala</Button>}
                    {showDownloadButton && <Button boxShadow="none" size="sm" background="linear-gradient(145deg, #ffffff, #e6e6e6)" onClick={handleDownload} variant="mandala-card">Download</Button>}
                    {!userOwns && <Text fontSize="xs" w="50%" isTruncated >{mandala.ownerAddress}</Text>}
                </Flex>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={status !== 'processing'} closeOnEsc={status !== 'processing'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Mandala</ModalHeader>
                    {status !== 'processing' && <ModalCloseButton />}
                    <ModalBody>
                        {
                            status === 'processing' && (<VStack spacing={8}>
                                <Text >Please wait...</Text>
                                <Spinner
                                    thickness="4px"
                                    speed="0.65s"
                                    emptyColor="gray.200"
                                    color="orange.500"
                                    size="xl"
                                />
                            </VStack>)
                        }

                        {
                            status === 'success' && (<Alert
                                status="success"
                                variant="subtle"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                height="200px"
                            >
                                <AlertIcon boxSize="40px" mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                    Success!
                            </AlertTitle>
                                <AlertDescription maxWidth="sm">
                                    Your Mandala will appear at My Collection tab in a minute
                            </AlertDescription>
                            </Alert>)
                        }

                        {
                            status === 'error' && (<Alert
                                status="error"
                                variant="subtle"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                height="200px"
                            >
                                <AlertIcon boxSize="40px" mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                    Error
                            </AlertTitle>
                                <AlertDescription maxWidth="sm">
                                    Something went wrong. Please try again
                            </AlertDescription>
                            </Alert>)
                        }

                    </ModalBody>
                    <ModalFooter />
                </ModalContent>
            </Modal>
        </>
    )
}

export default MandalaCard;