import { AlertCircle, CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { ReactNode } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
}

const config: Record<AlertType, { icon: typeof AlertCircle; styles: string }> = {
  success: { icon: CheckCircle2, styles: 'bg-green-50 border-green-200 text-green-800' },
  error: { icon: XCircle, styles: 'bg-red-50 border-red-200 text-red-800' },
  warning: { icon: AlertCircle, styles: 'bg-amber-50 border-amber-200 text-amber-800' },
  info: { icon: Info, styles: 'bg-blue-50 border-blue-200 text-blue-800' },
};

export default function Alert({ type, message, onClose }: AlertProps) {
  const { icon: Icon, styles } = config[type];
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${styles} animate-fade-in`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 hover:opacity-70">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function LoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
      {text && <p className="mt-3 text-sm text-gray-500">{text}</p>}
    </div>
  );
}

export function EmptyState({ icon, title, message, action }: { icon: ReactNode; title: string; message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-4">{message}</p>
      {action}
    </div>
  );
}

export function StatCard({ icon, label, value, color }: { icon: ReactNode; label: string; value: number | string; color: string }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
