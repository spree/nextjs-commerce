# [Spree Commerce][1] Provider

![Screenshots of Spree Commerce and NextJS Commerce][5]

A preview integration of Spree Commerce within NextJS Commerce. It supports browsing and searching Spree products and adding products to the cart as a guest user. [You can see it in action online.][6]

## Installation

Start by following the [instructions for setting up NextJS Commerce][2].

Afterwards, configure NextJS Commerce to use the Spree Provider. Create a `.env.local` file in the root of the project. Its contents must be based on `framework/spree/.env.template`.

`NEXT_PUBLIC_SPREE_CATEGORIES_TAXONOMY_PERMALINK` and `NEXT_PUBLIC_SPREE_BRANDS_TAXONOMY_PERMALINK` rely on taxonomies' permalinks in Spree. Go to the Spree admin panel and create Categories and Brands taxonomies if they don't exist and copy their permalinks into `.env.local` in NextJS Commerce. The values of the other environment variables can be copied from `framework/spree/.env.template` as is.

---

Setup Spree next. The easiest way to run Spree locally is to follow the installation tutorial available at [the Spree Starter GitHub repository][3].

You have to adjust Spree Starter to allow local [CORS][4] requests and have Spree run on port `4000` instead of the default port (NextJS Commerce and Spree both use port `3000` by default). To do this, add two environment variables inside `.env` in the Spree Starter project:

```shell
DOCKER_HOST_WEB_PORT=4000
ALLOWED_ORIGIN_HOSTS=*
```

Also, add the following line inside `config/environments/development.rb` to allow HTTP requests to Spree from NextJS:

```
config.hosts << 'localhost'
```

---

Finally, run `yarn dev` :tada:

[1]: https://spreecommerce.org/
[2]: https://github.com/vercel/commerce
[3]: https://github.com/spree/spree_starter
[4]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
[5]: ./README-assets/screenshots.png
[6]: https://spree-x-nextjscommerce-demo.vercel.app/