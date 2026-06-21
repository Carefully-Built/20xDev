import type { OrganizationsResponse, WorkOSOrganization } from '@carefully-built/saas-kit/workos';

interface JsonPostOptions {
  readonly body: Record<string, unknown>;
  readonly errorMessage: string;
}

interface SwitchOrganizationResponse {
  readonly redirectUrl?: string;
}

async function postJson<TResponse>(
  url: string,
  { body, errorMessage }: JsonPostOptions,
): Promise<TResponse> {
  const response = await fetch(url, {
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return (await response.json()) as TResponse;
}

export async function fetchOrganizations(): Promise<
  OrganizationsResponse<WorkOSOrganization>
> {
  const response = await fetch('/api/organizations');

  if (!response.ok) {
    return { organizations: [] };
  }

  return (await response.json()) as OrganizationsResponse<WorkOSOrganization>;
}

export async function switchOrganization(
  organizationId: string,
): Promise<SwitchOrganizationResponse | undefined> {
  return postJson<SwitchOrganizationResponse>('/api/organizations/switch', {
    body: { organizationId },
    errorMessage: 'Could not switch organization',
  });
}
