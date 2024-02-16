import { Fragment}  from 'react';
import { useRecoilValue } from 'recoil';
import Textarea from 'react-expanding-textarea';
import { v4 as uuidv4 } from 'uuid';
import { inputType, labels } from '@/fields';
import * as state from '@/store';

export default function AddEdit({
  mode,
  data,
  page,
  handleSubmit,
  handleChange,
  handleCancel,
}) {
  const currentTrip = useRecoilValue(state.currentTrip);
  const width = window.innerWidth;
  const maxCols = width / 10;
  const cols = (maxCols < 70) ? maxCols : 70;
  
  let header;
  if (page === 'trip') {
    header = (
      <h2 key={uuidv4()}>
        {mode} Trip
      </h2>
    );
  } else {
    header = (
      <h2 key={uuidv4()}>
        {mode} {page.charAt(0).toUpperCase() + page.slice(1)}<br />
        {currentTrip.atrip_Name}
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
        <Fragment key={uuidv4()}>
          <label key={uuidv4()} htmlFor={keyItem}>
            {inputLabel}
          </label>
          <Textarea
            key={uuidv4()}
            cols={cols}
            rows="4"
            name={keyItem}
            defaultValue={data[keyItem]}
            onBlur={handleChange}
          />
        </Fragment>
      );
    } else {
      return (
        <Fragment key={uuidv4()}>
          <label key={uuidv4()} htmlFor={keyItem}>
            {inputLabel}
          </label>
          <input
            key={uuidv4()}
            autoComplete={keyItem}
            name={keyItem}
            type={page === 'trip' && keyItem !=='atrip_Name' ? 'date': inputType[keyItem.slice(1)]}
            defaultValue={page === 'trip' && keyItem !=='atrip_Name' ? data[keyItem].substring(0,10) : data[keyItem]}
            onBlur={handleChange}
          />
        </Fragment>
      );
    }
  }

  const inputs = Object.keys(data).map(keyItem => {
    if (keyItem !== 'key' && keyItem !== 'details' && keyItem !=='dprint_Date') {
      return formItem(keyItem);
    } else {
      return null;
    }
  });

  return (
    <div id='add-edit'>
      <section>
        <header>
          {header}
        </header>
        <form>
          <fieldset>
            {inputs}
          </fieldset>          
        </form>
        <footer>
            <button className='not-stacked' onClick={handleCancel}>
              Cancel
            </button>
            <button className='not-stacked' onClick={handleSubmit}>
              Save
            </button>
        </footer>
      </section>
    </div>
  );
}
