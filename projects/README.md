# @ngx-href [![npm version](https://img.shields.io/npm/v/ngx-href.svg)](https://www.npmjs.com/package/ngx-href)

[![BuyMeACoffee](https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png)](https://www.buymeacoffee.com/widness)

A library that allows href to understand Angular's router while retaining its default functionality.
1. Use `router.navigate()` for [internal link](#angular-routing)
2. Support scroll with the `#` attributes and let you configure the [scrolling logic](#scroll-logic)
3. Automatically append `rel="nooepener"` & `target="_blank"` to external link [if wished so](#installation)

- [@ngx-href ](#ngx-href-)
  - [Installation](#installation)
  - [Angular routing](#angular-routing)
  - [Scroll logic](#scroll-logic)
    - [Behavior](#behavior)
    - [defaultOffset](#defaultoffset)
    - [navbarOffset](#navbaroffset)
  - [External link](#external-link)
    - [Rel attribute](#rel-attribute)
    - [Target attribute](#target-attribute)
    - [target attribute](#target-attribute-1)
  - [Usage](#usage)
    - [Directive](#directive)
    - [Service](#service)
  - [Authors and acknowledgment](#authors-and-acknowledgment)

## Installation

```sh
npm install ngx-href
```

Inside your `app.module.ts` file.
```typescript
import { ngxHrefModule, ngxHrefService } from 'ngx-href'

  imports: [
    /** Default
     * behavior="smooth"
     * defaultOffset="30"
     * navbarOffset="60"
     * rel="noopener"
     * target="_blank"
     **/ 
    ngxHrefModule.forRoot({}), 

    // Or
    ngxHrefModule.forRoot({
      behavior:"instant",
      defaultOffset:"30",
      navbarOffset:"60",
      rel:"noopener nofollow",
      target:"_self",
    }),
  ],
```

## Angular routing
Nothing to do it should work out of the box

## Scroll logic
### Behavior
**Default:** `"smooth"`  
**Accepted value:** `ScrollBehavior`  // ("auto" | "instant" | "smooth")  

Can also be passed individually directly through html
```html
<a href="https://my-external-url.com" behavior="instant">
```

### defaultOffset
The standard offset to be added to your website `scrollTo` logic

**Default:** `30`  
**Accepted value:** `number`  
Together with the `navbarOffset` will be the total offset for the scroll.

### navbarOffset
An additional offset calculated base on your navbar height

**Default:** `60`
**Accepted value:** `number`
Together with the `defaultOffset` will be the total offset for the scroll.

You can update this value after the navbar is rendered.

```html
<navbar #navbar>
   <!-- My html code -->
</navbar>
```

```typescript
@ViewChild('navbar', { static: true }) navbar: ElementRef

constructor(
  private _ngxHrefService: NgxHrefService,
) {}

ngAfterContentInit(): void {  
  this._ngxHrefService.navbarOffset = this.navbar.nativeElement.offsetHeight
}
```


## External link
### Rel attribute 
**Default:** `"noopener"`  
**Accepted value:** [string](https://developer.mozilla.org/fr/docs/Web/HTML/Attributes/rel)

Can also be passed individually directly through html
```html
<a href="https://my-external-url.com" rel="noopener nofollow">
```

### Target attribute 
**Default:** `"_blank"`  
**Accepted value:** [string](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target)

Can also be passed individually directly through html
```html
<a href="https://my-external-url.com" target="_self">
```

### target attribute


## Usage
Wherever you plan to use the href directive

```typescript
import { ngxHrefModule } from 'ngx-href'

imports: [
  ngxHrefModule,
]
```

Then you can use it as you would normally use an `a` element 

### Directive
Normal use
```html
<!-- Angular router -->
<a href="/angular/router/link">
  My internal link
</a>

<!-- External link -->
<a href="https://external-url.com">
  An external link
</a>


<!-- Scroll -->
<a href="#myAnchor">
  My scroll to anchor
</a>

<!-- Scroll in different page -->
<a href="/angular/router#link">
  My internal link with anchor
</a>
```


### Service
```typescript
// foo.component.ts
import { ngxHrefService } from 'ngx-href'

// ...
 constructor(public ngxHrefService: ngxHrefService) {}
```

Normal use
```html
<button (click)="ngxHrefService.scrollTo(#myAnchor)">
  Scroll to #myAnchor
</button>

<!-- some html -->

<h2 id="myAnchor">A title</h2>
```

## Authors and acknowledgment
* maintainer [Raphaël Balet](https://github.com/rbalet)
