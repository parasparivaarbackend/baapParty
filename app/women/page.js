import WingLanding from '@/components/WingLanding';
import { WINGS } from '@/data/wings';

export const metadata = { title: 'Women Wing — महिला प्रकोष्ठ' };

export default function WomenPage() {
  return <WingLanding wing={WINGS.women} />;
}
