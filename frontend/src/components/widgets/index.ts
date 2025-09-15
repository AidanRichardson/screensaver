const widgetModules = import.meta.glob("./*.tsx", { eager: true });
const metaModules = import.meta.glob("./*.meta.ts", { eager: true });

export const widgetRegistry: Record<
  string,
  {
    Component: React.ComponentType<any>;
    defaultSize: { w: number; h: number };
    defaultCustomisation: any;
  }
> = {};

// Wire them together
for (const [path, mod] of Object.entries(widgetModules)) {
  const name = path.match(/\.\/(.*)\.tsx$/)?.[1];
  const meta = metaModules[`./${name}.meta.ts`] as any;

  if (mod && (mod as any).default && meta?.widgetMeta) {
    widgetRegistry[meta.widgetMeta.type] = {
      Component: (mod as any).default,
      defaultSize: meta.widgetMeta.defaultSize,
      defaultCustomisation: meta.widgetMeta.defaultCustomisation,
    };
  }
}
