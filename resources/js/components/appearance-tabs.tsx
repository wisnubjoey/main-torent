import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { updateAppearance } = useAppearance();

    return (
        <div
            className={cn('inline-flex gap-1 rounded-lg bg-neutral-100 p-1', className)}
            {...props}
        >
            <button
                onClick={() => updateAppearance()}
                className={cn(
                    'flex items-center rounded-md px-3.5 py-1.5 transition-colors bg-white shadow-xs text-neutral-900'
                )}
            >
                <Sun className="-ml-1 h-4 w-4" />
                <span className="ml-1.5 text-sm">Light</span>
            </button>
        </div>
    );
}
