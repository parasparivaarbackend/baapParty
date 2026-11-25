import OrganizationStructure from "@/components/OrganizationStructure";

// ✅ Organisation पेज के Meta Tags
export const metadata = {
  title: "BAAP Party Organization Structure | Leadership",
  description: "Bharatiya Avijit Aawaz Party (BAAP) organisational structure, national, state, district and grassroots leadership, women's wing, youth wing and special cells.",
  keywords: [
    "BAAP Party Organisation",
    "BAAP Party Organisational Structure",
    "Bharatiya Avijit Aawaz Party Organisation",
    "BAAP Party Leadership",
    "BAAP Party National Leadership",
    "BAAP Party State Leadership",
    "BAAP Party District Leadership",
    "BAAP Party Organisational Structure in India"
  ],
};

export default function OrganizationPage() {
  return (
    <main>
      <OrganizationStructure />
    </main>
  );
}