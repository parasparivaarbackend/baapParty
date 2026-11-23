import WingLanding from '@/components/WingLanding';
import { WINGS } from '@/data/wings';

export const metadata = { title: 'Youth Wing — युवा प्रकोष्ठ' };

export default function YouthPage() {
  return <WingLanding wing={WINGS.youth} />;
}
