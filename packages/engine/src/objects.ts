export interface NovelObject {
  id: string;
  type: 'Layout' | 'CustomLayout' | 'Image' | 'TextBox' | 'Text';
}

export interface LayoutObject extends NovelObject {
  type: 'Layout';
  style?: string;
  children: NovelObject[];
}

export interface CustomLayoutObject<Component> extends NovelObject {
  type: 'CustomLayout';
  component: Component;
  children: NovelObject[];
}

export interface ImageObject extends NovelObject {
  type: 'Image';
  style?: string;
  src: string;
}

export interface TextObject extends NovelObject {
  type: 'Text';
  style?: string;
  content: string;
}

export interface TextBoxObject extends NovelObject {
  type: 'TextBox';
  style?: string;
  children: TextObject[];
}

type LayoutProps = Omit<LayoutObject, 'type' | 'children'>;
export const layout =
  (props: LayoutProps) =>
  (children: NovelObject[]): LayoutObject => ({
    ...props,
    type: 'Layout',
    children,
  });

type CustomLayoutProps<Component> = Omit<
  CustomLayoutObject<Component>,
  'type' | 'children'
>;
export const customLayout =
  <Component>(props: CustomLayoutProps<Component>) =>
  (children: NovelObject[]): CustomLayoutObject<Component> => ({
    ...props,
    type: 'CustomLayout',
    children,
  });

type ImageProps = Omit<ImageObject, 'type'>;
export const img = (props: ImageProps): ImageObject => ({
  ...props,
  type: 'Image',
});

type TextBoxProps = Omit<TextBoxObject, 'type' | 'texts'>;
export const textBox =
  (props: TextBoxProps) =>
  (children: TextObject[]): TextBoxObject => ({
    ...props,
    type: 'TextBox',
    children,
  });

type TextProps = Omit<TextObject, 'type'>;
export const text = (props: TextProps): TextObject => ({
  ...props,
  type: 'Text',
});
