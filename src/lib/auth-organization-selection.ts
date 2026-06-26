export interface OrganizationSelectionOption {
  id: string;
  logoUrl: string | null;
  name: string;
}

interface RawOrganizationSelectionOption {
  id?: string;
  imageUrl?: string | null;
  image_url?: string | null;
  logoUrl?: string | null;
  logo_url?: string | null;
  name?: string;
  organization?: {
    id?: string;
    imageUrl?: string | null;
    image_url?: string | null;
    logoUrl?: string | null;
    logo_url?: string | null;
    name?: string;
  };
  organizationId?: string;
  organizationName?: string;
}

function getLogoUrl(item: RawOrganizationSelectionOption): string | null {
  return (
    item.logoUrl ??
    item.logo_url ??
    item.imageUrl ??
    item.image_url ??
    item.organization?.logoUrl ??
    item.organization?.logo_url ??
    item.organization?.imageUrl ??
    item.organization?.image_url ??
    null
  );
}

export function normalizeOrganizationSelectionOptions(
  rawOrganizations: unknown,
): OrganizationSelectionOption[] {
  if (!Array.isArray(rawOrganizations)) {
    return [];
  }

  return rawOrganizations
    .map((raw) => {
      if (!raw || typeof raw !== 'object') {
        return null;
      }

      const item = raw as RawOrganizationSelectionOption;
      const id = item.id ?? item.organizationId ?? item.organization?.id;
      const name = item.name ?? item.organizationName ?? item.organization?.name;

      if (!id || !name) {
        return null;
      }

      return {
        id,
        logoUrl: getLogoUrl(item),
        name,
      };
    })
    .filter((organization): organization is OrganizationSelectionOption => organization !== null);
}
