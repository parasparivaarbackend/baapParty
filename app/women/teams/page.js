import PageHeader from '@/components/PageHeader';
import TeamsView from '@/components/TeamsView';
import { publicTeamMembers } from '@/lib/db/teams';
import { WINGS } from '@/data/wings';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'District Women Teams' };

export default async function WomenTeamsPage() {
  let members = [];
  try {
    members = await publicTeamMembers('women');
  } catch (err) {
    console.error('teams load failed', err);
  }
  return (
    <>
      <PageHeader eyebrow={WINGS.women.hindi} title="District Teams" crumb="District Teams" />
      <section className="bg-ivory py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <TeamsView members={members} />
        </div>
      </section>
    </>
  );
}
