import { Button } from '@chakra-ui/button';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { Input, Radio, RadioGroup, Spinner, Stack, Text, useToast, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useApp } from '../state/app';
import { migrationContract } from '../config.json'

const MigratingMandalaModal = () => {
    const { migratingMandala, setMigratingMandala, contract: contractInstance, setupContract, userAddress, Tezos } = useApp();
    const [migrating, setMigrating] = useState(false);
    const [transferAddress, setTransferAddress] = useState(null);
    const [migrateOption, setMigrateOption] = useState('0')
    const toast = useToast();
    const handleMigrate = async () => {
        setMigrating(true);
        try {
            const contract = contractInstance || await setupContract();
            const migrationContractInstance = await Tezos.wallet.at(migrationContract);
            const updateOperatorsOperation = await contract.methods.update_operators([
                {
                    add_operator: {
                        owner: userAddress,
                        operator: migrationContract,
                        token_id: migratingMandala.id,
                    },
                },
            ]).send();
            await updateOperatorsOperation.confirmation(3);
            const op = await migrationContractInstance.methods.migrate_seed(migrateOption, migratingMandala.id).send();
            toast({
                title: "Transaction was sent",
                description: "The transaction was sent and should be confirmed in a minute.",
                status: "success",
                duration: 3500,
                isClosable: true,
                position: "top-right"
            });
            setMigrating(false);
            setMigratingMandala(null);
            op.confirmation().then(() => {
                toast({
                    title: "Mandala was migrated",
                    description: "Your Mandala was successfully migrated.",
                    status: "success",
                    duration: 3500,
                    isClosable: true,
                    position: "top-right"
                });
            })
        } catch (error) {
            console.log(error)
        } finally {
            setMigratingMandala(null);
            setMigrating(false);
        }

    }
    if (!migratingMandala) return null;
    const isSeed = migratingMandala.rarity === 'Seed';
    return (
        <Modal isOpen onClose={() => setMigratingMandala(null)} isCentered >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader isTruncated>{`Migrate #${migratingMandala.id} mandala`}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {
                        migrating ? (<VStack spacing={8}>
                            <Text >Please wait...</Text>
                            <Spinner
                                thickness="4px"
                                speed="0.65s"
                                emptyColor="gray.200"
                                color="orange.500"
                                size="xl"
                            />
                        </VStack>) :
                            (<VStack spacing={4}>
                                <RadioGroup onChange={val => setMigrateOption(val as string)} value={migrateOption}>
                                    <Stack direction="column">
                                        <Radio value="1" disabled={isSeed}>Migrate your mandala</Radio>
                                        <Text size="sm">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis dolorem blanditiis quis magnam corrupti aliquid, minus eligendi porro explicabo cumque repudiandae, ut quibusdam perspiciatis quasi laudantium deserunt labore et alias.
                        </Text>
                                        <Radio value="0">Get new mandala seed</Radio>
                                        <Text size="sm">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis dolorem blanditiis quis magnam corrupti aliquid, minus eligendi porro explicabo cumque repudiandae, ut quibusdam perspiciatis quasi laudantium deserunt labore et alias.
                        </Text>
                                        <Radio value="2" >Get refund</Radio>
                                        <Text size="sm">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis dolorem blanditiis quis magnam corrupti aliquid, minus eligendi porro explicabo cumque repudiandae, ut quibusdam perspiciatis quasi laudantium deserunt labore et alias.
                        </Text>
                                    </Stack>
                                </RadioGroup>


                            </VStack>)}
                </ModalBody>

                <ModalFooter>

                    <Button variant="outline"
                        colorScheme="black"
                        border="none" onClick={handleMigrate} _focus={{ background: '#e2e8f0' }} >Migrate</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default MigratingMandalaModal;