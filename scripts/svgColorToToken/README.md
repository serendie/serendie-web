# SVG Color to Serendie Token Converter

This script converts hardcoded color values in SVG files to Serendie design token CSS variables based on Figma variable definitions.

## Usage

```bash
node scripts/svgColorToToken.js <svg-file> [options]
```

### Options
- `--in-place`: Replace the original file instead of creating a new `.tokenized.svg` file

### Examples

```bash
# Create a new file with tokens
node scripts/svgColorToToken.js chart.svg

# Replace the original file
node scripts/svgColorToToken.js chart.svg --in-place
```

## Color Mappings

Based on Figma variable definitions:

| Original Color | Design Token(s) | CSS Variable |
|----------------|----------------|--------------|
| #ffffff | `sd.system.color.chart.component.chartSurface` | `var(--sd-system-color-chart-component-chartSurface)` |
| #000000 | `sd.system.color.chart.component.onMarkLabel`<br>`sd.system.color.component.onSurface` | `var(--sd-system-color-chart-component-onMarkLabel)` |
| #696966 | `sd.system.color.chart.component.onChartSurface`<br>`sd.system.color.component.onSurfaceVariant` | `var(--sd-system-color-chart-component-onChartSurface)` |
| #C8C7C2 | `sd.system.color.component.outline` | `var(--sd-system-color-component-outline)` |
| #D9D8D3 | `sd.system.color.chart.component.scalemark` | `var(--sd-system-color-chart-component-scalemark)` |
| #428CFE | `sd.system.color.chart.mark.primary.04`<br>`sd.system.color.chart.component.threshold` | `var(--sd-system-color-chart-mark-primary-04)` |
| #8FAEFE | `sd.system.color.chart.mark.primary.03` | `var(--sd-system-color-chart-mark-primary-03)` |
| #BFCEFC | `sd.system.color.chart.mark.primary.02` | `var(--sd-system-color-chart-mark-primary-02)` |
| #D7DEFB | `sd.system.color.chart.mark.primary.01` | `var(--sd-system-color-chart-mark-primary-01)` |
| #0A69CF | `sd.system.color.chart.mark.primary.05` | `var(--sd-system-color-chart-mark-primary-05)` |
| #073165 | `sd.system.color.chart.mark.primary.06` | `var(--sd-system-color-chart-mark-primary-06)` |

## Example Transformation

### Before:
```svg
<svg>
  <rect fill="#428CFE" stroke="#D9D8D3" />
  <text fill="#000000">Label</text>
</svg>
```

### After:
```svg
<svg>
  <rect fill="var(--sd-system-color-chart-mark-primary-04)" stroke="var(--sd-system-color-chart-component-scalemark)" />
  <text fill="var(--sd-system-color-chart-component-onMarkLabel)">Label</text>
</svg>
```

## Notes

- The script matches colors case-insensitively
- When multiple tokens map to the same color, the first (primary) token is used
- The script reports all replacements made and their counts
- CSS variables follow the pattern: `var(--sd-system-color-*)`