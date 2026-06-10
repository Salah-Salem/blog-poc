'use client';

export default function VisibilityBadge({ visibility = 'public' }) {
  const isPrivate = visibility === 'private';
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
        isPrivate
          ? 'bg-[#fff3cd] text-[#856404]'
          : 'bg-[#e7f3ff] text-[#1877f2]'
      }`}
    >
      <i className={`pi ${isPrivate ? 'pi-lock' : 'pi-globe'}`} />
      {isPrivate ? 'Private' : 'Public'}
    </span>
  );
}
