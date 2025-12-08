import {
  isLayout,
  isTextBox,
  type NovelWidget,
  type TextWidget,
} from './widgets';

export class WidgetManager {
  private _widgets: NovelWidget[];

  constructor(widgets: NovelWidget[] = []) {
    this._widgets = widgets;
  }

  public get widgets(): readonly NovelWidget[] {
    return Object.freeze([...this._widgets]);
  }

  /**
   * Adds a new NovelWidget
   * @param widget - The NovelWidget to add
   * @param layoutId - Optional layout ID where the widget should be added. If not specified, adds to root
   * @throws Error if layoutId doesn't exist
   * @throws Error if widget.id already exists (checks recursively)
   */
  addWidget(widget: NovelWidget, layoutId?: string): void {
    // Check for duplicate IDs recursively
    if (widget.id !== undefined && this.hasId(widget.id)) {
      throw new Error(`Widget with id "${widget.id}" already exists`);
    }

    // If no layoutId is specified, add to root
    if (layoutId === undefined) {
      this._widgets.push(widget);
      return;
    }

    // Find and add to the specified layout
    const added = this.addToLayout(widget, layoutId, this._widgets);
    if (!added) {
      throw new Error(`Layout with id "${layoutId}" not found`);
    }
  }

  /**
   * Adds a new TextWidget to a TextBoxWidget
   * @param textWidget - The TextWidget to add
   * @param textBoxId - The TextBox ID where the text should be added
   * @throws Error if textBoxId doesn't exist
   * @throws Error if textWidget.id already exists
   */
  addText(textWidget: TextWidget, textBoxId: string): void {
    // Check for duplicate IDs recursively
    if (textWidget.id !== undefined && this.hasId(textWidget.id)) {
      throw new Error(`Widget with id "${textWidget.id}" already exists`);
    }

    // Find and add to the specified textbox
    const added = this.addToTextBox(textWidget, textBoxId, this._widgets);
    if (!added) {
      throw new Error(`TextBox with id "${textBoxId}" not found`);
    }
  }

  /**
   * Recursively checks if an ID exists in the widget tree
   */
  public hasId(id: string): boolean {
    return this.hasIdInWidgets(id, this._widgets);
  }

  /**
   * Recursively checks if an ID exists in widgets
   * @returns true if found, false otherwise
   */
  private hasIdInWidgets(id: string, widgets: NovelWidget[]): boolean {
    for (const obj of widgets) {
      if (obj.id === id) {
        return true;
      }

      // Check children for Layout widgets
      if (isLayout(obj)) {
        if (this.hasIdInWidgets(id, obj.children)) {
          return true;
        }
      }

      // Check children for TextBox widgets
      if (isTextBox(obj)) {
        if (this.hasIdInWidgets(id, obj.children)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Recursively find a widget by ID
   * @returns The found widget or null if not found
   */
  private findById(id: string, widgets?: NovelWidget[]): NovelWidget | null {
    const searchWidgets = widgets ?? this._widgets;

    for (const obj of searchWidgets) {
      if (obj.id === id) {
        return obj;
      }

      // Search in children for Layout widgets
      if (isLayout(obj)) {
        const foundInChildren = this.findById(id, obj.children);
        if (foundInChildren) {
          return foundInChildren;
        }
      }

      // Search in children for TextBox widgets
      if (isTextBox(obj)) {
        const foundInChildren = this.findById(id, obj.children);
        if (foundInChildren) {
          return foundInChildren;
        }
      }
    }

    return null;
  }

  /**
   * Add widgets to layouts with the specified ID.
   * @returns true if the layout was found and widget was added, false otherwise
   */
  private addToLayout(
    widget: NovelWidget,
    layoutId: string,
    widgets: NovelWidget[],
  ): boolean {
    for (const obj of widgets) {
      if (obj.id === layoutId) {
        if (isLayout(obj)) {
          obj.children.push(widget);
          return true;
        }
        // ID matches but it's not a layout type that can have children
        return false;
      }

      // Search in children for Layout widgets
      if (isLayout(obj)) {
        if (this.addToLayout(widget, layoutId, obj.children)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Add TextWidget to TextBoxWidget with the specified ID.
   * @returns true if the textbox was found and text widget was added, false otherwise
   */
  private addToTextBox(
    textWidget: TextWidget,
    textBoxId: string,
    widgets: NovelWidget[],
  ): boolean {
    for (const obj of widgets) {
      // Found the target textbox
      if (obj.id === textBoxId) {
        if (isTextBox(obj)) {
          obj.children.push(textWidget);
          return true;
        }
        // ID matches but it's not a TextBox type
        return false;
      }

      // Search in children for Layout widgets
      if (isLayout(obj)) {
        if (this.addToTextBox(textWidget, textBoxId, obj.children)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Clears all TextWidgets in the specified TextBox
   * @param textBoxId - The ID of the TextBox to clear
   * @throws Error if textBoxId doesn't exist
   */
  public clearTextBox(textBoxId: string): void {
    const textBox = this.findById(textBoxId);
    if (!textBox || !isTextBox(textBox)) {
      throw new Error(`TextBox with id "${textBoxId}" not found`);
    }

    textBox.children = [];
  }

  /**
   * Removes a widget by ID
   * @param id - The ID of the widget to remove
   * @throws Error if the widget with the specified ID does not exist
   */
  public removeById(id: string): void {
    if (!this.hasId(id)) {
      throw new Error(`Widget with id "${id}" not found`);
    }
    const newWidgets = this.removeByIdFromWidgets(id, this._widgets);
    this._widgets = newWidgets;
  }

  /**
   * Removes a widget by ID from the specified array of widgets
   * @param id - The ID of the widget to remove
   * @param widgets - The array of widgets to remove from
   */
  private removeByIdFromWidgets(
    id: string,
    widgets: NovelWidget[],
  ): NovelWidget[] {
    const result: NovelWidget[] = [];

    for (const widget of widgets) {
      if (widget.id === id) {
        // Skip this widget to remove it
        continue;
      }

      // Recursively remove from children for Layout and TextBox widgets
      if (isLayout(widget) || isTextBox(widget)) {
        const newChildren = this.removeByIdFromWidgets(id, widget.children);
        widget.children = newChildren;
      }

      result.push(widget);
    }

    return result;
  }
}
