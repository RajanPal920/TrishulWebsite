const modules = import.meta.glob<{ default: string }>("../assets/products/*.jpg", {
  eager: true,
});

export const productImages: Record<string, string> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    path.split("/").pop()!.replace(/\.jpg$/, ""),
    mod.default,
  ]),
);

export const productImage = (slug: string): string | undefined => productImages[slug];
