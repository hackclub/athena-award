 import { useState } from "react";
 import { AnimatePresence, motion } from "motion/react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");

    const handleVerify = async () => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("OTP verified successfully!");
        setShowOtpModal(false);
        // Optionally, continue to next step here
      } else {
        setError(data.message || "Invalid OTP.");
      }
    } catch (err) {
      setError("Network error.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setShowOtpModal(false);
    try {
      const res = await fetch("/api/otp/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("OTP sent to your email!");
        setTimeout(() => setShowOtpModal(true), 2000); // Show modal after 2 seconds
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError("Network error.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="pointer-events-auto">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Send OTP</button>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </form>
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/25 background-blur-md pointer-events-auto *:pointer-events-auto"
            />
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="w-[90vw] md:w-[30vw] bg-white rounded-2xl shadow-xl p-6 text-center">
                <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  className="text-center text-2xl border rounded p-2 w-24 pointer-events-auto"
                  placeholder="1234"
                />
                <button
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded pointer-events-auto"
                  onClick={handleVerify}>
                  Verify
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}