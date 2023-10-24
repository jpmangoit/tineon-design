import {Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'vc-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
/**
 *  DropdownComponent provides a customizable dropdown menu tailored for enhanced usability and flexibility.
 *
 *  Features:
 * - **Display Customization**: Allows the user to set the displayed name and binding value for the items,
 *  ensuring adaptability for various data structures. The binding value is the value that will be returned.
 * - **Emits Selected Item**: Emits the selected item when it is selected, useful for one-way binding.
 * - **Reactive Forms Support**: Supports reactive forms by implementing ControlValueAccessor.
 * - **Two-way Binding**: Supports two-way binding for seamless data updates between the dropdown and its parent component with property _`selectedItemChange`_.
 * - **Click-outside Handling**: Closes the dropdown if clicked outside, providing a user-friendly experience.
 * - ** Custom Styling**: Allows the user to set custom styles for the dropdown items and the selected item with classes. Inline styles are only supported for the selected item.
 *
 * @property {any[]} items - The items to display in the dropdown.
 * @property {string} displayName - The name of the property to display in the dropdown.
 * @property {string} bindValue - The name of the property to bind to the dropdown's value.
 * @property {EventEmitter<any>} itemSelected - Emit the selected item when it is selected.
 * @property {EventEmitter<any>} selectedItemChange - Emit the selected item when it is changed, useful for two-way binding.
 *
 * @example
 * <vc-dropdown (itemSelected)="onItemSelected($event)" [items]="dropDownItems" bindValue="id" [selectedItemStyle]="{backgroundColor: 'red', fontSize: '20px'}"
 *    displayName="companyName" formControlName="groupFilter"></vc-dropdown>
 *
 * This example demonstrates how to use the DropdownComponent with a list of company items, displaying company names
 * and binding to company IDs. The selected item is then managed via a form control named 'groupFilter'.
 *
 * Not Supported:
 * - Multi-select: Multi-select is not supported.
 * - Search: Search is not supported.
 * - Filtering: Filtering is not supported.
 * - Nested Items: Nested items are not supported.
 * - Keyboard Navigation: Keyboard navigation is not supported.
 * - Custom Templates: Custom templates are not supported.
 * - Custom Dropdown Content: Custom dropdown content is not supported.
 * - Custom Dropdown Positioning: Custom dropdown positioning is not supported.
 * - Custom Dropdown Width: Custom dropdown width is not supported.
 * - Custom Dropdown Height: Custom dropdown height is not supported.
 * - Custom Dropdown Scroll: Custom dropdown scroll is not supported.
 *
 */
export class DropdownComponent implements ControlValueAccessor, OnInit {

  /**
   * The list of items to be displayed in the dropdown.
   * Expected to be an array of objects.
   */
  @Input() items: any[] = [];

  /**
   * The property of the item object to be displayed in the dropdown.
   */
  @Input() displayName: string;

  /**
   * The property of the item object that should be used for binding.
   * If not provided, the whole item object will be used.
   */
  @Input() bindValue: string;

  /**
   * The class to be applied to the dropdown items.
   * Either the class should be in the global scope or inside the component's stylesheet.
   */
  @Input() itemsClass: any;

  /**
   * The class to be applied to the selected item.
   * Either the class should be in the global scope or inside the component's stylesheet.
   */
  @Input() selectedItemClass: any;


  /**
   * The style to be applied to the dropdown items.
   * It should be an object with key-value pairs.
   * @example
   * <vc-dropdown [selectedItemStyle]="{color: 'red', 'font-size': '20px'}"></vc-dropdown>
   */
  @Input() selectedItemStyle: any;


  /**
   * Emits the selected item when a selection is made.
   */
  @Output() itemSelected = new EventEmitter<any>();

  /**
   * Emits the selected item for two-way binding purposes.
   */
  @Output() selectedItemChange = new EventEmitter<any>();

  /** Determines if the dropdown is currently open or not. */
  isOpen = false;

  /**
   * Holds the complete selected item object.
   */
  private _fullSelectedItem: any;

  constructor(private eRef: ElementRef) {
  }

  private _selectedItem?: any;

  /**
   * Getter for the selected item.
   * @returns The selected item.
   */
  get selectedItem() {
    return this._selectedItem;
  }

  /**
   * Set the selected item
   * It will overwrite the value of formControl and also set the control value
   */
  @Input()
  set selectedItem(item: any) {
    if (item) {
      this._selectedItem = item;
      this.selectedItemChange.emit(this._selectedItem);
      this.itemSelected.emit(this._selectedItem);
    }
  }

  /**
   * Determines the value to be displayed in the dropdown based on the selected item.
   */
  get displayValue() {
    if (this.selectedItem) {
      if (typeof this.selectedItem === 'object') {
        return this.getPropertyValue(this.selectedItem, this.displayName, ['name', 'title'], 'No name');
      } else {
        if (this.bindValue && this._fullSelectedItem) {
          return this.getPropertyValue(this._fullSelectedItem, this.displayName, ['name', 'title'], 'No name');
        } else {
          return this.selectedItem;
        }
      }
    } else {
      return 'Select Option';
    }
  }

  /**
   * Listener to handle click events outside of the dropdown component.
   * Helps in closing the dropdown if clicked outside.
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Validates the items provided as input.
   */
  ngOnInit() {
    if (!Array.isArray(this.items) || !this.items.every(item => typeof item === 'object')) {
      throw new Error('Expected items to be an array of objects.');
    }
  }

  /**
   * Writes a new value to the element. Implementation for ControlValueAccessor.
   * so the dropdown can be used with reactive forms.
   */
  writeValue(value: any): void {
    this._selectedItem = value;
  }

  /**
   * Registers a callback function that should be called when the control's value changes in the UI.
   */
  registerOnChange(fn: any): void {
    this.itemSelected.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
  }

  /**
   * Toggles the dropdown open or close state.
   */
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  /**
   * Handles the selection of an item from the dropdown.
   */
  selectItem(item: any) {
    if (this.bindValue) {
      this._fullSelectedItem = item;
      this.selectedItem = this.getPropertyValue(item, this.bindValue, [], null);
    } else {
      this.selectedItem = item;
    }
    this.isOpen = false;
  }

  /**
   * Checks if a given item is the currently selected item.
   */
  isItemSelected(item: any): boolean {
    const existingItem = this.bindValue ? this.getPropertyValue(item, this.bindValue, ['name', 'title'], null) : item;
    return item === this.selectedItem || this.selectedItem === existingItem;
  }

  /**
   * Retrieves the display name for a given item for opened dropdown content items list.
   * If the displayName property is provided, it will be used.
   * Otherwise, it will try to use the name or title property.
   */
  getDisplayName(item: any) {
    return this.getPropertyValue(item, this.displayName, ['name', 'title'], 'No name');
  }

  /**
   * Utility function to retrieve a property value from an object with fallbacks.
   */
  private getPropertyValue(obj: any, primaryProp: string, fallbackProps: string[], defaultValue: any) {
    if (primaryProp && obj.hasOwnProperty(primaryProp)) {
      return obj[primaryProp];
    }

    for (const prop of fallbackProps) {
      if (obj.hasOwnProperty(prop)) {
        return obj[prop];
      }
    }

    return defaultValue;
  }
}

