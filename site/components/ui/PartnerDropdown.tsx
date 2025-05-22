import { useState } from "react";

interface PartnerDropdownProps {
  email?: string;
  partners: string[];
}

export default function PartnerDropdown({ email, partners }: PartnerDropdownProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function togglePartner(partner: string) {
    setSelected((prev) =>
      prev.includes(partner)
        ? prev.filter((p) => p !== partner)
        : [...prev, partner]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);
    try {
      console.log(selected, "selected partners")
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, self_reported_partners: selected }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSuccess(true);
      setSelected([]);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-48">
      <label className="font-bold">Which partners are you a part of?</label>
      <div className="flex flex-col gap-4 overflow-y-auto">
        {partners.map((partner) => (
          <label key={partner} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              value={partner}
              checked={selected.includes(partner)}
              onChange={() => togglePartner(partner)}
              disabled={submitting}
            />
            {partner}
          </label>
        ))}
      </div>
      <button
        type="submit"
        disabled={submitting || selected.length === 0}
        className="bg-hc-primary-dull text-white rounded px-4 py-2 mt-2 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
      {success && <span className="text-gold">Submitted successfully!</span>}
      {error && <span className="text-red-500">{error}</span>}
    </form>
  );
}
