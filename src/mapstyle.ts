/**
 * Expand the map style provided as argument of the Map constructor
 * @param style
 * @returns
 */
export function expandMapStyle(style): string {
  // testing if the style provided is of form "maptiler://some-style"
  const maptilerDomainRegex = /^maptiler:\/\/(.*)/;
  let match;
  const trimmed = style.trim();
  let expandedStyle;

  // The style was possibly already given as expanded URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    expandedStyle = trimmed;
  } else if ((match = maptilerDomainRegex.exec(trimmed)) !== null) {
    expandedStyle = `https://api.maptiler.com/maps/${match[1]}/style.json`;
  } else {
    // The style could also possibly just be the name of the style without any URI style
    expandedStyle = `https://api.maptiler.com/maps/${trimmed}/style.json`;
  }

  return expandedStyle;
}

/**
 * Type for object containing style details
 */
export type MapStylePreset = {
  readonly referenceStyleID: string;
  readonly name: string;
  readonly description: string;
  readonly variants: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly variantType: string;
    readonly description: string;
    readonly imageURL: string;
    readonly deprecated?: boolean;
    readonly deprecationMessage?: string;
  }>;
};

/**
 * An instance of MapStyleVariant contains information about a style to use that belong to a reference style
 */
export class MapStyleVariant {
  constructor(
    /**
     * Human-friendly name
     */
    private name: string,

    /**
     * Variant name the variant is addressed to from its reference style: `MapStyle.REFERNCE_STYLE_NAME.VARIANT_TYPE`
     */
    private variantType: string,

    /**
     * MapTiler Cloud id
     */
    private id: string,

    /**
     * Reference map style, used to retrieve sibling variants
     */
    private referenceStyle: ReferenceMapStyle,

    /**
     * Human-friendly description
     */
    private description: string,

    /**
     * URL to an image describing the style variant
     */
    private imageURL: string,

    /**
     * Whether this variant is deprecated or not
     */
    public deprecated: boolean = false,

    /**
     * Message to display when the variant is deprecated
     */
    public deprecationMessage?: string,
  ) {}

  /**
   * Get the human-friendly name
   * @returns
   */
  getName(): string {
    return this.name;
  }

  getFullName(): string {
    return `${this.referenceStyle.getName()} ${this.name}`;
  }

  /**
   * Get the variant type (eg. "DEFAULT", "DARK", "PASTEL", etc.)
   * @returns
   */
  getType(): string {
    return this.variantType;
  }

  /**
   * Get the MapTiler Cloud id
   * @returns
   */
  getId(): string {
    return this.id;
  }

  /**
   * Get the human-friendly description
   */
  getDescription(): string {
    return this.description;
  }

  /**
   * Get the reference style this variant belongs to
   * @returns
   */
  getReferenceStyle(): ReferenceMapStyle {
    return this.referenceStyle;
  }

  /**
   * Check if a variant of a given type exists for _this_ variants
   * (eg. if this is a "DARK", then we can check if there is a "LIGHT" variant of it)
   * @param variantType
   * @returns
   */
  hasVariant(variantType: string): boolean {
    return this.referenceStyle.hasVariant(variantType);
  }

  /**
   * Retrieve the variant of a given type. If not found, will return the "DEFAULT" variant.
   * (eg. _this_ "DARK" variant does not have any "PASTEL" variant, then the "DEFAULT" is returned)
   * @param variantType
   * @returns
   */
  getVariant(variantType: string): MapStyleVariant {
    const variant = this.referenceStyle.getVariant(variantType);
    this.warnIfDeprecated(variant);
    return variant;
  }

  /**
   * Get all the variants for _this_ variants, except _this_ current one
   * @returns
   */
  getVariants(): Array<MapStyleVariant> {
    return this.referenceStyle
      .getVariants()
      .filter((v) => v !== this)
      .map((v) => {
        this.warnIfDeprecated(v);
        return v;
      });
  }

  /**
   * Get the image URL that represent _this_ variant
   * @returns
   */
  getImageURL(): string {
    return this.imageURL;
  }

