import { Fragment}  from 'react';
import { useRecoilValue } from 'recoil';
import Textarea from 'react-expanding-textarea';
import { inputType, labels } from '@/fields';
import * as state from '@/store';

//handleDelete is optional - the Delete button only renders when a caller
//passes one, so existing callers are unaffected
export default function AddEdit({
  mode,
  data,
  page,
  handleSubmit,
  handleChange,
  handleCancel,
  handleDelete,
}) {
  const currentTrip = useRecoilValue(state.currentTrip);
  const width = window.innerWidth;
  const maxCols = width / 10;
  const cols = (maxCols < 70) ? maxCols : 70;
  
  let header;
  if (page === 'trip') {
    header = (
      <h2>
        {mode} Trip
      </h2>
    );
  } else {
    header = (
      <h2>
        {mode} {page.charAt(0).toUpperCase() + page.slice(1)}<br />
        {currentTrip.atrip_Name}
      </h2>
    );
  }

  function formItem(keyItem) {
    //fall back to the field name when this page has no label override - or no
    //labels entry at all, which is what used to throw for a new detail type.
    //both sources get the same transform: drop the sort-order prefix letter,
    //capitalise, and turn underscores into spaces
    const rawLabel = labels[page]?.[keyItem] ?? keyItem;
    const inputLabel =
      rawLabel.charAt(1).toUpperCase() + rawLabel.slice(2).replaceAll('_', ' ');

    const resolvedType =
      page === 'trip' && keyItem !== 'atrip_Name'
        ? 'date'
        : inputType[keyItem.slice(1)];
    //links use a plain text input so an address or place name can be typed;
    //type='url' would fail native validation on anything but a real URL
    const isLink = resolvedType === 'url';

    if (inputType[keyItem.slice(1)] === 'textarea') {
      return (
        <Fragment key={keyItem}>
          <label htmlFor={keyItem}>
            {inputLabel}
          </label>
          <Textarea
            cols={cols}
            rows="4"
            //htmlFor on the label pairs with id, not name
            id={keyItem}
            name={keyItem}
            defaultValue={data[keyItem]}
            onBlur={handleChange}
          />
        </Fragment>
      );
    } else {
      return (
        <Fragment key={keyItem}>
          <label htmlFor={keyItem}>
            {inputLabel}
          </label>
          <input
            //autocomplete only accepts values from a fixed HTML list, and none
            //of these fields (trip names, dates, agencies, links) maps onto
            //one. Field names like 'atrip_Name' are non-standard and browsers
            //ignore them anyway, so ask for no autofill at all.
            autoComplete='off'
            //htmlFor on the label pairs with id, not name
            id={keyItem}
            name={keyItem}
            type={isLink ? 'text' : resolvedType}
            autoCapitalize={isLink ? 'off' : undefined}
            autoCorrect={isLink ? 'off' : undefined}
            spellCheck={isLink ? false : undefined}
            placeholder={
              isLink ? 'Paste a Maps link, or type an address' : undefined
            }
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
            {handleDelete && (
              <button className='not-stacked' onClick={handleDelete}>
                Delete
              </button>
            )}
        </footer>
      </section>
    </div>
  );
}
