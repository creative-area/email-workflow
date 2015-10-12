# Email workflow

> A workflow for building emails

## Setup

### Prerequisites

```
gem install premailer hpricot
npm install -g grunt-cli
```

### Install

```
mkdir [my-awesome-email] && cd [my-awesome-email]
git clone https://github.com/florentb/email-boilerplate .
npm install
```

### Write your Email

Put your HTML file and your assets (images, CSS, SASS, etc...) in the `src` directory.

Your HTML file MUST comply the following markup :

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width"/>
    <!-- build:css email.css -->
    <link rel="stylesheet" href="[my-css-file].css">
    <link rel="stylesheet" href="[my-sass-file].css">
    [...]
    <!-- /build -->
  </head>
  <body>
  [...]
  </body>
</html>
```

**Please follow those prerequisites:**

1. All files MUST be at the root of the `src` directory (no subfolders)
2. Link your SASS/SCSS files with a `.css` extension
3. Surround your stylesheets with the special markup `<!-- build:css email.css -->[...]<!-- /build -->`

## Usage

`grunt serve` while you're working on your email design. This will open your browser and watch for changes on your files (html, css, sass).

When you're ready, `grunt build` will generate a pre-flight HTML email in the `dist` directory by :
- minifying your images
- converting your SASS to CSS
- remove unnecessary CSS  
- inlining your CSS
