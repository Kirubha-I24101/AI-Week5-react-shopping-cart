import React, { useMemo } from 'react';
import { useCart } from 'contexts/cart-context';
import CartProduct from './CartProduct/CartProduct';
import * as S from './style';

const CartProducts = () => {
  const { products } = useCart();

  // Performance monitoring
  console.time('filterProducts');
  const filteredProducts = useMemo(
    () => products.filter(p => p.quantity > 0),
    [products]
  );
  console.timeEnd('filterProducts');

  return (
    <S.Container>
      {filteredProducts.length ? (
        filteredProducts.map((product) => (
          <CartProduct key={product.sku} product={product} />
        ))
      ) : (
        <S.CartProductsEmpty>
          Add some products in the cart <br />
          :)
        </S.CartProductsEmpty>
      )}
    </S.Container>
  );
};

export default CartProducts;
