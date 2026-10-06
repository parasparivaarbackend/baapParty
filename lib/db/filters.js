import { connectDB } from './mongoose';
import Event from '@/models/Event';
import BlogPost from '@/models/BlogPost';
import GalleryItem from '@/models/GalleryItem';
import { INDIAN_STATES } from '@/lib/locations';

/**
 * Returns everything the global content filter needs:
 *  - states: the full static Indian states/UTs list
 *  - citiesByState: { [state]: string[] } — cities/villages that have
 *    actually been tagged on some piece of content for that state, so the
 *    City/Village box can suggest real options instead of being empty
 *  - categories: every distinct category used across Events, Blog & Gallery
 */
export async function getGlobalFilterOptions() {
  await connectDB();

  const [events, posts, gallery] = await Promise.all([
    Event.find({}, 'state city category').lean(),
    BlogPost.find({}, 'state city category').lean(),
    GalleryItem.find({}, 'state city category').lean(),
  ]);

  const all = [...events, ...posts, ...gallery];

  const citiesByState = {};
  const categorySet = new Set();

  for (const item of all) {
    if (item.category) categorySet.add(item.category);
    if (item.state && item.city) {
      const key = item.state;
      if (!citiesByState[key]) citiesByState[key] = new Set();
      citiesByState[key].add(item.city);
    }
  }

  const citiesByStatePlain = Object.fromEntries(
    Object.entries(citiesByState).map(([state, set]) => [state, Array.from(set).sort()])
  );

  return {
    states: INDIAN_STATES,
    citiesByState: citiesByStatePlain,
    categories: Array.from(categorySet).sort(),
  };
}
