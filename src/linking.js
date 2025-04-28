const config = {
  initialRouteName: "BottomBar",
  screens: {
    ProductDetails: {
      path: "product-detail/:url_slug",
      parse: {
        url_slug: (url_slug) => `/${url_slug}`,
        product_sku: (product_sku) => product_sku,
      },
    },
    OrderinfoScreen: {
      path: "order-info/:order_id",
      parse: {
        id: (id) => id,
      },
    },
  },
};

const linking = {
  prefixes: ["http://develop.shopq.site/", "app://shopq", "develop.shopq.site"],
  config,
};

export default linking;
