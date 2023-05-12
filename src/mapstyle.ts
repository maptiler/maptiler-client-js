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
  referenceStyleID: string;
  name: string;
  description: string;
  variants: Array<{
    id: string;
    name: string;
    variantType: string;
    description: string;
    imageURL: string;
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
    private imageURL: string
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
    return this.referenceStyle.getVariant(variantType);
  }

  /**
   * Get all the variants for _this_ variants, except _this_ current one
   * @returns
   */
  getVariants(): Array<MapStyleVariant> {
    return this.referenceStyle.getVariants().filter((v) => v !== this);
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
    private id: string
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
    return this.orderedVariants[0];
  }
}

/**
 * All the styles and variants maintained by MapTiler.
 */
export type MapStyleType = {
  /**
   * Suitable for navigation, with high level of detail on urban areas, plenty of POIs and 3D buildings
   */
  STREETS: ReferenceMapStyle & {
    /**
     * Suitable for navigation, with high level of detail on urban areas, plenty of POIs and 3D buildings.
     */
    DEFAULT: MapStyleVariant;
    /**
     * Suitable for navigation, with high level of detail on urban areas, plenty of POIs and 3D buildings, in dark mode.
     */
    DARK: MapStyleVariant;
    /**
     * Suitable for navigation, with high level of detail on urban areas, plenty of POIs and 3D buildings, in light mode.
     */
    LIGHT: MapStyleVariant;
    /**
     * Suitable for navigation, with high level of detail on urban areas, plenty of POIs and 3D buildings, in blue night mode.
     */
    NIGHT: MapStyleVariant;
    /**
     * Suitable for navigation, with high level of detail on urban areas, plenty of POIs and 3D buildings, with a pastel color palette.
     */
    PASTEL: MapStyleVariant;
  };

  /**
   * Suitable for outdoor activities. With elevation isolines and hillshading.
   */
  OUTDOOR: ReferenceMapStyle & {
    /**
     * Suitable for outdoor activities. With elevation isolines and hillshading.
     */
    DEFAULT: MapStyleVariant;

    /**
     * Suitable for outdoor activities. With elevation isolines and hillshading, in dark mode.
     */
    DARK: MapStyleVariant;
  };

  /**
   * Suitabe for winter outdoor activities. With ski tracks, elevation isolines and hillshading.
   */
  WINTER: ReferenceMapStyle & {
    /**
     * Suitabe for winter outdoor activities. With ski tracks, elevation isolines and hillshading.
     */
    DEFAULT: MapStyleVariant;
    /**
     * Suitabe for winter outdoor activities. With ski tracks, elevation isolines and hillshading, in dark mode.
     */
    DARK: MapStyleVariant;
  };

  /**
   * High resolution imagery only, without any label.
   */
  SATELLITE: ReferenceMapStyle & {
    /**
     * High resolution imagery only, without any label.
     */
    DEFAULT: MapStyleVariant;
  };

  /**
   * High resolution imagery with labels, political borders and roads.
   */
  HYBRID: ReferenceMapStyle & {
    /**
     * High resolution imagery with labels, political borders and roads.
     */
    DEFAULT: MapStyleVariant;
  };

  /**
   * A minimalist street-oriented style without POI
   */
  BASIC: ReferenceMapStyle & {
    /**
     * A minimalist street-oriented style without POI
     */
    DEFAULT: MapStyleVariant;
    /**
     * A minimalist street-oriented style without POI, in dark mode
     */
    DARK: MapStyleVariant;
    /**
     * A minimalist street-oriented style without POI, in light mode
     */
    LIGHT: MapStyleVariant;
  };

  /**
   * A bright street-oriented style, a nice alternative to `streets`
   */
  BRIGHT: ReferenceMapStyle & {
    /**
     * A bright street-oriented style, a nice alternative to `streets`
     */
    DEFAULT: MapStyleVariant;
    /**
     * A bright street-oriented style, a nice alternative to `streets`, in dark mode
     */
    DARK: MapStyleVariant;
    /**
     * A bright street-oriented style, a nice alternative to `streets`, in light mode
     */
    LIGHT: MapStyleVariant;
    /**
     * A bright street-oriented style, a nice alternative to `streets`, with a soft pastel color palette
     */
    PASTEL: MapStyleVariant;
  };

  /**
   * Classic OpenStreetMap style
   */
  OPENSTREETMAP: ReferenceMapStyle & {
    DEFAULT: MapStyleVariant;
  };

  /**
   * A nice high-contrast, yet less saturated alternative to the `outdoor` style, with hillshading, 3D buildings and fairly high street details
   */
  TOPO: ReferenceMapStyle & {
    /**
     * A nice high-contrast, yet less saturated alternative to the `outdoor` style, with hillshading, 3D buildings and fairly high street details
     */
    DEFAULT: MapStyleVariant;
    /**
     * A nice high-contrast, yet less saturated alternative to the `outdoor` style, with hillshading, 3D buildings and fairly high street details, in dark mode
     */
    DARK: MapStyleVariant;
    /**
     * A nice high-contrast, and high saturation alternative to the `outdoor` style, with hillshading, 3D buildings and fairly high street details
     */
    SHINY: MapStyleVariant;
    /**
     * A nice low-contrast, alternative to the `outdoor` style, with hillshading, 3D buildings and fairly high street details, using a soft pastel color palette
     */
    PASTEL: MapStyleVariant;

    /**
     * A nice very high-contrast, yet less saturated alternative to the `outdoor` style, with hillshading, 3D buildings and fairly high street details
     */
    TOPOGRAPHIQUE: MapStyleVariant;
  };

  /**
   * A nice alternative to `streets` with a soft color palette
   */
  VOYAGER: ReferenceMapStyle & {
    /**
     * A nice alternative to `streets` with a soft color palette
     */
    DEFAULT: MapStyleVariant;
    /**
     * A nice alternative to `streets`, in very dark mode
     */
    DARK: MapStyleVariant;
    /**
     * A nice alternative to `streets`, in light mode
     */
    LIGHT: MapStyleVariant;
    /**
     * A nice alternative to `streets` with a soft sepia color palette and vintage look
     */
    VINTAGE: MapStyleVariant;
  };

  /**
   * A bold very high contrast black and white (no gray!) style for the city
   */
  TONER: ReferenceMapStyle & {
    /**
     * A bold very high contrast black and white (no gray!) style for the city
     */
    DEFAULT: MapStyleVariant;
    /**
     * A bold very high contrast black and white (no gray!) style for the city, without any label
     */
    BACKGROUND: MapStyleVariant;
    /**
     * A bold very high contrast, yet faded, style for the city
     */
    LITE: MapStyleVariant;
    /**
     * A bold very high contrast black and white (no gray!) style for the city, with no building, only roads!
     */
    LINES: MapStyleVariant;
  };

  /**
   * Minimalist style, perfect for data visualization
   */
  DATAVIZ: ReferenceMapStyle & {
    /**
     *  Minimalist style, perfect for data visualization
     */
    DEFAULT: MapStyleVariant;

    /**
     *  Minimalist style, perfect for data visualization in dark mode
     */
    DARK: MapStyleVariant;

    /**
     *  Minimalist style, perfect for data visualization in light mode
     */
    LIGHT: MapStyleVariant;
  };

  /**
   * Explore deep see trenches and mountains, with isolines and depth labels
   */
  OCEAN: ReferenceMapStyle & {
    /**
     * Explore deep see trenches and mountains, with isolines and depth labels
     */
    DEFAULT: MapStyleVariant;
  };
};

