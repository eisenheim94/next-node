'use client';

import {
  CheckCircleIcon,
  InfoIcon,
  SpinnerIcon,
  WarningIcon,
  XCircleIcon,
} from '@phosphor-icons/react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      richColors
      className="toaster group"
      icons={{
        success: <CheckCircleIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <WarningIcon className="size-4" />,
        error: <XCircleIcon className="size-4" />,
        loading: <SpinnerIcon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'cn-toast border shadow-lg backdrop-blur-sm [&_[data-icon]]:shrink-0',
          title: 'text-sm font-semibold',
          description: 'text-xs opacity-90',
          success:
            '!border-green-700/40 !bg-green-600 !text-white [&_[data-description]]:text-green-50/90',
          error:
            '!border-red-800/45 !bg-red-600 !text-white [&_[data-description]]:text-red-50/90',
          warning:
            '!border-amber-700/40 !bg-amber-300 !text-amber-950 [&_[data-description]]:text-amber-950/80',
          info:
            '!border-sky-700/40 !bg-sky-500 !text-white [&_[data-description]]:text-sky-50/90',
          closeButton:
            '!left-auto !right-2 !top-5 !translate-x-0 !translate-y-0 !border-white/25 !bg-white/10 !text-current hover:!bg-white/20',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
