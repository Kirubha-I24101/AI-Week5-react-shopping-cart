import { useCartContext } from './CartContextProvider';
import useCartTotal from './useCartTotal';
import { ICartProduct } from 'models';

const useCartProducts = () => {
  const { products, setProducts } = useCartContext();
  const { updateCartTotal } = useCartTotal();

  const updateQuantitySafely = (
    currentProduct: ICartProduct,
    targetProduct: ICartProduct,
    quantity: number
  ): ICartProduct => {
    if (currentProduct.id === targetProduct.id) {
      return {
        ...currentProduct,
        quantity: Math.max(1, currentProduct.quantity + quantity),
      };
    }
    return currentProduct;
  };

  const addProduct = (newProduct: ICartProduct) => {
    const isProductAlreadyInCart = products.some(
      (product: ICartProduct) => newProduct.id === product.id
    );

    let updatedProducts;
    if (isProductAlreadyInCart) {
      updatedProducts = products.map((product: ICartProduct) =>
        product.id === newProduct.id
          ? { ...product, quantity: product.quantity + newProduct.quantity }
          : product
      );
    } else {
      updatedProducts = [...products, newProduct];
    }

    setProducts(updatedProducts);
    updateCartTotal(updatedProducts);
  };

  const removeProduct = (productToRemove: ICartProduct) => {
    const updatedProducts = products.filter(
      (product: ICartProduct) => product.id !== productToRemove.id
    );
    setProducts(updatedProducts);
    updateCartTotal(updatedProducts);
  };

  const increaseProductQuantity = (productToIncrease: ICartProduct) => {
    const updatedProducts = products.map((product: ICartProduct) =>
      product.id === productToIncrease.id
        ? { ...product, quantity: product.quantity + 1 }
        : product
    );
    setProducts(updatedProducts);
    updateCartTotal(updatedProducts);
  };

  const decreaseProductQuantity = (productToDecrease: ICartProduct) => {
    const updatedProducts = products.map((product: ICartProduct) =>
      product.id === productToDecrease.id
        ? { ...product, quantity: Math.max(1, product.quantity - 1) }
        : product
    );
    setProducts(updatedProducts);
    updateCartTotal(updatedProducts);
  };

  return {
    products,
    addProduct,
    removeProduct,
    increaseProductQuantity,
    decreaseProductQuantity,
  };
};

export default useCartProducts;
