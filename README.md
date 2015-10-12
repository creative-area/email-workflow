# Email workflow

> A Grunt workflow for building emails and sending them through Mailgun API

## Setup

### Prerequisites

```
gem install premailer hpricot
npm install -g grunt-cli
```

- An AWS S3 account (optional)
- A Mailgun account (optional)

### Install

```
mkdir [my-awesome-email] && cd [my-awesome-email]
git clone https://github.com/florentb/email-boilerplate .
npm install
```

### Write your Email

Put your HTML file and your assets (images, CSS, SASS, etc...) in the `src` directory.

Your HTML file MUST comply the following markup:

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

1. All files **MUST** be at the root of the `src` directory (no subfolders)
2. **Link your SASS/SCSS files with a `.css` extension** (see above)
3. Surround your stylesheets with the **special markup** `<!-- build:css email.css -->[...]<!-- /build -->`
4. **Create a `credentials.json`** at the root of your project based on the `credentials.sample.json` template file.

## Usage

**`grunt serve`** while you're working on your email design. This will open your browser and watch for changes on your files (html, css, sass).

When you're ready, issuing the **`grunt build`** command will generate a pre-flight HTML email in the `dist` directory by:
- minifying your images
- converting your SASS to CSS
- remove unnecessary CSS  
- inlining your CSS

### CDN Option

If you have an S3 account, you build a CDN version of your email by running **`grunt upload`**.

This will:
- upload your files to your S3 bucket
- create a CDN version in your local `dist` folder

> Note: the `grunt upload` will automatically invoke the `grunt build` command.

### Sendmail Option

If you have a Mailgun account, you can send a test email by running **`grunt send`**.

As this option need the CDN version of your email, you **MUST** configure an S3 account.

> Note: the `grunt send` will automatically invoke the `grunt build` and the `grunt upload` commands.
