import { ArrayFieldRenderer, BoolFieldRenderer, EnumFieldRenderer, NumberFieldRenderer, ShapeFieldRenderer, StringFieldRenderer, AnyFieldRenderer } from './types'

export { default as PropertyRenderer, ObjectArrayRenderer, ObjectRenderer, AddHtmlAttributeRenderer } from './Property'
export { RendererContext } from './Resolver'

const Renderers = {
  arrayOf: ArrayFieldRenderer,
  bool: BoolFieldRenderer,
  enum: EnumFieldRenderer,
  number: NumberFieldRenderer,
  shape: ShapeFieldRenderer,
  string: StringFieldRenderer,
  any: AnyFieldRenderer
}
export { Renderers }
