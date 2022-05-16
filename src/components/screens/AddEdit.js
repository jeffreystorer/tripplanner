import { useRecoilValue } from 'recoil';
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { inputType, labels } from 'fields';
import * as state from 'store';

export default function AddEdit({
  mode,
  data,
  page,
  handleSubmit,
  handleChange,
  handleClickCancel,
}) {
  console.log('🚀 ~ file: AddEdit.js ~ line 23 ~ data', data);

  const currentTrip = useRecoilValue(state.currentTrip);

  let header;
  if (page === 'trip') {
    header = <h2 className="text-center">{mode} Trip</h2>;
  } else {
    header = (
      <h2 className="text-center">
        {mode} {page.charAt(0).toUpperCase() + page.slice(1)} for{' '}
        {currentTrip.atrip_Name} Trip
      </h2>
    );
  }

  function formItem(keyItem) {
    let inputLabel = '';
    if (!labels[page].hasOwnProperty(keyItem)) {
      inputLabel =
        keyItem.charAt(1).toUpperCase() + keyItem.slice(2).replaceAll('_', ' ');
    } else {
      inputLabel =
        labels[page][keyItem].charAt(1).toUpperCase() +
        labels[page][keyItem].slice(2).replaceAll('_', ' ');
    }

    if (inputType[keyItem.slice(1)] === 'textarea') {
      return (
        <>
          <FormLabel htmlFor={keyItem}>{inputLabel}</FormLabel>
          <Textarea
            name={keyItem}
            value={data[keyItem]}
            onChange={e => handleChange(e)}
            size="sm"
          />
        </>
      );
    } else {
      return (
        <>
          <FormLabel htmlFor={keyItem}>{inputLabel}</FormLabel>
          <Input
            autoComplete={keyItem}
            name={keyItem}
            type={inputType[keyItem.slice(1)]}
            value={data[keyItem]}
            onChange={e => handleChange(e)}
          />
        </>
      );
    }
  }

  const inputs = Object.keys(data).map(keyItem => {
    if (keyItem !== 'key' && keyItem !== 'details') {
      return formItem(keyItem);
    } else {
      return null;
    }
  });

  return (
    <>
      <Container>
        <VStack gap={1}>
          {header}
          <FormControl>{inputs}</FormControl>
          <br />
          <HStack gap={5}>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Save
            </Button>
            <Button colorScheme="gray" onClick={handleClickCancel}>
              Cancel
            </Button>
          </HStack>
        </VStack>
      </Container>
      <br />
      <br />
    </>
  );
}
