export const VENDORS = ["soroush", "rubika"] as const;

export type Vendor = (typeof VENDORS)[number];

export const UNSPECIFIED_VENDOR = "unspecified";

export type VendorFilterValue = Vendor | typeof UNSPECIFIED_VENDOR;

export const VENDOR_LABELS: Record<Vendor, string> = {
  soroush: "سروش",
  rubika: "روبیکا",
};

export function isVendor(value: string): value is Vendor {
  return VENDORS.some((vendor) => vendor === value);
}

export function isVendorFilterValue(value: string): value is VendorFilterValue {
  return value === UNSPECIFIED_VENDOR || isVendor(value);
}
