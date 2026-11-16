export const LOGO_URL =
  "https://res.cloudinary.com/dyfnobo9r/image/upload/v1773632695/Realtor_Martha_Logo_Final.Black_n1rad7.png";

export const SITE = {
  name: "Martha Properties",
  shortName: "Martha",
  tagline: "Properties",
  phone: "+254 732 868220",
  phoneHref: "tel:+254732868220",
  website: "https://www.marthapropertiesco.ke",
  websiteLabel: "www.marthapropertiesco.ke",
  logo: LOGO_URL,
};

export type SiteContact = {
  phone: string;
  phoneHref: string;
  website: string;
  websiteLabel: string;
  email: string;
};

export const DEFAULT_CONTACT: SiteContact = {
  phone: SITE.phone,
  phoneHref: SITE.phoneHref,
  website: SITE.website,
  websiteLabel: SITE.websiteLabel,
  email: "",
};

export const CONTACT_SETTINGS_KEY = "contact";
