import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductForm from "../pages/products/ProductForm";
import UnitsList from "../pages/units/UnitsList";
import ProductList from "../pages/products/ProductList";
import ProductTechnicalSheet from "../pages/products/ProductTechnicalSheet";
import LaborSettings from "../pages/settings/LaborSettings";
import IngredientForm from "../pages/ingredients/IngredientForm";
import IngredientList from "../pages/ingredients/IngredientList";
import PackagingForm from "../pages/packaging/PackagingForm";
import PackagingList from "../pages/packaging/PackagingList";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produtos" element={<ProductList />} />
                <Route path="/produtos/cadastro" element={<ProductForm />} />
                <Route path="/produtos/editar/:id" element={<ProductForm />} />
                <Route path="/produtos/:id/ficha-tecnica" element={<ProductTechnicalSheet />} />
                <Route path="/unidades" element={<UnitsList />} />
                <Route path="/configuracoes/mao-de-obra" element={<LaborSettings />} />
                <Route path="/ingredientes" element={<IngredientList />} />
                <Route path="/ingredientes/cadastro" element={<IngredientForm />} />
                <Route path="/ingredientes/editar/:id" element={<IngredientForm />} />

                <Route path="/embalagens" element={<PackagingList />} />
                <Route path="/embalagens/cadastro" element={<PackagingForm />} />
                <Route path="/embalagens/editar/:id" element={<PackagingForm />} />
            </Routes>
        </BrowserRouter>
    );
}