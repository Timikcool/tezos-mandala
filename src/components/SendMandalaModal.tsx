import { Button } from '@chakra-ui/button';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { Input, Text, useToast, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useApp } from '../state/app';

const SendMandalaModal = () => {
    const { closeSendModal, mandalaToSend, contract: contractInstance, setupContract, userAddress } = useApp();
    const [transferring, setTransferring] = useState(false);
    const [transferAddress, setTransferAddress] = useState(null);
    const toast = useToast();
    const handleSend = async () => {
        setTransferring(true);
        try {
            const contract = contractInstance || await setupContract();
            const op = await contract.methods.transfer([{ from_: userAddress, txs: [{ to_: transferAddress, token_id: mandalaToSend.id, amount: "1" }] }]).send();
            toast({
                title: "Transaction was sent",
                description: "The transaction was sent and should be confirmed in a minute.",
                status: "success",
                duration: 3500,
                isClosable: true,
                position: "top-right"
            });
            setTransferAddress(null);
            closeSendModal();
            op.confirmation().then(() => {
                toast({
                    title: "Mandala was sent",
                    description: "Your Mandala was successfully sent.",
                    status: "success",
                    duration: 3500,
                    isClosable: true,
                    position: "top-right"
                });
            })
        } catch (error) {

        } finally {
            setTransferAddress(null);
            setTransferring(false);
        }

    }
    if (!mandalaToSend) return null;
    return (
        <Modal isOpen={mandalaToSend} onClose={closeSendModal} isCentered >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader isTruncated>{`Send #${mandalaToSend.id} mandala`}</ModalHeader>
                <ModalCloseButton />
                <ModalBody >

                    <VStack spacing={4}>

                        <Text mb="8px">Transfer address:</Text>
                        <Input
                            value={transferAddress}
                            onChange={e => setTransferAddress(e.target.value)}
                            placeholder="tz...."
                            size="md"
                            colorScheme="orange.500"
                            _focus={{ borderColor: "orange.500", boxShadow: '0 0 0 1px var(--chakra-colors-orange-500)' }}
                        />

                        <Text>
                            <Text fontWeight="bold" display="inline">Important: </Text>Please don't send your Mandala to an exchange account as this can result in the loss of your Mandala
                    </Text>
                    </VStack>
                </ModalBody>

                <ModalFooter>

                    <Button variant="outline"
                        colorScheme="black"
                        border="none" onClick={handleSend} _focus={{ background: '#e2e8f0' }} >Send</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default SendMandalaModal;