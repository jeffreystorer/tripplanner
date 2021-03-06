import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  Container,
  HStack,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { DetailButtons } from 'components/common';

export default function Details({
  accordionKey,
  items,
  currentTripName,
  page,
}) {
  const navigate = useNavigate();
  const labels = {
    activity: 'Activities',
    car: 'Cars',
    note: 'Trip Notes',
    room: 'Rooms',
    travel: 'Travels',
  };
  return (
    <Container
      key={accordionKey}
      style={{
        minWidth: '100vw',
      }}
    >
      <VStack gap={1}>
        <br />
        <Text>
          <strong>{currentTripName}</strong>
        </Text>
        <DetailButtons />
        <h2 className="text-center">
          <HStack gap={5}>
            <Text>{labels[page]}</Text>
            <IconButton
              onClick={() => navigate(`/pages/add${page}`)}
              icon={<AddIcon />}
            />
          </HStack>
        </h2>
        ;
        <Accordion defaultIndex={[]} allowMultiple allowToggle>
          {items}
        </Accordion>
      </VStack>
    </Container>
  );
}
