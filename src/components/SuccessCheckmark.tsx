import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Mail, AlertTriangle, ExternalLink, X, Check } from 'lucide-react';

interface SuccessCheckmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
}

/**
 * Subtle, professional animated SVG checkmark using Framer Motion.
 * Features an animated drawing path and smooth scale-spring for high-trust feedback.
 */
export const SuccessCheckmark: React.FC<SuccessCheckmarkProps> = ({
  size = 'md',
  className = '',
  color = '#065f46', // emerald-800
}) => {
  const dimension = size === 'sm' ? 22 : size === 'md' ? 32 : size === 'lg' ? 44 : 56;
  const strokeWidth = size === 'sm' ? 2.5 : size === 'md' ? 3 : 3.5;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <motion.svg
        width={dimension}
        height={dimension}
        viewBox="0 0 52 52"
        fill="none"
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 340,
          damping: 22,
        }}
      >
        {/* Soft background pulse */}
        <motion.circle
          cx="26"
          cy="26"
          r="24"
          fill="#ecfdf5"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Circular boundary stroke */}
        <motion.circle
          cx="26"
          cy="26"
          r="23"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 0.4,
            ease: 'easeOut',
          }}
        />

        {/* Checkmark tick */}
        <motion.path
          d="M15 27L22.5 34.5L37 19"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 0.35,
            ease: 'easeOut',
            delay: 0.18,
          }}
        />
      </motion.svg>
    </div>
  );
};

interface ScanSavedToastProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  recordId?: string;
  entityName?: string;
  autoCloseMs?: number;
}

/**
 * Subtle Framer Motion toast rendered when a farmer successfully saves a scan.
 */
export const ScanSavedToast: React.FC<ScanSavedToastProps> = ({
  isOpen,
  onClose,
  title = 'Scan Successfully Saved & Logged',
  recordId,
  entityName,
  autoCloseMs = 4500,
}) => {
  useEffect(() => {
    if (!isOpen || !autoCloseMs) return;
    const timer = setTimeout(() => {
      onClose();
    }, autoCloseMs);
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseMs, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-xl shadow-xl border-2 border-emerald-500/80 p-3.5 flex items-start gap-3 pointer-events-auto"
        >
          <SuccessCheckmark size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">{title}</h4>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {entityName && (
              <p className="text-[11px] font-semibold text-emerald-800 mt-0.5 truncate">
                {entityName}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
              {recordId && <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">ID: {recordId}</span>}
              <span className="text-emerald-700 font-medium">✓ Farm History Updated</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface ProfileStepCompletedBadgeProps {
  stepNumber: number;
  stepName: string;
}

/**
 * Step completion feedback with Framer Motion checkmark.
 */
export const ProfileStepCompletedBadge: React.FC<ProfileStepCompletedBadgeProps> = ({
  stepNumber,
  stepName,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold"
    >
      <SuccessCheckmark size="sm" />
      <span>Step {stepNumber} Completed: {stepName}</span>
    </motion.div>
  );
};

interface DataShareSecurityNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName?: string;
  provider?: string;
}

/**
 * High-Trust Modal shown after login:
 * Clarifies:
 * 1. "You are sharing data with this app/website"
 * 2. "Do not create a fake account"
 * Features subtle Framer Motion entry and checkmark animation.
 */
export const DataShareSecurityNoticeModal: React.FC<DataShareSecurityNoticeModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  userName = 'Farmer',
  provider = 'google',
}) => {
  const [showMailBody, setShowMailBody] = React.useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto"
      >
        {/* Animated Checkmark Header */}
        <div className="text-center space-y-2">
          <SuccessCheckmark size="xl" className="mx-auto" />
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            लॉगिन सफल • सुरक्षा व डेटा अधिसूचना
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Login Successful • Official Data Sharing & Security Notice Dispatched
          </p>
        </div>

        {/* Email Recipient Badge */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-4 h-4 text-emerald-800 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-900 block">
                ईमेल अधिसूचना भेजी गई (Mail Dispatched To):
              </span>
              <span className="text-xs font-mono font-bold text-emerald-950 truncate block">
                {userEmail}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-full shrink-0">
            वितरित (Delivered)
          </span>
        </div>

        {/* Core Requirement 1: Data Sharing Confirmation */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-left">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>डेटा साझाकरण सूचना (You are sharing data with this app/website)</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            आप इस ऐप/वेबसाइट (<strong>FarmGuard AI</strong>) के साथ अपना कृषि, फसल स्वास्थ्य, पशु रोग परीक्षण और स्थान डेटा साझा कर रहे हैं। यह डेटा केवल फसल निदान, मौसम चेतावनी और उचित उपचार मार्गदर्शन के लिए उपयोग किया जाता है।
          </p>
        </div>

        {/* Core Requirement 2: Fake Account Warning */}
        <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-amber-300 space-y-1.5 text-left">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>सुरक्षा नीति: फर्जी खाता न बनाएं (Do Not Create a Fake Account)</span>
          </div>
          <p className="text-xs text-amber-950 leading-relaxed">
            कृपया <strong>फर्जी या गैर-वास्तविक खाता न बनाएं (Do not create a fake account)</strong>। क्षेत्र में फसल महामारियों और पशु रोगों की रोकथाम के लिए सभी रिकॉर्ड वास्तविक पहचान से जुड़े होते हैं। फर्जी जानकारी दर्ज करने पर खाता प्रतिबंधित कर दिया जाएगा।
          </p>
        </div>

        {/* Expandable Mail Details Preview */}
        <div className="border border-slate-200 rounded-xl overflow-hidden text-left">
          <button
            type="button"
            onClick={() => setShowMailBody(!showMailBody)}
            className="w-full px-3.5 py-2.5 bg-slate-100/70 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer"
          >
            <span>📨 भेजे गए ईमेल का संपूर्ण विवरण देखें (View Dispatched Mail)</span>
            <span className="text-[11px] text-emerald-800 underline">
              {showMailBody ? 'छुपाएं (Hide)' : 'देखें (Preview)'}
            </span>
          </button>
          {showMailBody && (
            <div className="p-3 bg-white text-[11px] font-mono text-slate-700 space-y-2 max-h-44 overflow-y-auto border-t border-slate-200">
              <div className="font-bold text-slate-900">Subject: Security Notice: You are sharing data with FarmGuard AI (Do Not Create Fake Accounts)</div>
              <div>From: security@farmguard.ai</div>
              <div>To: {userEmail} ({userName})</div>
              <div>Auth Provider: {provider}</div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 whitespace-pre-wrap leading-relaxed">
{`Notice: You are sharing data with this app/website (FarmGuard AI).
Security Policy: DO NOT CREATE A FAKE ACCOUNT.
All agricultural records are strictly verified for authenticity.`}
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <Check className="w-4 h-4 text-emerald-200" />
            <span>स्वीकार करें और डैशबोर्ड पर जाएं (Acknowledge & Continue)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
