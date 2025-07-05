import React, { useCallback, useMemo } from 'react';
import formatPrice from 'utils/formatPrice';
import { ICartProduct } from 'models';
import { useCart } from 'contexts/cart-context';
import * as S from './style';

interface IProps {
  product: ICartProduct;
}

const CartProduct = React.memo(({ product }: IProps) => {
  // Performance monitoring
  console.time(`CartProduct-${product.id}`);

  const { removeProduct, increaseProductQuantity, decreaseProductQuantity } = useCart();

  const handleRemoveProduct = useCallback(() => removeProduct(product), [removeProduct, product]);
  const handleIncreaseProductQuantity = useCallback(() => increaseProductQuantity(product), [increaseProductQuantity, product]);
  const handleDecreaseProductQuantity = useCallback(() => decreaseProductQuantity(product), [decreaseProductQuantity, product]);

  const imageSrc = useMemo(
    () => require(`static/products/${product.sku}-1-cart.webp`),
    [product.sku]
  );

  // End performance monitoring
  console.timeEnd(`CartProduct-${product.id}`);

  return (
    <S.Container>
      <S.DeleteButton
        onClick={handleRemoveProduct}
        title="remove product from cart"
      />
      <S.Image
        src={imageSrc}
        alt={product.title}
      />
      <S.Details>
        <S.Title>{product.title}</S.Title>
        <S.Desc>
          {`${product.availableSizes[0]} | ${product.style}`} <br />
          Quantity: {product.quantity}
        </S.Desc>
      </S.Details>
      <S.Price>
        <p>{`${product.currencyFormat}  ${formatPrice(product.price, product.currencyId)}`}</p>
        <div>
          <S.ChangeQuantity
            onClick={handleDecreaseProductQuantity}
            disabled={product.quantity === 1}
          >
            -
          </S.ChangeQuantity>
          <S.ChangeQuantity onClick={handleIncreaseProductQuantity}>
            +
          </S.ChangeQuantity>
        </div>
      </S.Price>
    </S.Container>
  );
});

export default CartProduct;
