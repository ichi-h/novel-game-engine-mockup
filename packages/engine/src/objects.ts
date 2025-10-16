export interface NovelObject {
  id: string;
  type: string;
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
const isLayout = (obj: NovelObject): obj is LayoutObject =>
  obj.type === 'Layout';

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
const isCustomLayout = <Component>(
  obj: NovelObject,
): obj is CustomLayoutObject<Component> => obj.type === 'CustomLayout';

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
const isTextBox = (obj: NovelObject): obj is TextBoxObject =>
  obj.type === 'TextBox';

type TextProps = Omit<TextObject, 'type'>;
export const text = (props: TextProps): TextObject => ({
  ...props,
  type: 'Text',
});

export class NovelUI<Component = unknown> {
  objects: NovelObject[];

  constructor(objects: NovelObject[] = []) {
    this.objects = objects;
  }

  /**
   * Adds a new NovelObject to UI.objects
   * @param object - The NovelObject to add
   * @param layoutId - Optional layout ID where the object should be added. If not specified, adds to root objects array
   * @throws Error if layoutId doesn't exist
   * @throws Error if object.id already exists (checks recursively)
   */
  addObject(object: NovelObject, layoutId?: string): void {
    // Check for duplicate IDs recursively
    if (this.hasId(object.id, this.objects)) {
      throw new Error(`Object with id "${object.id}" already exists`);
    }

    // If no layoutId is specified, add to root objects array
    if (layoutId === undefined) {
      this.objects.push(object);
      return;
    }

    // Find and add to the specified layout
    const added = this.addToLayout(object, layoutId, this.objects);
    if (!added) {
      throw new Error(`Layout with id "${layoutId}" not found`);
    }
  }

  /**
   * Adds a new TextObject to a TextBoxObject's children
   * @param textObject - The TextObject to add
   * @param textBoxId - The TextBox ID where the text should be added
   * @throws Error if textBoxId doesn't exist
   * @throws Error if textObject.id already exists (checks recursively)
   */
  addText(textObject: TextObject, textBoxId: string): void {
    // Check for duplicate IDs recursively
    if (this.hasId(textObject.id, this.objects)) {
      throw new Error(`Object with id "${textObject.id}" already exists`);
    }

    // Find and add to the specified textbox
    const added = this.addToTextBox(textObject, textBoxId, this.objects);
    if (!added) {
      throw new Error(`TextBox with id "${textBoxId}" not found`);
    }
  }

  /**
   * Recursively checks if an ID exists in the object tree
   */
  private hasId(id: string, objects: NovelObject[]): boolean {
    for (const obj of objects) {
      if (obj.id === id) {
        return true;
      }

      // Check children for Layout and CustomLayout objects
      if (isLayout(obj) || isCustomLayout<Component>(obj)) {
        if (this.hasId(id, obj.children)) {
          return true;
        }
      }

      // Check children for TextBox objects
      if (isTextBox(obj)) {
        if (this.hasId(id, obj.children)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Recursively finds a layout by ID and adds the object to its children
   * @returns true if the layout was found and object was added, false otherwise
   */
  private addToLayout(
    object: NovelObject,
    layoutId: string,
    objects: NovelObject[],
  ): boolean {
    for (const obj of objects) {
      if (obj.id === layoutId) {
        if (isLayout(obj) || isCustomLayout<Component>(obj)) {
          obj.children.push(object);
          return true;
        }
        // ID matches but it's not a layout type that can have children
        return false;
      }

      // Search in children for Layout and CustomLayout objects
      if (isLayout(obj) || isCustomLayout<Component>(obj)) {
        if (this.addToLayout(object, layoutId, obj.children)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Recursively finds a textbox by ID and adds the text object to its children
   * @returns true if the textbox was found and text object was added, false otherwise
   */
  private addToTextBox(
    textObject: TextObject,
    textBoxId: string,
    objects: NovelObject[],
  ): boolean {
    for (const obj of objects) {
      // Found the target textbox
      if (obj.id === textBoxId) {
        if (isTextBox(obj)) {
          obj.children.push(textObject);
          return true;
        }
        // ID matches but it's not a TextBox type
        return false;
      }

      // Search in children for Layout and CustomLayout objects
      if (isLayout(obj) || isCustomLayout<Component>(obj)) {
        if (this.addToTextBox(textObject, textBoxId, obj.children)) {
          return true;
        }
      }
    }

    return false;
  }
}
