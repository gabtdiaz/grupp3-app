interface FeedDateProps {
  label: string;
}

export default function FeedDate({ label }: FeedDateProps) {
  return (
    <div className="px-6 pt-3">
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500 whitespace-nowrap">{label}</span>

        <div className="flex-1 bg-gray-200" />
      </div>
    </div>
  );
}
