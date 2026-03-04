'use client';

import { useMutation, useQuery } from 'convex/react';
import { Building2, Pencil, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

function triggerOrgRefresh(): void {
  globalThis.dispatchEvent(new CustomEvent('org-updated'));
}

interface Organization {
  readonly id: string;
  readonly name: string;
  readonly role: string;
}

interface OrganizationCardProps {
  readonly organization: Organization;
}

// EditForm component
interface EditFormProps {
  readonly name: string;
  readonly setName: (name: string) => void;
  readonly logoPreview: string | null;
  readonly currentLogoUrl: string | null;
  readonly onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly onLogoRemove: () => void;
  readonly fileInputRef: React.RefObject<HTMLInputElement | null>;
}

function EditForm({
  name,
  setName,
  logoPreview,
  currentLogoUrl,
  onLogoChange,
  onLogoRemove,
  fileInputRef,
}: EditFormProps): React.ReactElement {
  const displayLogo = logoPreview ?? currentLogoUrl;

  return (
    <div className="space-y-6 py-4 px-4">
      <div className="space-y-2">
        <Label>Organization Logo</Label>
        <div className="flex items-center gap-4">
          <div className="relative size-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted shrink-0">
            {displayLogo ? (
              <>
                <Image src={displayLogo} alt="Logo preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={onLogoRemove}
                  className="absolute -top-2 -right-2 size-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-sm hover:bg-destructive/90 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </>
            ) : (
              <Upload className="size-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onLogoChange}
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="orgName">Organization Name</Label>
        <Input id="orgName" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
    </div>
  );
}

// SaveButton component
interface SaveButtonProps {
  readonly loading: boolean;
  readonly disabled: boolean;
  readonly onClick: () => void;
}

function SaveButton({ loading, disabled, onClick }: SaveButtonProps): React.ReactElement {
  return (
    <Button onClick={onClick} disabled={disabled} className="w-full">
      {loading ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

// OrganizationInfo component
interface OrganizationInfoProps {
  readonly name: string;
  readonly role: string;
  readonly logoUrl: string | null;
}

function OrganizationInfo({ name, role, logoUrl }: OrganizationInfoProps): React.ReactElement {
  return (
    <>
      <div className="relative size-14 rounded-lg border bg-muted flex items-center justify-center overflow-hidden shrink-0">
        {logoUrl ? (
          <Image src={logoUrl} alt="Logo" fill className="object-cover" />
        ) : (
          <Building2 className="size-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-base truncate">{name}</h3>
        <p className="text-sm text-muted-foreground capitalize">{role}</p>
      </div>
    </>
  );
}

export function OrganizationCard({ organization }: OrganizationCardProps): React.ReactElement {
  const router = useRouter();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convex queries and mutations
  const orgData = useQuery(api.functions.organizations.queries.getByWorkosId, {
    workosId: organization.id,
  });
  const generateUploadUrl = useMutation(api.functions.organizations.mutations.generateUploadUrl);
  const saveLogo = useMutation(api.functions.organizations.mutations.saveLogo);
  const deleteLogo = useMutation(api.functions.organizations.mutations.deleteLogo);

  // Local state
  const [name, setName] = useState(organization.name);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [removeCurrentLogo, setRemoveCurrentLogo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = organization.role === 'admin';
  const currentLogoUrl = orgData?.logoUrl ?? null;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo must be less than 2MB');
        return;
      }

      setLogoFile(file);
      setRemoveCurrentLogo(false);

      const reader = new FileReader();
      reader.onloadend = (): void => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoRemove = (): void => {
    setLogoFile(null);
    setLogoPreview(null);
    setRemoveCurrentLogo(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!isAdmin) {
      toast.error('Only admins can update organization settings');
      return;
    }

    setLoading(true);

    try {
      // Handle logo upload/removal
      if (logoFile) {
        // Upload new logo
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': logoFile.type },
          body: logoFile,
        });

        if (!response.ok) {
          throw new Error('Failed to upload logo');
        }

        const result = (await response.json()) as { storageId: Id<"_storage"> };
        await saveLogo({
          workosId: organization.id,
          storageId: result.storageId,
        });
      } else if (removeCurrentLogo && currentLogoUrl) {
        // Remove existing logo
        await deleteLogo({ workosId: organization.id });
      }

      // Update organization name in WorkOS
      const nameChanged = name !== organization.name;
      if (nameChanged) {
        const response = await fetch(`/api/organizations/${organization.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });

        if (!response.ok) {
          throw new Error('Failed to update organization name');
        }
      }

      toast.success('Organization updated');
      triggerOrgRefresh();
      router.refresh();
      setIsOpen(false);
    } catch {
      toast.error('Failed to update organization');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean): void => {
    setIsOpen(open);
    if (open) {
      // Reset form state when opening
      setName(organization.name);
      setLogoFile(null);
      setLogoPreview(null);
      setRemoveCurrentLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const hasChanges =
    name !== organization.name ||
    logoFile !== null ||
    (removeCurrentLogo && currentLogoUrl !== null);

  const formContent = (
    <EditForm
      name={name}
      setName={setName}
      logoPreview={logoPreview}
      currentLogoUrl={removeCurrentLogo ? null : currentLogoUrl}
      onLogoChange={handleLogoChange}
      onLogoRemove={handleLogoRemove}
      fileInputRef={fileInputRef}
    />
  );

  const saveButton = (
    <SaveButton loading={loading} disabled={loading || !hasChanges} onClick={() => void handleSave()} />
  );

  // Use Drawer on mobile, Sheet on desktop
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <Card className="overflow-hidden py-0">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <OrganizationInfo
                name={organization.name}
                role={organization.role}
                logoUrl={currentLogoUrl}
              />
              {isAdmin && (
                <DrawerTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                </DrawerTrigger>
              )}
            </div>
          </CardContent>
        </Card>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit Organization</DrawerTitle>
            <DrawerDescription>Update your organization details</DrawerDescription>
          </DrawerHeader>
          {formContent}
          <DrawerFooter>{saveButton}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <Card className="overflow-hidden py-0">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <OrganizationInfo
              name={organization.name}
              role={organization.role}
              logoUrl={currentLogoUrl}
            />
            {isAdmin && (
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
              </SheetTrigger>
            )}
          </div>
        </CardContent>
      </Card>

      <SheetContent side="right" className="p-0">
        <SheetHeader className="p-4 pb-0">
          <SheetTitle>Edit Organization</SheetTitle>
          <SheetDescription>Update your organization details</SheetDescription>
        </SheetHeader>
        {formContent}
        <SheetFooter className="p-4 pt-0">{saveButton}</SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
