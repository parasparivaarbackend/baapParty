'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, CreditCard, HandCoins, Landmark, Loader2, Smartphone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AMOUNTS = [500, 1100, 2100, 5100, 11000];
const METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'netbanking', label: 'Net Banking', icon: Landmark },
];

export default function DonateForm() {
  const [amount, setAmount] = useState(2100);
  const [custom, setCustom] = useState('');
  const [method, setMethod] = useState('upi');
  const [status, setStatus] = useState('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { user } = useAuth();

  // Logged-in members: prefill name & email (they can still edit them)
  useEffect(() => {
    if (!user) return;
    setName((n) => n || user.name || '');
    setEmail((e) => e || user.email || '');
  }, [user]);

  const finalAmount = custom ? Number(custom) : amount;

  const [error, setError] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    if (!finalAmount || finalAmount < 100 || !name.trim()) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: email.trim(), amount: finalAmount, method }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
    } catch {
      setStatus('idle');
      setError('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-banyan/20 bg-banyan/5 p-10 text-center"
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-banyan text-white">
          <CheckCircle2 size={30} />
        </span>
        <h3 className="mt-5 font-display text-2xl font-extrabold text-ink">
          Dhanyavaad, {name.split(' ')[0]}!
        </h3>
        <p className="mt-2 text-ink-soft">
          Your contribution of ₹{finalAmount.toLocaleString('en-IN')} has been recorded against {email}.
          A receipt will be logged to the public transparency ledger.
        </p>
        <button
          type="button"
          onClick={() => { setStatus('idle'); setName(user?.name || ''); setEmail(user?.email || ''); setCustom(''); }}
          className="mt-6 rounded-full border-2 border-ink/15 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink"
        >
          Make Another Contribution
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handlePay} className="rounded-3xl border border-ink/8 bg-white p-8 shadow-card sm:p-10">
      <p className="mb-3 text-sm font-bold text-ink">Choose an amount</p>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
        {AMOUNTS.map((a) => (
          <button
            type="button"
            key={a}
            onClick={() => { setAmount(a); setCustom(''); }}
            className={`rounded-xl border-2 py-3 text-sm font-bold transition-colors ${
              amount === a && !custom
                ? 'border-saffron bg-saffron text-white'
                : 'border-ink/10 text-ink-soft hover:border-saffron hover:text-saffron'
            }`}
          >
            ₹{a.toLocaleString('en-IN')}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-bold text-ink">Or enter a custom amount</label>
        <div className="flex items-center rounded-xl border-2 border-ink/10 bg-ivory px-4 focus-within:border-saffron">
          <span className="mr-1 text-sm font-bold text-ink-soft">₹</span>
          <input
            type="number"
            min={100}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Enter amount"
            className="w-full bg-transparent py-3 text-sm text-ink outline-none"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-ink">Full name (for your receipt)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="As per PAN / ID"
          className="w-full rounded-xl border-2 border-ink/10 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-saffron"
        />
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-ink">Email ID (receipt will be sent here)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full rounded-xl border-2 border-ink/10 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-saffron"
        />
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-bold text-ink">Payment method</p>
        <div className="grid grid-cols-3 gap-2.5">
          {METHODS.map((m) => (
            <button
              type="button"
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-3.5 text-xs font-bold uppercase transition-colors ${
                method === m.id
                  ? 'border-banyan bg-banyan/10 text-banyan'
                  : 'border-ink/10 text-ink-soft hover:border-banyan hover:text-banyan'
              }`}
            >
              <m.icon size={20} />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 text-center text-sm font-semibold text-saffron-dark">{error}</p>}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-banyan px-7 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-banyan-dark disabled:opacity-70"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Processing...
          </>
        ) : (
          <>
            <HandCoins size={18} /> Contribute ₹{finalAmount ? finalAmount.toLocaleString('en-IN') : '0'}
          </>
        )}
      </button>
      <p className="mt-3 text-center text-[11px] text-ink-soft/70">
        Demo checkout — no real payment is processed on this preview site.
      </p>
    </form>
  );
}





// 'use client';

// import { useMemo, useState } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import {
//   Check,
//   CheckCircle2,
//   Copy,
//   HandCoins,
//   Loader2,
//   Smartphone,
//   X,
// } from 'lucide-react';

// const AMOUNTS = [500, 1100, 2100, 5100, 11000];

// // =====================================================
// // CHANGE THESE TWO VALUES
// // =====================================================

// //const UPI_ID = '7678494723@fam';
// const UPI_ID = "9811988411@pthdfc";
// const PAYEE_NAME = "Paras Parivaar";

// // =====================================================

// export default function DonateForm() {
//   const [amount, setAmount] = useState(2100);
//   const [custom, setCustom] = useState('');

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');

//   const [error, setError] = useState('');

//   const [showQR, setShowQR] = useState(false);

//   const [utr, setUtr] = useState('');
//   const [paymentStatus, setPaymentStatus] = useState('idle');

//   const [copied, setCopied] = useState(false);

//   // =====================================================
//   // FINAL AMOUNT
//   // =====================================================

//   const finalAmount = custom ? Number(custom) : amount;

//   // =====================================================
//   // DYNAMIC UPI URL
//   // =====================================================

//   const upiUrl = useMemo(() => {
//     if (!finalAmount || finalAmount < 10) {
//       return '';
//     }

//     const params = new URLSearchParams({
//       pa: UPI_ID,
//       pn: PAYEE_NAME,
//       am: Number(finalAmount).toFixed(2),
//       cu: 'INR',
//     });

//     return `upi://pay?${params.toString()}`;
//   }, [finalAmount]);

//   // =====================================================
//   // QR URL
//   //
//   // Your local API should generate the QR image from
//   // the UPI URL.
//   // =====================================================

//   const qrUrl = useMemo(() => {
//     if (!upiUrl) {
//       return '';
//     }

//     return `/api/upi-qr?data=${encodeURIComponent(upiUrl)}`;
//   }, [upiUrl]);

//   // =====================================================
//   // OPEN QR
//   // =====================================================

//   const handlePay = (e) => {
//     e.preventDefault();

//     setError('');

//     // Validate amount
//     if (!finalAmount || finalAmount < 10) {
//       setError('Please enter an amount of at least ₹100.');
//       return;
//     }

//     // Validate name
//     if (!name.trim()) {
//       setError('Please enter your full name.');
//       return;
//     }

//     // Validate email
//     if (!email.trim()) {
//       setError('Please enter your email address.');
//       return;
//     }

//     // Basic email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(email.trim())) {
//       setError('Please enter a valid email address.');
//       return;
//     }

//     // Directly open QR
//     setShowQR(true);
//   };

//   // =====================================================
//   // COPY UPI ID
//   // =====================================================

//   const handleCopyUPI = async () => {
//     try {
//       await navigator.clipboard.writeText(UPI_ID);

//       setCopied(true);

//       setTimeout(() => {
//         setCopied(false);
//       }, 2000);
//     } catch {
//       setError('Unable to copy UPI ID.');
//     }
//   };

//   // =====================================================
//   // PAYMENT DONE
//   // =====================================================

//   const handlePaymentDone = async () => {
//     setError('');

//     if (!utr.trim()) {
//       setError('Please enter your UTR / Transaction ID.');
//       return;
//     }

//     setPaymentStatus('loading');

//     try {
//       const res = await fetch('/api/contributions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: name.trim(),
//           email: email.trim(),
//           amount: finalAmount,
//           method: 'upi',
//           utr: utr.trim(),
//           status: 'payment_submitted',
//         }),
//       });

//       if (!res.ok) {
//         throw new Error('Request failed');
//       }

//       setPaymentStatus('success');
//       setShowQR(false);
//     } catch (error) {
//       console.error(error);

//       setPaymentStatus('idle');
//       setError(
//         'Unable to submit payment details. Please try again.'
//       );
//     }
//   };

//   // =====================================================
//   // RESET FORM
//   // =====================================================

//   const handleAnotherContribution = () => {
//     setAmount(2100);
//     setCustom('');
//     setName('');
//     setEmail('');
//     setUtr('');
//     setError('');
//     setPaymentStatus('idle');
//     setShowQR(false);
//   };

//   // =====================================================
//   // SUCCESS SCREEN
//   // =====================================================

//   if (paymentStatus === 'success') {
//     return (
//       <motion.div
//         initial={{
//           opacity: 0,
//           y: 12,
//         }}
//         animate={{
//           opacity: 1,
//           y: 0,
//         }}
//         className="rounded-3xl border border-banyan/20 bg-banyan/5 p-10 text-center"
//       >
//         <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-banyan text-white">
//           <CheckCircle2 size={30} />
//         </span>

//         <h3 className="mt-5 font-display text-2xl font-extrabold text-ink">
//           Dhanyavaad, {name.split(' ')[0]}!
//         </h3>

//         <p className="mt-2 text-ink-soft">
//           Your contribution of ₹
//           {Number(finalAmount).toLocaleString('en-IN')} has been
//           submitted successfully.
//         </p>

//         <p className="mt-2 text-sm text-ink-soft/80">
//           Your payment details and transaction ID have been recorded.
//         </p>

//         <button
//           type="button"
//           onClick={handleAnotherContribution}
//           className="mt-6 rounded-full border-2 border-ink/15 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink"
//         >
//           Make Another Contribution
//         </button>
//       </motion.div>
//     );
//   }

//   // =====================================================
//   // MAIN FORM
//   // =====================================================

//   return (
//     <>
//       <form
//         onSubmit={handlePay}
//         className="rounded-3xl border border-ink/8 bg-white p-8 shadow-card sm:p-10"
//       >
//         {/* =================================================
//             AMOUNT
//         ================================================= */}

//         <p className="mb-3 text-sm font-bold text-ink">Choose an amount</p>

//         <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
//           {AMOUNTS.map((a) => (
//             <button
//               type="button"
//               key={a}
//               onClick={() => {
//                 setAmount(a);
//                 setCustom("");
//                 setError("");
//               }}
//               className={`rounded-xl border-2 py-3 text-sm font-bold transition-colors ${
//                 amount === a && !custom
//                   ? "border-saffron bg-saffron text-white"
//                   : "border-ink/10 text-ink-soft hover:border-saffron hover:text-saffron"
//               }`}
//             >
//               ₹{a.toLocaleString("en-IN")}
//             </button>
//           ))}
//         </div>

//         {/* =================================================
//             CUSTOM AMOUNT
//         ================================================= */}

//         <div className="mt-4">
//           <label className="mb-2 block text-sm font-bold text-ink">
//             Or enter a custom amount
//           </label>

//           <div className="flex items-center rounded-xl border-2 border-ink/10 bg-ivory px-4 focus-within:border-saffron">
//             <span className="mr-1 text-sm font-bold text-ink-soft">₹</span>

//             <input
//               type="number"
//               min={10}
//               value={custom}
//               onChange={(e) => {
//                 setCustom(e.target.value);
//                 setError("");
//               }}
//               placeholder="Enter amount"
//               className="w-full bg-transparent py-3 text-sm text-ink outline-none"
//             />
//           </div>
//         </div>

//         {/* =================================================
//             NAME
//         ================================================= */}

//         <div className="mt-6">
//           <label className="mb-2 block text-sm font-bold text-ink">
//             Full name
//           </label>

//           <input
//             type="text"
//             value={name}
//             onChange={(e) => {
//               setName(e.target.value);
//               setError("");
//             }}
//             placeholder="Enter your full name"
//             className="w-full rounded-xl border-2 border-ink/10 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-saffron"
//           />
//         </div>

//         {/* =================================================
//             EMAIL
//         ================================================= */}

//         <div className="mt-6">
//           <label className="mb-2 block text-sm font-bold text-ink">
//             Email address
//           </label>

//           <input
//             type="email"
//             value={email}
//             onChange={(e) => {
//               setEmail(e.target.value);
//               setError("");
//             }}
//             placeholder="Enter your email address"
//             className="w-full rounded-xl border-2 border-ink/10 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-saffron"
//           />
//         </div>

//         {/* =================================================
//             ERROR
//         ================================================= */}

//         {error && (
//           <p className="mt-4 text-center text-sm font-semibold text-saffron-dark">
//             {error}
//           </p>
//         )}

//         {/* =================================================
//             CONTRIBUTE BUTTON
//         ================================================= */}

//         <button
//           type="submit"
//           className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-banyan px-7 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-banyan-dark"
//         >
//           <HandCoins size={18} />
//           Contribute ₹
//           {finalAmount ? Number(finalAmount).toLocaleString("en-IN") : "0"}
//         </button>

//         <p className="mt-3 text-center text-[11px] text-ink-soft/70">
//           Clicking contribute will open the UPI QR code.
//         </p>
//       </form>

//       {/* ===================================================
//           QR MODAL
//       =================================================== */}

//       <AnimatePresence>
//         {showQR && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             //className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
//             className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-5"
//             onClick={() => setShowQR(false)}
//           >
//             <motion.div
//               initial={{
//                 opacity: 0,
//                 scale: 0.92,
//                 y: 20,
//               }}
//               animate={{
//                 opacity: 1,
//                 scale: 1,
//                 y: 0,
//               }}
//               exit={{
//                 opacity: 0,
//                 scale: 0.92,
//                 y: 20,
//               }}
//               transition={{
//                 duration: 0.2,
//               }}
//               onClick={(e) => e.stopPropagation()}
//               //className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
//               className="relative my-auto w-full max-w-md max-h-[95vh] overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7"
//             >
//               {/* CLOSE */}

//               <button
//                 type="button"
//                 onClick={() => setShowQR(false)}
//                 className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
//               >
//                 <X size={20} />
//               </button>

//               {/* HEADER */}

//               <div className="text-center">
//                 <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-banyan/10 text-banyan">
//                   <Smartphone size={28} />
//                 </div>

//                 <h2 className="mt-4 font-display text-2xl font-extrabold text-ink">
//                   Scan & Pay
//                 </h2>

//                 <p className="mt-1 text-sm text-ink-soft">
//                   Scan this QR code using any UPI app
//                 </p>
//               </div>

//               {/* AMOUNT */}

//               <div className="mt-5 rounded-2xl bg-ivory p-4 text-center">
//                 <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
//                   Contribution Amount
//                 </p>

//                 <p className="mt-1 text-3xl font-extrabold text-banyan">
//                   ₹{Number(finalAmount).toLocaleString("en-IN")}
//                 </p>
//               </div>

//               {/* QR */}

//               <div className="mt-6 flex justify-center">
//                 <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
//                   {qrUrl ? (
//                     <img
//                       src={qrUrl}
//                       alt="UPI Payment QR Code"
//                       className="h-56 w-56 object-contain sm:h-64 sm:w-64"
//                     />
//                   ) : (
//                     <div className="flex h-56 w-56 items-center justify-center">
//                       <Loader2 size={30} className="animate-spin text-banyan" />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* UPI ID */}

//               <div className="mt-5">
//                 <p className="mb-2 text-center text-xs font-semibold text-ink-soft">
//                   UPI ID
//                 </p>

//                 <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
//                   <span className="truncate text-sm font-bold text-ink">
//                     {UPI_ID}
//                   </span>

//                   <button
//                     type="button"
//                     onClick={handleCopyUPI}
//                     className="ml-3 flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-banyan hover:bg-banyan/10"
//                   >
//                     {copied ? (
//                       <>
//                         <Check size={15} />
//                         Copied
//                       </>
//                     ) : (
//                       <>
//                         <Copy size={15} />
//                         Copy
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* INSTRUCTIONS */}

//               <div className="mt-5 rounded-xl bg-banyan/5 p-4">
//                 <p className="text-center text-xs leading-5 text-ink-soft">
//                   Open Google Pay, PhonePe, Paytm or another UPI app and scan
//                   the QR code. The amount will be automatically filled.
//                 </p>
//               </div>

//               {/* UTR */}

//               <div className="mt-5">
//                 <label className="mb-2 block text-sm font-bold text-ink">
//                   UTR / Transaction ID
//                 </label>

//                 <input
//                   type="text"
//                   value={utr}
//                   onChange={(e) => {
//                     setUtr(e.target.value);
//                     setError("");
//                   }}
//                   placeholder="Enter UTR after payment"
//                   className="w-full rounded-xl border-2 border-ink/10 bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-saffron"
//                 />
//               </div>

//               {/* ERROR */}

//               {error && (
//                 <p className="mt-3 text-center text-sm font-semibold text-red-600">
//                   {error}
//                 </p>
//               )}

//               {/* PAYMENT DONE */}

//               <button
//                 type="button"
//                 onClick={handlePaymentDone}
//                 disabled={paymentStatus === "loading"}
//                 className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-banyan px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-banyan-dark disabled:cursor-not-allowed disabled:opacity-70"
//               >
//                 {paymentStatus === "loading" ? (
//                   <>
//                     <Loader2 size={18} className="animate-spin" />
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle2 size={18} />
//                     Payment Done
//                   </>
//                 )}
//               </button>

//               <p className="mt-3 text-center text-[10px] leading-4 text-gray-500">
//                 Please make the payment first and then enter your UTR /
//                 Transaction ID above.
//               </p>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }
