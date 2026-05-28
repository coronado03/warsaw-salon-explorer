type ServiceTagProps = {
  label: string;
};

export default function ServiceTag({ label }: ServiceTagProps) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-stone-100 text-stone-600 border border-stone-200">
      {label}
    </span>
  );
}