export const mapStylePresetList: Array<MapStylePreset> = [
  {
    referenceStyleID: "STREETS",
    name: "Streets",
    description: "",
    variants: [
      {
        id: "streets-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "streets-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
      {
        id: "streets-v2-light",
        name: "Light",
        variantType: "LIGHT",
        description: "",
        imageURL: "",
      },
      {
        id: "streets-v2-night",
        name: "Night",
        variantType: "NIGHT",
        description: "",
        imageURL: "",
      },
      {
        id: "streets-v2-pastel",
        name: "Pastel",
        variantType: "PASTEL",
        description: "",
        imageURL: "",
      },
    ],
  },

  {
    referenceStyleID: "OUTDOOR",
    name: "Outdoor",
    description: "",
    variants: [
      {
        id: "outdoor-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "outdoor-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
    ],
  },

  {
    referenceStyleID: "WINTER",
    name: "Winter",
    description: "",
    variants: [
      {
        id: "winter-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "winter-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
    ],
  },

  {
    referenceStyleID: "SATELLITE",
    name: "Satellite",
    description: "",
    variants: [
      {
        id: "satellite",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
    ],
  },

  {
    referenceStyleID: "HYBRID",
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
    referenceStyleID: "BASIC",
    name: "Basic",
    description: "",
    variants: [
      {
        id: "basic-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "basic-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
      {
        id: "basic-v2-light",
        name: "Light",
        variantType: "LIGHT",
        description: "",
        imageURL: "",
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
    referenceStyleID: "OPENSTREETMAP",
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
    ],
  },

  {
    referenceStyleID: "TOPO",
    name: "Topo",
    description: "",
    variants: [
      {
        id: "topo-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "topo-v2-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
      {
        id: "topo-v2-shiny",
        name: "Shiny",
        variantType: "SHINY",
        description: "",
        imageURL: "",
      },
      {
        id: "topo-v2-pastel",
        name: "Pastel",
        variantType: "PASTEL",
        description: "",
        imageURL: "",
      },
      {
        id: "topo-v2-topographique",
        name: "Topographique",
        variantType: "TOPOGRAPHIQUE",
        description: "",
        imageURL: "",
      },
    ],
  },

  {
    referenceStyleID: "VOYAGER",
    name: "Voyager",
    description: "",
    variants: [
      {
        id: "voyager-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "voyager-v2-darkmatter",
        name: "Darkmatter",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
      {
        id: "voyager-v2-positron",
        name: "Positron",
        variantType: "LIGHT",
        description: "",
        imageURL: "",
      },
      {
        id: "voyager-v2-vintage",
        name: "Vintage",
        variantType: "VINTAGE",
        description: "",
        imageURL: "",
      },
    ],
  },

  {
    referenceStyleID: "TONER",
    name: "Toner",
    description: "",
    variants: [
      {
        id: "toner-v2",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "toner-v2-background",
        name: "Background",
        variantType: "BACKGROUND",
        description: "",
        imageURL: "",
      },
      {
        id: "toner-v2-lite",
        name: "Lite",
        variantType: "LITE",
        description: "",
        imageURL: "",
      },
      {
        id: "toner-v2-lines",
        name: "Lines",
        variantType: "LINES",
        description: "",
        imageURL: "",
      },
    ],
  },

  {
    referenceStyleID: "DATAVIZ",
    name: "Dataviz",
    description: "",
    variants: [
      {
        id: "dataviz",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
      {
        id: "dataviz-dark",
        name: "Dark",
        variantType: "DARK",
        description: "",
        imageURL: "",
      },
      {
        id: "dataviz-light",
        name: "Light",
        variantType: "LIGHT",
        description: "",
        imageURL: "",
      },
    ],
  },

  {
    referenceStyleID: "OCEAN",
    name: "Ocean",
    description: "",
    variants: [
      {
        id: "ocean",
        name: "Default",
        variantType: "DEFAULT",
        description: "",
        imageURL: "",
      },
    ],
  },
];

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

      return Reflect.get(target, prop, receiver);
    },
  });
}

function buildMapStyles(): MapStyleType {
  const mapStyle = {};

  for (let i = 0; i < mapStylePresetList.length; i += 1) {
    const refStyleInfo = mapStylePresetList[i];

    const refStyle = makeReferenceStyleProxy(
      new ReferenceMapStyle(refStyleInfo.name, refStyleInfo.referenceStyleID)
    );

    for (let j = 0; j < refStyleInfo.variants.length; j += 1) {
      const variantInfo = refStyleInfo.variants[j];
      const variant = new MapStyleVariant(
        variantInfo.name, // name
        variantInfo.variantType, // variantType
        variantInfo.id, // id
        refStyle, // referenceStyle
        variantInfo.description,
        variantInfo.imageURL // imageURL
      );

      refStyle.addVariant(variant);
    }
    mapStyle[refStyleInfo.referenceStyleID] = refStyle;
  }
  return mapStyle as MapStyleType;
}

export function styleToStyle(
  style: string | ReferenceMapStyle | MapStyleVariant | null | undefined
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
