import { Button } from '@chakra-ui/button';
import { Flex, Text, Box, VStack, Link } from '@chakra-ui/layout';
import React, { useEffect, useRef, useState } from 'react'
// import { useApp } from '../state/app';
import sampleMandala from '../assets/img/sample-mandala.svg'
import { Image } from '@chakra-ui/image';
import { getPriceFromId } from '../utils/price';
import pako from 'pako';
import config from '../config.json';
import { saveAs } from 'file-saver';
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/alert';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { Spinner } from '@chakra-ui/spinner';
import { debounce, get } from 'lodash';
import { useDisclosure } from '@chakra-ui/hooks';
import axios from 'axios';
import { useApp } from '../state/app';
// import { saveSvgAsPng } from 'save-svg-as-png';
import Canvg, { presets, RenderingContext2D } from 'canvg';
import { useToast } from '@chakra-ui/toast';
import { shortage } from '../utils/shortage';

const decodeHexToSvg = (hexString: string) => {
    let packed = hexString;
    if (packed.startsWith('0x')) packed = packed.substr(2)
    const bytes = new Uint8Array(packed?.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
    const dec = new TextDecoder('utf-8')
    return dec.decode(pako.ungzip(bytes))
}

const savePng = async (svg: string, name: string) => {
    const canvas = new OffscreenCanvas(2000, 2000);
    const ctx = canvas.getContext('2d') as RenderingContext2D;
    const v = await Canvg.from(ctx, svg, presets.offscreen());

    // Render only first frame, ignoring animations and mouse.
    await v.render();
    const blob = await canvas.convertToBlob();
    saveAs(blob, `${name}.png`);
}

const MandalaCard = ({ mandala }) => {
    const { contract: contractInstance, setupContract, userAddress, openSendModal } = useApp()
    const [status, setStatus] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [errorDescription, setErrorDescription] = useState(null);
    const toast = useToast();
    const timeoutId = useRef(null);

    useEffect(() => {
        if (status === 'success') {
            const newTimeoutId = setTimeout(() => {
                console.log({ isOpen, status });

                if (isOpen) {
                    onClose();
                    setStatus(null);
                }
            }, 5000);
            timeoutId.current = newTimeoutId
        } else {
            clearTimeout(timeoutId.current)
        }
    }, [status])

    const isSeed = mandala.rarity === 'Seed';
    const userOwns = mandala.ownerAddress === userAddress

    const showConvertButton = isSeed && userOwns;
    const showDownloadButton = !isSeed && userOwns;

    const handleCreateMandala = async () => {
        setStatus('processing')
        onOpen();

        try {
            const response = await axios.get(`${config.tokenService}/json/${mandala.id}`);
            const { data, signature } = response.data;
            const contract = contractInstance || await setupContract();
            const op = await contract.methods.render(mandala.id, data, signature).send();
            setStatus('success');
            await op.confirmation();
            toast({
                title: "Mandala was created",
                description: "Your Mandala was successfully created from the Mandala Seed. Check it in the My Collection tab.",
                status: "success",
                duration: 3500,
                isClosable: true,
                position: "top-right"
            });

        } catch (error) {
            console.log(error);
            if (error?.title === 'Aborted') {
                setStatus('initial');
                onClose();
                return;
            }

            if (error?.name === "MissedBlockDuringConfirmationError") {
                setStatus('error')
                return setErrorDescription('This thing is that it takes some time to confirm your previous operation. Please try again in a minute. It should work OK then.')
            }


            if (error?.name === 'BeaconWalletNotInitialized') {
                setStatus('error');
                return setErrorDescription("Tezos wallet didn't make it this time. Please refresh a page and try again")
            }

            const additional = get(error, 'data[1].with.string', '')

            if (additional === 'MINTED_ALREADY') {
                setStatus('error')
                return setErrorDescription('Mandala has already been created')
            }

            const errorString = error?.title ? `${error.title} ${additional}` : JSON.stringify(error);
            setStatus('error')
            setErrorDescription(errorString)
        }
    }

    let svg = "";
    let base = '';
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
        base = window.btoa(svg);
    }

    const handleDownload = () => {
        savePng(svg, mandala.name)
    }

    const handleSend = () => {
        openSendModal(mandala);
    }
    return (
        <>
            <Flex w={{ base: '100%', md: '310px' }} h={{ base: 'auto', md: '440px' }} borderRadius="6px"
                background="#ffffff"
                boxShadow="18px 18px 36px #ebebeb,
                     -18px -18px 36px #ffffff"
                flexDirection="column"
            >
                <Flex padding="8px" justify="space-between">
                    <Text fontSize="md" fontWeight="500" color="gray.200">{mandala.id}</Text>
                    <Text fontSize="md" fontWeight="500">{mandala.rarity}</Text>
                </Flex>
                <Flex w="100%" minH="310px" position="relative">
                    {
                        isSeed ? <Image w="100%" h="250px" opacity="0.1" src={sampleMandala} alt="sample" /> : <Box w="100%" h={{ base: "calc(100vw - 30px)", md: 'auto' }} backgroundImage={`url(data:image/svg+xml;base64,${base})`} />
                    }
                </Flex>

                <Flex w="100%" justify="center" h="40px" padding="8px">
                    {mandala.name && mandala.name !== "Seed" && <Text isTruncated fontSize="12px">{mandala.name}</Text>}
                </Flex>
                <Flex padding="8px" minH="48px" justify="space-between" align="center">
                    {userOwns ? <Button boxShadow="none" size="sm"
                        background="linear-gradient(145deg, #ffffff, #e6e6e6)" variant="mandala-card" onClick={handleSend}>Send</Button> :
                        <Text fontSize="sm" fontWeight="500">
                            {`${getPriceFromId(parseInt(mandala.id) + 1)} tez`}
                        </Text>}
                    {showConvertButton && <Button boxShadow="none" size="sm" background="linear-gradient(145deg, #ffffff, #e6e6e6)" variant="mandala-card" onClick={handleCreateMandala}>Create Mandala</Button>}
                    {showDownloadButton && <Button boxShadow="none" size="sm" background="linear-gradient(145deg, #ffffff, #e6e6e6)" onClick={handleDownload} variant="mandala-card">Download</Button>}
                    {!userOwns && <a target="_blank" rel="noreferrer noopener" href={`https://better-call.dev/${config.network}/${mandala.ownerAddress}/`}> <Text fontSize="xs">{
                        shortage(mandala.ownerAddress)}</Text> </a>}
                </Flex>
            </Flex>
            <Modal isOpen={isOpen} onClose={() => {
                setStatus(null);
                onClose();
            }} isCentered closeOnOverlayClick={status !== 'processing'} closeOnEsc={status !== 'processing'}>
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
                                borderRadius="6px"
                            >
                                <AlertIcon boxSize="40px" mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                    Transaction was sent
                            </AlertTitle>
                                <AlertDescription maxWidth="sm">
                                    Your transaction was successfully sent and should be confirmed in a minute. Once it’s confirmed, your Mandala will appear in the My Collection tab.
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
                                borderRadius="6px"
                            >
                                <AlertIcon boxSize="40px" mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                    Oops! Blockchain didn't make it this time.
                            </AlertTitle>
                                <AlertDescription maxWidth="sm">
                                    {errorDescription || 'Something went wrong. Please try again'}
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