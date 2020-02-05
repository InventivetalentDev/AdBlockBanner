# AdBlockBanner
Tiny script to detect ad blockers and display a custom message in ad regions

![](https://yeleha.co/2u3UPs6)


## Installation
```html
<script>
    window.ABB_config = {
        text: "Hi! Please disable your AdBlocker for this site to keep it running, thanks :)", // Text to be displayed
        selectors: [".adsbygoogle"], // Ad Region selectors - should be the element that usually contains the ad body
    }
</script>
<script src="https://unpkg.com/adblockbanner@1.0.2/abb.min.js"></script>
```

```
npm install --save adblockbanner
```


## Configuration
```js
{
    text: "Hi! Please disable your AdBlocker for this site to keep it running, thanks :)", // Text to be displayed
    selectors: [".adsbygoogle"], // Ad Region selectors - should be the element that usually contains the ad body
    backgroundColor: '#e10000',
    textColor: '#000000',
    wrapperStyle: 'border-radius: 5px',
    textStyle: 'text-align: center; font-size: 2rem; font-family:',
    delay: 2000,
    insertPosition: 'before' // before, after, inside
}
```
