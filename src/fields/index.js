export const fields = {
  activity: {
    astart_Date: '',
    bdetails: '',
  },
  car: {
    astart: '',
    bend: '',
    cagency: '',
    dpick_Up_Location: '',
    edetails: '',
    fdrop_Off_Location: '',
  },
  note: {
    anote: '',
  },
  room: {
    astart_Date: '',
    bend_Date: '',
    croom: '',
    ddetails: '',
  },
  travel: {
    astart: '',
    bend: '',
    cdetails: '',
  },
  trip: {
    atrip_Name: '',
    bstart_Date: '',
    cend_Date: '',
    details: '',
  },
};

export const inputType = {
  agency: 'text',
  date: 'date',
  details: 'textarea',
  drop_Off_Location: 'textarea',
  end: 'datetime-local',
  end_Date: 'date',
  note: 'textarea',
  pick_Up_Location: 'textarea',
  room: 'text',
  start: 'datetime-local',
  start_Date: 'date',
  trip_Name: 'text',
};

export const labels = {
  activity: {
    astart_Date: 'aDate',
  },
  car: {
    astart: 'apick_Up_Date_and_Time',
    bend: 'bdrop_Off_Date_and_Time',
  },
  note: {
    anote: 'aNote',
  },
  room: {
    astart_Date: 'acheck_In_Date',
    bend_Date: 'bcheck_Out_Date',
  },
  travel: {
    astart: 'adeparture_Date_and_Time',
    bend: 'barrival_Date_and_Time',
  },
  trip: {
    bstart_Date: 'bstart_Date',
    cend_Date: 'cend_Date',
  },
};
