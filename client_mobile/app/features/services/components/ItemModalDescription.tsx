import {
  Button,
  ButtonText,
  Center,
  CloseIcon,
  Heading,
  Icon,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from '@gluestack-ui/themed';
import React, { FC } from 'react';
import { ActionModelDTO } from '../../../core/models/action';
import { TriggerModelDTO } from '../../../core/models/trigger';

interface ItemModalDescriptionProps {
  item: TriggerModelDTO | ActionModelDTO | null;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const ItemModalDescription: FC<ItemModalDescriptionProps> = ({ item, showModal, setShowModal }) => {
  const ref = React.useRef(null);

  return (
    <Center h={300}>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        finalFocusRef={ref}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">{item?.name}</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text>{item?.description}</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              action="positive"
              borderWidth="$0"
              onPress={() => {
                setShowModal(false);
              }}>
              <ButtonText>Ok</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
};

export default ItemModalDescription;
