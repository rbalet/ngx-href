# ngx-href
A library that allows href to understand Angular's router while retaining its default functionality.

![NPM](https://img.shields.io/npm/l/ngx-href)
[![npm version](https://img.shields.io/npm/v/ngx-href.svg)](https://www.npmjs.com/package/ngx-href)
![npm bundle size](https://img.shields.io/bundlephobia/min/ngx-href)
![npm](https://img.shields.io/npm/dm/ngx-href)
[![codecov](https://codecov.io/gh/rbalet/ngx-href/graph/badge.svg?token=1Z1BJUFQD2)](https://codecov.io/gh/rbalet/ngx-href)

1. Use `router.navigate()` for [internal link](#angular-routing)
2. Support scroll with the `#` attributes and let you configure the [scrolling logic](#scroll-logic)
3. Automatically append `rel="nooepener"` & `target="_blank"` to external link [if wished so](#installation)
4. Support using `href` with the html `button` [attribute](#directive)
5. Enable easy `Scroll when ready` mechanism which works with `SSR`
6. Let you transform text to well formatted `anchor`

## Demo
- https://stackblitz.com/~/github.com/rbalet/ngx-href

## 19.0.0 Breaking change
* **Now use `scrollIntoView` which render the `Offset` useless.**  
* Please use [scroll-margin-top](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top) instead.
* Nows also work on SSR

## Installation

```sh
npm install ngx-href
```

Inside your `app.module.ts` file.
```typescript
import { NgxHrefModule } from 'ngx-href'

  imports: [
    /** Default
     * avoidSpam="false"
     * behavior="auto"
     * block="start"
     * inline="nearest"
     * rel=undefined
     * retryTimeout=undefined
     * target="_self"
     **/ 
    NgxHrefModule.forRoot({}), 

    // Or
    NgxHrefModule.forRoot({
      avoidSpam: true,
      behavior:"smooth",
      block:"center",
      inline:"nearest",
      rel:"noopener nofollow",
      retryTimeout: 300,
      target:"_blank",
    }),
  ],
```

## Angular routing
Nothing to do it should work out of the box

## Avoid Spam
1. Change the `href` from the DOM from `example@outlook.com` into `example(at)outlook.com` 
2. Let js handle the click event.   

## Scroll logic
### Behavior
**Default:** `"auto"`  
**Accepted value:** `ScrollBehavior`  // ("auto" | "instant" | "smooth")  

Can also be passed individually directly through html
```html
<a href="https://my-external-url.com" behavior="instant">
```

### Offset
If you wish to add offset, add `scroll-margin-top: $offset` to your targeted component -> [read more](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top)

### retryTimeout
**Default:** `undefined`
**Accepted value:** `number`

Trigger a second `scrollTo` event after `retryTimeout` milliseconds.  

**Note:** This should be avoided, prefer playing with skeleton and fixed height


## External link
### Rel attribute 
**Default:** `undefined`  
**Accepted value:** [string](https://developer.mozilla.org/fr/docs/Web/HTML/Attributes/rel)

Can also be passed individually directly through html
```html
<a href="https://my-external-url.com" rel="noopener nofollow">
```

### Target attribute 
**Default:** `"_self"`  
**Accepted value:** [string](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target)

Can also be passed individually directly through html
```html
<a href="https://my-external-url.com" target="_blank">
```

## Usage
Wherever you plan to use the href directive or pipe

```typescript
import { NgxHrefDirective, ToAnchorPipe } from 'ngx-href'

imports: [
  NgxHrefDirective,
  ToAnchorPipe,
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

<!-- Or with a button -->
<button href="/angular/router/link">
  My internal link
</button>


<!-- External link -->
<a href="https://external-url.com">
  An external link
</a>

<!-- Tel -->
<a href="tel:+41791112233">
  +41791112233
</a>

<!-- Email -->
<a href="mailto:foobar@outlook.com">
  foobar&#64;outlook.com
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

### Pipe: _ToAnchorPipe_
The `toAnchor` pipe let you 
1. transform an element ot a correct anchor
example: `my Title $%` will be transform to `my-title`

2. Emit that this anchor have been created, so that we can scroll to that element

```html
  <!-- Just transform the title to anchor like string-->
  <div [id]="my Title $%"| toAnchor : false"> </div>

  <!-- If an href has been previously triggered, scroll to this element -->
  <div [id]="my Title $%"| toAnchor"> </div>
```

### Service
```typescript
// foo.component.ts
import { NgxHrefService } from 'ngx-href'

// ...
 constructor(public ngxHrefService: NgxHrefService) {}
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

[![BuyMeACoffee](https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png)](https://www.buymeacoffee.com/widness)
