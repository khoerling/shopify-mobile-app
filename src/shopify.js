const
  storage = require('./storage'),
  {get} = require('object-path')

module.exports = {
  request,
  getProducts: request('getProducts', 'products.edges', `
    {
      shop {
        products(first: 20, reverse: true, query:"NOT tag:'Archive' AND tag:'Meal' AND product_type:'Meal'") {
          edges {
            node {
              id
              title
              descriptionHtml
              productType
              tags
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price
                  }
                }
              }
              priceRange {
                maxVariantPrice {
                  amount
                }
              }
              images(first: 1) {
                edges {
                  node {
                    transformedSrc
                  }
                }
              }
            }
          }
        }
      }
    }
  `),

  checkout: lineItems => request('checkout', '', `
    mutation {
      checkoutCreate(input: {
        lineItems: ${JSON.stringify(lineItems)}
      }) {
        checkout {
          id
          webUrl
          lineItems(first: 5) {
            edges {
              node {
                title
                quantity
              }
            }
          }
        }
      }
    }
  `),
}

// ---------
async function request(key, path, body) {
  const
    k = `gql:${key}`,
    data = await storage.get(k),
    req = _ =>
      // kick-off fresh query
      fetch('https://dont-be-a-pig.myshopify.com/api/graphql', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/graphql',
          'X-Shopify-Storefront-Access-Token': '3c29bc34521cc79fa99cbb7e83ace6b6',
        }),
        body
      })
      // stash
      .then(res => res.json())
      .then(json => {
        if (json.data && json.data.shop) {
          const shop = json.data.shop
          // success
          const value = get(shop, path)
          // storage.set(k, value)
          return value
        } else {
          // error
          return json
        }
      })
      .catch(err => cw(`request error ${err}`))
  // if (data) {
  //   req() // freshen
  //   return data
  // } else {
  //   return req()
  // }
  return req()
}
