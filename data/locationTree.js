// State -> District -> City / Village / Area lists for the admin "District Teams" form.
//
// Where a state is listed here, the admin picks the district and the area from drop-downs
// (no typing). A state that is NOT listed falls back to plain typing, so nothing is blocked.
// To add a state, add another block below - same shape: { District: ['Area', 'Area', ...] }.
// Every area drop-down also has an "Other (add new)" choice for places missing from the list.

export const LOCATION_TREE = {
  Delhi: {
    Central: ['Karol Bagh', 'Paharganj', 'Daryaganj', 'Chandni Chowk', 'Sadar Bazar', 'Patel Nagar', 'Rajinder Nagar', 'Jama Masjid', 'Ballimaran', 'Matia Mahal', 'Ram Nagar', 'Dev Nagar'],
    East: ['Preet Vihar', 'Mayur Vihar', 'Laxmi Nagar', 'Patparganj', 'Krishna Nagar', 'Gandhi Nagar', 'Geeta Colony', 'Kondli', 'Trilokpuri', 'Kalyanpuri', 'Shakarpur', 'Pandav Nagar'],
    'New Delhi': ['Connaught Place', 'Chanakyapuri', 'Lodhi Colony', 'Kidwai Nagar', 'Sarojini Nagar', 'Gole Market', 'Jor Bagh', 'Bapu Dham', 'Khan Market', 'Netaji Nagar', 'Moti Bagh'],
    North: ['Civil Lines', 'Model Town', 'Kashmere Gate', 'Timarpur', 'Mukherjee Nagar', 'Kamla Nagar', 'Burari', 'Wazirabad', 'Gulabi Bagh', 'Kingsway Camp', 'Majnu Ka Tila', 'Sant Nagar'],
    'North East': ['Seelampur', 'Jaffrabad', 'Mustafabad', 'Karawal Nagar', 'Gokalpuri', 'Yamuna Vihar', 'Bhajanpura', 'Maujpur', 'Babarpur', 'Brahmpuri', 'Welcome', 'Nand Nagri'],
    'North West': ['Rohini', 'Pitampura', 'Shalimar Bagh', 'Ashok Vihar', 'Narela', 'Bawana', 'Jahangirpuri', 'Badli', 'Mangolpuri', 'Sultanpuri', 'Haiderpur', 'Keshav Puram'],
    Shahdara: ['Shahdara', 'Vivek Vihar', 'Dilshad Garden', 'Anand Vihar', 'Seemapuri', 'Welcome Colony', 'Jhilmil', 'Rohtas Nagar', 'Ghonda'],
    South: ['Saket', 'Hauz Khas', 'Mehrauli', 'Malviya Nagar', 'Greater Kailash', 'Chhatarpur', 'Sangam Vihar', 'Chittaranjan Park', 'Green Park', 'Lajpat Nagar', 'Defence Colony', 'Ambedkar Nagar'],
    'South East': ['Okhla', 'Jasola', 'Kalkaji', 'Sarita Vihar', 'Badarpur', 'Tughlakabad', 'Govindpuri', 'Jamia Nagar', 'Nehru Place', 'Sukhdev Vihar', 'Jaitpur', 'Madanpur Khadar'],
    'South West': ['Dwarka', 'Najafgarh', 'Vasant Kunj', 'Vasant Vihar', 'Palam', 'Mahipalpur', 'Kapashera', 'R.K. Puram', 'Munirka', 'Delhi Cantt', 'Bijwasan', 'Matiala'],
    West: ['Janakpuri', 'Rajouri Garden', 'Punjabi Bagh', 'Tilak Nagar', 'Vikaspuri', 'Uttam Nagar', 'Paschim Vihar', 'Subhash Nagar', 'Hari Nagar', 'Moti Nagar', 'Nangloi', 'Tagore Garden'],
  },
};

export const districtsOf = (state) => Object.keys(LOCATION_TREE[state] || {});
export const areasOf = (state, district) => (LOCATION_TREE[state]?.[district] || []).slice().sort((a, b) => a.localeCompare(b));
