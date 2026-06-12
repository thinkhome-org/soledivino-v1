import { getProducts } from "../lib/content";
import ProductsView from "./products-view";

export default async function ProductsPage() {
    const products = await getProducts();

    return <ProductsView products={products} />;
}
