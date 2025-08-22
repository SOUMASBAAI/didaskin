// src/pages/LegalNotice.jsx
export default function LegalNotice() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Legal Notice</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Site Publisher</h2>
        <p>Name / Company: [Your name or company]</p>
        <p>Address: [Address]</p>
        <p>Email: [Your email]</p>
        <p>SIRET / Registration number: [if applicable]</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Hosting Provider</h2>
        <p>Host: [Hosting provider’s name]</p>
        <p>Address: [Full address]</p>
        <p>Phone: [Number]</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Data Protection</h2>
        <p>
          In accordance with the GDPR, you may exercise your rights of access, 
          rectification, and deletion of your personal data by contacting: [your email].
        </p>
      </section>
    </div>
  );
}
