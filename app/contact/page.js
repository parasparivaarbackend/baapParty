import PageHeader from '@/components/PageHeader';
import ContactForm from '@/components/ContactForm';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

export const metadata = {
  title: "Contact — Bharatiya Avijit Aawaz Party",
};

const info = [
  {
    icon: MapPin,
    title: "Head Office",
    text: "BK-1/54 Ground Floor Shalimar Bagh New Delhi 110088",
  },
  { icon: Phone, title: "Phone", text: "+91 11 2xxx 6xxx" },
  { icon: Mail, title: "Email", text: "contact@bharatiyaavijitaawazparty.in" },
  { icon: Clock, title: "Office Hours", text: "Mon – Sat, 9:00 AM – 7:00 PM" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reach Out"
        title="Get in Touch With Us"
        crumb="Contact"
      />

      <section className="bg-ivory py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {info.map((i) => (
              <div
                key={i.title}
                className="rounded-2xl border border-ink/8 bg-white p-6 text-center shadow-card"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-saffron/10 text-saffron">
                  <i.icon size={20} />
                </span>
                <h3 className="mt-4 font-display text-sm font-bold text-ink">
                  {i.title}
                </h3>
                <p className="mt-1 text-xs text-ink-soft">{i.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
            <div className="overflow-hidden rounded-3xl border border-ink/8 shadow-card lg:col-span-2">
              <iframe
                title="Party head office location map"
                // src="https://www.google.com/maps?q=New+Delhi&output=embed"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.283675272632!2d77.15655602451334!3d28.71106718051176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0187c2f65bf7%3A0x80971e43ca1eeffc!2sBlock%20BK%2C%20West%20Shalimar%20Bagh%2C%20Shalimar%20Bagh%2C%20Delhi%2C%20110088!5e0!3m2!1sen!2sin!4v1789557737920!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 420 }} 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