  /**
   * Get the style as usable by MapLibre, a string (URL) or a plain style description (StyleSpecification)
   * @returns
   */
  getExpandedStyleURL(): string {
    return expandMapStyle(this.getId());
  }

  warnIfDeprecated(variant: MapStyleVariant = this): MapStyleVariant {
    if (!variant.deprecated) return variant;

    if (variant.deprecationMessage) {
      console.warn(variant.deprecationMessage);
    } else {
      const name = variant.getFullName();
      console.warn(
        `Style "${name}" is deprecated and will be removed in a future version.`,
      );
    }

    return variant;
  }
}

/**
 * An instance of reference style contains a list of StyleVariants ordered by relevance
 */
export class ReferenceMapStyle {
  /**
   * Variants that belong to this reference style, key being the reference type
   */
  private variants: { [key: string]: MapStyleVariant } = {};

  /**
   * Variants that belong to this reference style, ordered by relevance
   */
  private orderedVariants: Array<MapStyleVariant> = [];

  constructor(
    /**
     * Human-friendly name of this reference style
     */
    private name: string,

    /**
     * ID of this reference style
     */
    private id: string,
  ) {}

  /**
   * Get the human-friendly name of this reference style
   * @returns
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get the id of _this_ reference style
   * @returns
   */
  getId(): string {
    return this.id;
  }

  /**
   * Add a variant to _this_ reference style
   * @param v
   */
  addVariant(v: MapStyleVariant) {
    this.variants[v.getType()] = v;
    this.orderedVariants.push(v);
  }

  /**
   * Check if a given variant type exists for this reference style
   * @param variantType
   * @returns
   */
  hasVariant(variantType: string): boolean {
    return variantType in this.variants;
  }

  /**
   * Get a given variant. If the given type of variant does not exist for this reference style,
   * then the most relevant default variant is returned instead
   * @param variantType
   * @returns
   */
  getVariant(variantType: string): MapStyleVariant {
    return variantType in this.variants
      ? this.variants[variantType]
      : this.orderedVariants[0];
  }

  /**
   * Get the list of variants for this reference style
   * @returns
   */
  getVariants(): Array<MapStyleVariant> {
    return Object.values(this.variants);
  }

  /**
   * Get the defualt variant for this reference style
   * @returns
   */
  getDefaultVariant(): MapStyleVariant {
    return this.orderedVariants[0].warnIfDeprecated();
  }
}

