import type { Config } from 'shadcn-ui/config'

const config: Config = {
  $schema: 'https://ui.shadcn.com/schema.json',
  framework: 'react',
  style: 'default',
  tailwind: {
    config: 'tailwind.config.js',
    css: 'src/App.css',
    baseColor: 'zinc',
    cssVariables: true,
  },
  paths: {
    components: 'components',
    utils: 'components/utils',
  },
  alias: {
    "@/components": "components"
  }
}

export default config; 