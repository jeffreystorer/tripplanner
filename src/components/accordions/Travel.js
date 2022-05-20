import { Link as ReactLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  HStack,
  Link,
  ModalFooter,
  Table,
  Tbody,
  Tr,
  Td,
  VStack,
} from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { labels } from 'fields';
import * as state from 'store';
import { dowMonthDayFromStr } from 'utils';

export default function Travel({ page, data, showModal }) {
  return data?.map((detail, index) => (
    <AccordionItem key={uuidv4()}>
      <h2>
        <AccordionButton id={`heading${index}`}>
          <Box flex="1" textAlign="left">
            {dowMonthDayFromStr(Object.values(detail)[0], 'short')}
            {'  '}
            {Object.values(detail)[0].substring(11)}
            {'  '}
            {' -> '}
            {dowMonthDayFromStr(Object.values(detail)[0], 'short') !==
              dowMonthDayFromStr(Object.values(detail)[1], 'short') &&
              dowMonthDayFromStr(Object.values(detail)[1], 'short') + '  '}
            {Object.values(detail)[1].substring(11)}
            {'  '}
            {Object.values(detail)[2]}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <VStack gap={1}>
          <Table variant="simple">
            <Tbody>
              {Object.keys(detail).map((key, index) => {
                let formLabel = '';
                if (!labels[page].hasOwnProperty(key)) {
                  formLabel =
                    key.charAt(1).toUpperCase() +
                    key.slice(2).replaceAll('_', ' ');
                } else {
                  formLabel =
                    labels[page][key].charAt(1).toUpperCase() +
                    labels[page][key].slice(2).replaceAll('_', ' ');
                }
                if (key !== 'key') {
                  if (key.includes('start') || key.includes('end')) {
                    return (
                      <Tr key={uuidv4()}>
                        <Td>{formLabel}</Td>
                        <Td>{detail[key].replaceAll('T', ' ')}</Td>
                      </Tr>
                    );
                  } else {
                    return (
                      <Tr key={uuidv4()}>
                        <Td>{formLabel}</Td>
                        <Td>{detail[key]}</Td>
                      </Tr>
                    );
                  }
                } else {
                  return null;
                }
              })}
            </Tbody>
          </Table>

          <ModalFooter>
            <HStack gap={5}>
              <Link as={ReactLink} to={`/pages/edit${page}/${index}`}>
                <Button colorScheme="blue">Edit</Button>
              </Link>
              <Button colorScheme="gray" onClick={() => showModal(index)}>
                Delete
              </Button>
            </HStack>
          </ModalFooter>
        </VStack>
      </AccordionPanel>
    </AccordionItem>
  ));
}
