// Optional district suggestions per state, used as <datalist> hints in the
// "Report Your Problem" form. Leave a state out (or this object empty) and the
// district field simply stays free text.
//
// Example:
//   export const DISTRICTS = { 'Uttar Pradesh': ['Lucknow', 'Ghaziabad', ...] };
//
// Paste an official district list here (state census / LGD directory) when you
// want cleaner data; the server title-cases whatever is typed either way.
export const DISTRICTS = {};
