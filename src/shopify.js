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
                    displayName
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
  checkout: lineItems => request('checkout', 'products.edges', `
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
      fetch('https://dont-be-a-pig.myshopify.com/admin/api/graphql.json', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/graphql',
          'Authorization': 'Basic ZjlkMjk1YmE5OTI2YzMyMDYwNDM3MjY0Y2YyMmZiMTg6NDJhZWZmN2I0MDBjMjQyYzQyYTQ3ZWU1MGM4ODY4MDA='
        }),
        body
      })
      // stash
      .then(res => res.json())
      .then(json => {
        const shop = json.data.shop
        if (shop) {
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
