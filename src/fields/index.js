export const fields = {
  activity: {
    astart_Date: "",
    bdetails: "",
  },
  car: {
    astart: "",
    bend: "",
    cagency: "",
    dpick_Up_Location: "",
    edetails: "",
    fdrop_Off_Location: "",
  },
  map: {
    astart_Date: "",
    bdescription: "",
    cmap_Link: "",
  },
  note: {
    anote: "",
  },
  room: {
    astart_Date: "",
    bend_Date: "",
    croom: "",
    ddetails: "",
  },
  transport: {
    astart: "",
    bend: "",
    cdetails: "",
  },
  trip: {
    atrip_Name: "",
    bstart_Date: "",
    cend_Date: "",
    details: "",
  },
};

export const inputType = {
  agency: "text",
  date: "date",
  description: "text",
  details: "textarea",
  drop_Off_Location: "textarea",
  end: "datetime-local",
  end_Date: "datetime-local",
  map_Link: "url",
  note: "textarea",
  pick_Up_Location: "textarea",
  room: "text",
  start: "datetime-local",
  start_Date: "datetime-local",
  trip_Name: "text",
};

export const labels = {
  activity: {
    astart_Date: "aDate",
  },
  car: {
    astart: "apick_Up_Date_and_Time",
    bend: "bdrop_Off_Date_and_Time",
  },
  map: {
    astart_Date: "aDate_and_Time",
    //the stored key stays cmap_Link (renaming it would need a data migration);
    //this only changes what the form shows, since a link may be a map, an
    //email, or any web page
    cmap_Link: "cLink",
  },
  note: {
    anote: "aNote",
  },
  room: {
    astart_Date: "acheck_In_Date",
    bend_Date: "bcheck_Out_Date",
  },
  transport: {
    astart: "adeparture_Date_and_Time",
    bend: "barrival_Date_and_Time",
  },
  trip: {
    bstart_Date: "bstart_Date",
    cend_Date: "cend_Date",
  },
};

//The field each detail type sorts and groups by. Used where code handles an
//item of unknown type and previously reached for Object.values(item)[0].
//note has no date of its own; it keeps its single field to preserve the
//existing behaviour.
export const startField = {
  activity: "astart_Date",
  car: "astart",
  map: "astart_Date",
  note: "anote",
  room: "astart_Date",
  transport: "astart",
};
