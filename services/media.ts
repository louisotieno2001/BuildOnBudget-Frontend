import { getApiUrl } from '@/services/api';

export type MediaValue = { id?: string } | string | ({ id?: string } | string)[];

export function resolveMediaId(media?: MediaValue): string | undefined {
  if (!media) return undefined;
  if (typeof media === 'string') return media;
  if (Array.isArray(media)) {
    const first = media[0];
    if (!first) return undefined;
    if (typeof first === 'string') return first;
    return first.id;
  }
  return media.id;
}

export function normalizeAssetUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = getApiUrl();
  if (trimmed.startsWith('/assets/')) return `${base}${trimmed}`;
  if (trimmed.startsWith('assets/')) return `${base}/${trimmed}`;
  if (trimmed.startsWith('/')) return `${base}${trimmed}`;
  return `${base}/assets/${trimmed}`;
}

export function getMediaAssetUrl(mediaUrl?: string | null, media?: MediaValue): string | undefined {
  const normalized = normalizeAssetUrl(mediaUrl);
  if (normalized) return normalized;
  const mediaId = resolveMediaId(media);
  return normalizeAssetUrl(mediaId);
}