const MAP_STYLE_CONFIG = [
  {
    referenceStyleID: "STREETS_V2",
    name: "Streets",
    description: "",
    variants: [
      {
        id: "streets-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"streets-v2" is deprecated, use "streets-v4" instead`,
      },
      {
        id: "streets-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"streets-v2-dark" is deprecated, use "streets-v4-dark" instead`,
      },
      {
        id: "streets-v2-light",
        name: "Light",
        variantType: "LIGHT",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"streets-v2-light" is deprecated, use "streets-v4-light" instead`,
      },
      {
        id: "streets-v2-night",
        name: "Night",
        variantType: "NIGHT",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"streets-v2-night" is deprecated, use "streets-v4-night" instead`,
      },
      {
        id: "streets-v2-pastel",
        name: "Pastel",
        variantType: "PASTEL",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"streets-v2-pastel" is deprecated, use "streets-v4-pastel" instead`,
      },
    ],
  },
  {
    referenceStyleID: "STREETS_V4",
    name: "Streets",
    description: "",
    variants: [
      {
        id: "streets-v4",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "streets-v4-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
      {
        id: "streets-v4-pastel",
        name: "Pastel",
        variantType: "PASTEL",
        description: "",
        imageURL: "",
      },
    ],
  },
  {
    referenceStyleID: "BASE_V4",
    name: "Base",
    description: "",
    variants: [
      {
        id: "base-v4",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "base-v4-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
      {
        id: "base-v4-light",
        name: "Light",
        variantType: "LIGHT",
        description: "",
        imageURL: "",
      },
      {
        id: "base-v4-ai",
        name: "AI",
        variantType: "AI",
        description: "",
        imageURL: "",
      },
    ],
  },

  {
    referenceStyleID: "OUTDOOR_V2",
    name: "Outdoor",
    description: "",
    variants: [
      {
        id: "outdoor-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"outdoor-v2" is deprecated, use "outdoor-v4" instead`,
      },
      {
        id: "outdoor-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"outdoor-v2-dark" is deprecated, use "outdoor-v4-dark" instead`,
      },
    ],
  },

  {
    referenceStyleID: "WINTER_V2",
    name: "Winter",
    description: "",
    variants: [
      {
        id: "winter-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
        // this is not deprecated yet...
        // deprecated: true,
        // deprecationMessage: `"winter-v2" is deprecated, use "winter-v4" instead`,
      },
      {
        id: "winter-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
        // this is not deprecated yet...
        // deprecated: true,
        // deprecationMessage: `"winter-v2-dark" is deprecated, use "winter-v4-dark" instead`,
      },
    ],
  },

  {
    referenceStyleID: "WINTER_V4",
    name: "Winter",
    description: "",
    variants: [
      {
        id: "winter-v4",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "winter-v4-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
    ],
  },

  {
    referenceStyleID: "SATELLITE_V2",
    name: "Satellite",
    description: "",
    variants: [
      {
        id: "satellite",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"satellite" is deprecated, use "satellite-v4" instead`,
      },
    ],
  },

  {
    referenceStyleID: "HYBRID_V2",
    name: "Hybrid",
    description: "",
    variants: [
      {
        id: "hybrid",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
    ],
  },

  {
    referenceStyleID: "HYBRID_V4",
    name: "Hybrid",
    description: "",
    variants: [
      {
        id: "hybrid-v4",
        name: "Default",
        variantType: "DEFAULT",
        imageURL: "",
      },
      {
        id: "hybrid-v4-dark",
        name: "Dark",
        variantType: "DARK",
        imageURL: "",
      },
    ],
  },

  {
    referenceStyleID: "BASIC_V2",
    name: "Basic",
    description: "",
    variants: [
      {
        id: "basic-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"basic-v2" is deprecated, use "base-v4" instead`,
      },
      {
        id: "basic-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
        deprecationMessage: `"basic-v2" is deprecated, use "base-v4" instead`,
      },
      {
        id: "basic-v2-light",
        name: "Light",
        variantType: "LIGHT",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"basic-v2" is deprecated, use "base-v4" instead`,
      },
    ],
  },

  {
    referenceStyleID: "BRIGHT",
    name: "Bright",
    description: "",
    variants: [
      {
        id: "bright-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "bright-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
      {
        id: "bright-v2-light",
        name: "Light",
        variantType: "LIGHT",
        description: "",
        imageURL: "",
      },
      {
        id: "bright-v2-pastel",
        name: "Pastel",
        variantType: "PASTEL",
        description: "",
        imageURL: "",
      },
    ],
  },

  {
    referenceStyleID: "OPENSTREETMAP_V2",
    name: "OpenStreetMap",
    description: "",
    variants: [
      {
        id: "openstreetmap",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "openstreetmap-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
    ],
  },
  {
    referenceStyleID: "TOPO_V2",
    name: "Topo",
    description: "",
    variants: [
      {
        id: "topo-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"topo-v2" is deprecated, use "topo-v4" instead`,
      },
      {
        id: "topo-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"topo-v2-dark" is deprecated, use "topo-v4-dark" instead`,
      },
      {
        id: "topo-v2-shiny",
        name: "Shiny",
        variantType: "SHINY",
        description: "",
        imageURL: "",
        deprecated: true,
      },
      {
        id: "topo-v2-pastel",
        name: "Pastel",
        variantType: "PASTEL",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"topo-v2-pastel" is deprecated, use "topo-v4-pastel" instead`,
      },
      {
        id: "topo-v2-topographique",
        name: "Topographique",
        variantType: "TOPOGRAPHIQUE",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"topo-v2-topographique" is deprecated, use "topo-v4-topographique" instead`,
      },
    ],
  },

  {
    referenceStyleID: "VOYAGER_V2",
    name: "Voyager",
    description: "",
    variants: [
      {
        id: "voyager-v2",
        name: "Default",
        deprecated: true,
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "voyager-v2-darkmatter",
        name: "Darkmatter",
        deprecated: true,
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
      {
        id: "voyager-v2-positron",
        name: "Positron",
        deprecated: true,
        variantType: "LIGHT",
        description: "",
        imageURL: "",
      },
      {
        id: "voyager-v2-vintage",
        name: "Vintage",
        deprecated: true,
        variantType: "VINTAGE",
        description: "",
        imageURL: "",
      },
    ],
  },

  {
    referenceStyleID: "TONER_V2",
    name: "Toner",
    description: "",
    deprecated: true,
    deprecationMessage: `"toner-v2" is deprecated, and will be no longer be a default style in the future`,
    variants: [
      {
        id: "toner-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"toner-v2" is deprecated, and may be removed in future versions.`,
      },
      {
        id: "toner-v2-background",
        name: "Background",
        variantType: "BACKGROUND",
        deprecated: true,
        description: "",
        imageURL: "",
        deprecationMessage: `"toner-v2-background" is deprecated, and may be removed in future versions.`,
      },
      {
        id: "toner-v2-lite",
        name: "Lite",
        variantType: "LITE",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"toner-v2-lite" is deprecated, and may be removed in future versions.`,
      },
      {
        id: "toner-v2-lines",
        name: "Lines",
        variantType: "LINES",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"toner-v2-lines" is deprecated, and may be removed in future versions.`,
      },
    ],
  },

  {
    referenceStyleID: "DATAVIZ_V2",
    name: "Dataviz",
    description: "",
    variants: [
      {
        id: "dataviz",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"dataviz" is deprecated, use "dataviz-v4" instead`,
      },
      {
        id: "dataviz-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"dataviz-dark" is deprecated, use "dataviz-v4-dark" instead`,
      },
      {
        id: "dataviz-light",
        name: "Light",
        variantType: "LIGHT",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"dataviz-light" is deprecated, use "dataviz-v4-light" instead`,
      },
    ],
  },

  {
    referenceStyleID: "BACKDROP_V2",
    name: "Backdrop",
    description: "",
    variants: [
      {
        id: "backdrop",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"backdrop" is deprecated, use "backdrop-v4" instead`,
      },
      {
        id: "backdrop-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"backdrop-dark" is deprecated, use "backdrop-v4-dark" instead`,
      },
      {
        id: "backdrop-light",
        name: "Light",
        variantType: "LIGHT",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"backdrop-light" is deprecated, use "backdrop-v4-light" instead`,
      },
    ],
  },

  {
    referenceStyleID: "OCEAN_V2",
    name: "Ocean",
    description: "",
    variants: [
      {
        id: "ocean",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"ocean" is deprecated, use "ocean-v4" instead`,
      },
    ],
  },
  {
    referenceStyleID: "AQUARELLE_V2",
    name: "Aquarelle",
    description: "Watercolor map for creative use",
    variants: [
      {
        id: "aquarelle",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"aquarelle" is deprecated, use "aquarelle-v4" instead`,
      },
      {
        id: "aquarelle-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"aquarelle-dark" is deprecated, use "aquarelle-v4-dark" instead`,
      },
      {
        id: "aquarelle-vivid",
        name: "Vivid",
        variantType: "VIVID",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"aquarelle-vivid" is deprecated, use "aquarelle-v4-vivid" instead`,
      },
    ],
  },
  {
    referenceStyleID: "LANDSCAPE_V2",
    name: "Landscape",
    description: "Terrain map for data overlays and visualisations",
    variants: [
      {
        id: "landscape",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"landscape" is deprecated, use "landscape-v4" instead`,
      },
      {
        id: "landscape-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"landscape-dark" is deprecated, use "landscape-v4-dark" instead`,
      },
      {
        id: "landscape-vivid",
        name: "Vivid",
        variantType: "VIVID",
        description: "",
        imageURL: "",
        deprecated: true,
        deprecationMessage: `"landscape-vivid" is deprecated, use "landscape-v4-vivid" instead`,
      },
    ],
  },
  {
    referenceStyleID: "LANDSCAPE_V4",
    name: "Landscape",
    description: "Terrain map for data overlays and visualisations",
    variants: [
      {
        id: "landscape-v4",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "landscape-v4-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
      {
        id: "landscape-v4-vivid",
        name: "Vivid",
        variantType: "VIVID",
        description: "",
        imageURL: "",
      },
    ],
  },
  {
    referenceStyleID: "SATELLITE_V4",
    name: "Satellite",
    description: "",
    variants: [
      {
        id: "satellite-v4",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "satellite-v4-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
    ],
  },
  {
    referenceStyleID: "DATAVIZ_V4",
    name: "Dataviz",
    description: "",
    variants: [
      {
        id: "dataviz-v4",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "dataviz-v4-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
      {
        id: "dataviz-v4-light",
        name: "Light",
        variantType: "LIGHT",
        description: "",
        imageURL: "",
      },
    ],
  },
  {
    referenceStyleID: "OUTDOOR_V4",
    name: "Outdoor",
    description: "",
    variants: [
      {
        id: "outdoor-v4",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "outdoor-v4-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
    ],
  },
  {
    referenceStyleID: "BACKDROP_V4",
    name: "Backdrop",
    description: "",
    variants: [
      {
        id: "backdrop-v4",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "backdrop-v4-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
      {
        id: "backdrop-v4-light",
        name: "Light",
        variantType: "LIGHT",
        description: "",
        imageURL: "",
      },
    ],
  },
  {
    referenceStyleID: "AQUARELLE_V4",
    name: "Aquarelle",
    description: "Watercolor map for creative use",
    variants: [
      {
        id: "aquarelle-v4",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "aquarelle-v4-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
      {
        id: "aquarelle-v4-vivid",
        name: "Vivid",
        variantType: "VIVID",
        description: "",
        imageURL: "",
      },
    ],
  },
  {
    referenceStyleID: "OCEAN_V4",
    name: "Ocean",
    description: "",
    variants: [
      {
        id: "ocean-v4",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "ocean-v4-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
    ],
  },
  {
    referenceStyleID: "TOPO_V4",
    name: "Topo",
    description: "",
    variants: [
      {
        id: "topo-v4",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "topo-v4-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
      {
        id: "topo-v4-pastel",
        name: "Pastel",
        variantType: "PASTEL",
        description: "",
        imageURL: "",
      },
      {
        id: "topo-v4-topographique",
        name: "Topographique",
        variantType: "TOPOGRAPHIQUE",
        description: "",
        imageURL: "",
      },
    ],
  },
] as const;

/**
 * Map of default reference styles to their versioned counterparts.
 * This is make it easier to version the default reference styles.
 */
export const defaultReferenceStyleMap = {
  STREETS: "STREETS_V4",
  BASIC: "BASIC_V2",
  BASE: "BASE_V4",
  LANDSCAPE: "LANDSCAPE_V4",
  AQUARELLE: "AQUARELLE_V4",
  SATELLITE: "SATELLITE_V4",
  WINTER: "WINTER_V4",
  HYBRID: "HYBRID_V4",
  OCEAN: "OCEAN_V4",
  OUTDOOR: "OUTDOOR_V4",
  TONER: "TONER_V2",
  TOPO: "TOPO_V4",
  OPENSTREETMAP: "OPENSTREETMAP_V2",
  DATAVIZ: "DATAVIZ_V4",
  BACKDROP: "BACKDROP_V4",
  VOYAGER: "VOYAGER_V2",
} as const;

// Helper types to build the MapStyleType, this is to avoid having to manually define the MapStyleType

// get the ID of the config eg. STREETS_V2, STREETS_V4, etc.
type ConfigID = (typeof MAP_STYLE_CONFIG)[number]["referenceStyleID"];

// filter the config to only get the variants for the given referenceStyleID
type ConfigVariant<T extends ConfigID> = Extract<
  (typeof MAP_STYLE_CONFIG)[number],
  { referenceStyleID: T }
>["variants"][number]["variantType"];

// build it together to get the type of the MapStyleType
type BaseMapStyleType = {
  [K in ConfigID]: ReferenceMapStyle & {
    [V in ConfigVariant<K>]: MapStyleVariant;
  };
};

// map the default reference styles in defaultReferenceStyleMap to the MapStyleType
export type MapStyleType = BaseMapStyleType & {
  [K in keyof typeof defaultReferenceStyleMap]: BaseMapStyleType[(typeof defaultReferenceStyleMap)[K] &
    ConfigID];
};

// cast to a mutable array for the runtime logic
export const mapStylePresetList: MapStylePreset[] = [
  ...MAP_STYLE_CONFIG,
] as unknown as MapStylePreset[];

// predecate to map the namespaced styles to the default reference style map
function applyVersionToDefaultReferenceStyle(
  defaultKey: string,
  referenceKey: string,
) {
  if (
    mapStylePresetList.find((style) => style.referenceStyleID === defaultKey)
  ) {
    console.warn(
      `Default reference style ${defaultKey} already exists, it will be overwritten...`,
    );
  }

  const versionedMapStyle = mapStylePresetList.find(
    (style) => style.referenceStyleID === referenceKey,
  );
  if (!versionedMapStyle) {
    throw new Error(
      `Versioned map style not found for reference style: ${referenceKey}`,
    );
  }
  const defaultStyle = {
    ...versionedMapStyle,
    referenceStyleID: defaultKey,
  };
  mapStylePresetList.push(defaultStyle);
}

// use the predecate...
Object.entries(defaultReferenceStyleMap).forEach(
  ([defaultKey, referenceKey]) => {
    applyVersionToDefaultReferenceStyle(defaultKey, referenceKey);
  },
);

function makeReferenceStyleProxy(referenceStyle: ReferenceMapStyle) {
  return new Proxy(referenceStyle, {
    get(target, prop, receiver) {
      if (target.hasVariant(prop as string)) {
        return target.getVariant(prop as string);
      }

      // This variant does not exist for this style, but since it's full uppercase
      // we guess that the dev tries to access a style variant. So instead of
      // returning the default (STREETS.DEFAULT), we return the non-variant of the current style
      if (prop.toString().toUpperCase() === (prop as string)) {
        return referenceStyle.getDefaultVariant();
      }

      const style = Reflect.get(target, prop, receiver);

      return style;
    },
  });
}

function buildMapStyles(): MapStyleType {
  const mapStyle = {};

  for (let i = 0; i < mapStylePresetList.length; i += 1) {
    const refStyleInfo = mapStylePresetList[i];

    const refStyle = makeReferenceStyleProxy(
      new ReferenceMapStyle(refStyleInfo.name, refStyleInfo.referenceStyleID),
    );

    for (let j = 0; j < refStyleInfo.variants.length; j += 1) {
      const variantInfo = refStyleInfo.variants[j];
      const variant = new MapStyleVariant(
        variantInfo.name, // name
        variantInfo.variantType, // variantType
        variantInfo.id, // id
        refStyle, // referenceStyle
        variantInfo.description,
        variantInfo.imageURL, // imageURL
        variantInfo.deprecated, // deprecated
      );

      refStyle.addVariant(variant);
    }
    mapStyle[refStyleInfo.referenceStyleID] = refStyle;
  }
  return mapStyle as MapStyleType;
}

export function styleToStyle(
  style: string | ReferenceMapStyle | MapStyleVariant | null | undefined,
): string {
  if (!style) {
    return MapStyle[mapStylePresetList[0].referenceStyleID]
      .getDefaultVariant()
      .getId();
  }

  // If the provided style is a shorthand (eg. "streets-v2") then we make sure it's trimmed and lowercase
  if (typeof style === "string" || style instanceof String) {
    return style.trim().toLowerCase();
  }

  if (style instanceof MapStyleVariant) {
    return style.getId();
  }

  if (style instanceof ReferenceMapStyle) {
    return style.getDefaultVariant().getId();
  }
}

/**
 * Contains all the reference map style created by MapTiler team as well as all the variants.
 * For example, `MapStyle.STREETS` and the variants:
 * - `MapStyle.STREETS.DARK`
 * - `MapStyle.STREETS.LIGHT`
 * - `MapStyle.STREETS.PASTEL`
 *
 */
export const MapStyle: MapStyleType = buildMapStyles();
