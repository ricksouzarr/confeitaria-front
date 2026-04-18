import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductForm from "../pages/products/ProductForm";
import UnitsList from "../pages/units/UnitsList";
import ProductList from "../pages/products/ProductList";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produtos/cadastro" element={<ProductForm />} />
                <Route path="/unidades" element={<UnitsList />} />
                <Route path="/produtos" element={<ProductList />} />
            </Routes>
        </BrowserRouter>
    );
}