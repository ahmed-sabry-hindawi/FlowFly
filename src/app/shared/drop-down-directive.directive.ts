import { Directive ,HostListener, HostBinding,ElementRef} from '@angular/core';

@Directive({
  selector: '[appDropDownDirective]'
})
export class DropDownDirectiveDirective {

  @HostBinding('class.open') isOpen= false ;

  constructor(private elRef: ElementRef) { }


  // @HostListener('click') toggleOpen() {
  //   this.isOpen=!this.isOpen;
  // }

  


  @HostListener('document:click', ['$event']) toggleOpen2(event: Event) {

    //alert("alert 1 item name: "+this.elRef.nativeElement.itemName);
    //alert("alert 2 : event :"+event.target);
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }

}
