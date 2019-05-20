import { ArrayOfFieldRenderer, ArrayFieldRenderer, UnionFieldRenderer, BoolFieldRenderer, EnumFieldRenderer, NumberFieldRenderer, ShapeFieldRenderer, StringFieldRenderer, AnyFieldRenderer, NodeFieldRenderer } from './types'

export { default as PropertyRenderer } from './Property'
export { RendererContext } from './Resolver'

const Renderers = {
  arrayOf: ArrayOfFieldRenderer,
  array: ArrayFieldRenderer,
  bool: BoolFieldRenderer,
  enum: EnumFieldRenderer,
  number: NumberFieldRenderer,
  shape: ShapeFieldRenderer,
  string: StringFieldRenderer,
  any: AnyFieldRenderer,
  node: NodeFieldRenderer,
  element: NodeFieldRenderer,
  union: UnionFieldRenderer
}
export { Renderers }
