// Membership ID is derived from the user's Mongo _id + signup year, so it is
// stable, unique and needs no extra database field or migration.
//   e.g.  BAAP-26-A1B2C3
export function getMembershipId(user) {
  const id = String(user?.id || user?._id || '');
  const year = new Date(user?.createdAt || Date.now()).getFullYear().toString().slice(-2);
  return `BAAP-${year}-${id.slice(-6).toUpperCase()}`;
}
