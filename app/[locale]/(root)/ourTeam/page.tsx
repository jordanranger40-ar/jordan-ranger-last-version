// app/our-team/page.tsx

import { getAllMembers } from "@/app/models/db/lib/services/outTeam";
import OurTeamPage from "@/components/ourTeam/OurTeamPage";

export default async function Page() {
  const members = await getAllMembers();

  console.log("Fetched members:", members);

  return <OurTeamPage members={members || []}  />;
}
