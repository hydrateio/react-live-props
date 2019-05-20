import { ArrayFieldRenderer, BoolFieldRenderer, EnumFieldRenderer, NumberFieldRenderer, ShapeFieldRenderer, StringFieldRenderer, AnyFieldRenderer, NodeFieldRenderer } from './types'

export { default as PropertyRenderer } from './Property'
export { RendererContext } from './Resolver'

const Renderers = {
  arrayOf: ArrayFieldRenderer,
  bool: BoolFieldRenderer,
  enum: EnumFieldRenderer,
  number: NumberFieldRenderer,
  shape: ShapeFieldRenderer,
  string: StringFieldRenderer,
  any: AnyFieldRenderer,
  node: NodeFieldRenderer
}
export { Renderers }
